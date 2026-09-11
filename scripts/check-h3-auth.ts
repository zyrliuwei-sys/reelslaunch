// Exercises real auth/database handlers with an in-process mail sink. Sends no mail.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';

import { envConfigs } from '../src/config';
import {
  account,
  session,
  user,
  userRole,
  verification,
} from '../src/config/db/schema';
import { getAuth } from '../src/core/auth';
import { db } from '../src/core/db';
import { CloudflareEmailProvider } from '../src/core/email/cloudflare';
import { ResendProvider } from '../src/core/email/resend';

const email = `auth-check-${randomUUID()}@example.invalid`;
const password = randomUUID();
let verificationUrl = '';
let sends = 0;
function findUrl(node: any): void {
  if (!node || typeof node !== 'object') return;
  if (
    typeof node.props?.href === 'string' &&
    node.props.href.includes('/verify-email?')
  )
    verificationUrl = node.props.href;
  for (const child of [node.props?.children].flat(Infinity)) findUrl(child);
}
const sink = async (message: any) => {
  sends++;
  findUrl(message.react);
  return { success: true, provider: 'test-sink', messageId: 'test' };
};
ResendProvider.prototype.sendEmail = sink;
CloudflareEmailProvider.prototype.sendEmail = sink;
Object.assign(envConfigs, {
  resend_api_key: 're_test_placeholder',
  resend_sender_email: 'test@example.invalid',
});
const auth = getAuth({
  ...envConfigs,
  app_url: 'http://localhost:3000',
  auth_url: 'http://localhost:3000',
  email_verification_enabled: 'true',
});
const call = (path: string, body?: unknown, cookie?: string) =>
  auth.handler(
    new Request(`http://localhost:3000/api/auth/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  );
let userId: string | undefined;
try {
  const registered = await call('sign-up/email', {
    name: 'Auth check',
    email,
    password,
    callbackURL: '/cost-calculator',
  });
  assert.equal(registered.status, 200, 'registration');
  userId = (await registered.json()).user.id;
  assert.equal(sends, 1, 'one verification message');
  assert.ok(verificationUrl, 'verification URL generated');
  const unverified = await call('sign-in/email', { email, password });
  assert.equal(unverified.status, 403, 'unverified login denied');
  const verified = await auth.handler(new Request(verificationUrl));
  assert.equal(verified.status, 302, 'verification redirects');
  const signedIn = await call('sign-in/email', { email, password });
  assert.equal(signedIn.status, 200, 'verified login');
  const cookie = signedIn.headers
    .getSetCookie()
    .map((value: string) => value.split(';')[0])
    .join('; ');
  assert.ok(cookie.includes('session_token'), 'persistent session cookie');
  for (let i = 0; i < 2; i++) {
    const current = await call('get-session', undefined, cookie);
    assert.equal(
      (await current.json()).user.id,
      userId,
      'session survives subsequent requests'
    );
  }
  const base = process.env.H3_CHECK_ORIGIN || 'http://localhost:3001';
  const mainText = (html: string) =>
    html
      .match(/<main[ >][\s\S]*?<\/main>/)?.[0]
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  for (const path of [
    '/',
    '/cost-calculator',
    '/prompt-generator',
    '/vs/veo-3-1',
  ]) {
    const [anonymous, authenticated] = await Promise.all([
      fetch(base + path),
      fetch(base + path, { headers: { Cookie: cookie } }),
    ]);
    assert.equal(anonymous.status, 200, path);
    assert.equal(authenticated.status, 200, path);
    const [a, b] = await Promise.all([anonymous.text(), authenticated.text()]);
    assert.ok(mainText(a), 'SSR main exists');
    assert.equal(
      mainText(a),
      mainText(b),
      `SSR text is session-independent: ${path}`
    );
  }
  console.log(
    'PASS all four public pages return identical SSR main text with and without a valid session cookie.'
  );
  await call('sign-out', {}, cookie);
  const ended = await call('get-session', undefined, cookie);
  assert.equal(await ended.json(), null, 'logout invalidates session');
  console.log(
    'PASS registration → verification → login → repeated session requests → logout; mail stayed in-process.'
  );
} finally {
  if (!userId)
    userId = (await db().select().from(user).where(eq(user.email, email)))[0]
      ?.id;
  if (userId) {
    await db().delete(session).where(eq(session.userId, userId));
    await db().delete(account).where(eq(account.userId, userId));
    await db().delete(userRole).where(eq(userRole.userId, userId));
    await db().delete(user).where(eq(user.id, userId));
  }
  await db().delete(verification).where(eq(verification.identifier, email));
}
process.exit(0);
