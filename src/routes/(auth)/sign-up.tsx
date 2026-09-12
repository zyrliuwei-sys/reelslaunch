import { useEffect, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { signIn, signUp, useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { apiPost } from '@/lib/api-client';
import { authRouteHead } from '@/lib/auth-route-head';
import { resolveAfterAuthUrl, safeInternalPath } from '@/lib/redirect';
import { m } from '@/paraglide/messages.js';
import { localizeHref } from '@/paraglide/runtime.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import { TextField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';

import {
  AuthDivider,
  authInputClass,
  authLabelClass,
  AuthSocialButtons,
} from './-auth-ui';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteCode: z.string(),
  privacyConsent: z
    .boolean()
    .refine(Boolean, m['common.sign.privacy_required']()),
});

function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  // Set right before we navigate so the already-signed-in effect doesn't also fire.
  const navigatingRef = useRef(false);
  const [error, setError] = useState('');

  const [redirectParam, setRedirectParam] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectParam(params.get('redirect'));
    setCallbackUrl(params.get('callbackUrl'));
  }, []);

  // Already signed in (visited /sign-up directly, or a stale callbackUrl looped
  // back here) → go home. The auth pages never gate themselves, so this can't loop.
  useEffect(() => {
    if (sessionPending || navigatingRef.current) return;
    if (session?.user) {
      navigatingRef.current = true;
      router.push('/');
    }
  }, [sessionPending, session?.user, router]);

  // Allow only same-site relative paths, and never an auth page (would loop).
  const safeCallbackUrl = safeInternalPath(callbackUrl);

  const afterLoginUrl = resolveAfterAuthUrl({
    redirect: redirectParam,
    callbackUrl,
    fallback: '/',
  });

  // Carry callbackUrl/redirect across to sign-in so the destination survives the switch.
  const switchQuery = (() => {
    const p = new URLSearchParams();
    if (safeCallbackUrl) p.set('callbackUrl', safeCallbackUrl);
    if (redirectParam) p.set('redirect', redirectParam);
    const s = p.toString();
    return s ? `?${s}` : '';
  })();

  const configQuery = usePublicConfig();
  const configs = configQuery.data ?? {};

  const configsLoaded = configQuery.isSuccess;
  const emailEnabled = configs.email_auth_enabled !== 'false';
  const googleEnabled = configs.google_auth_enabled === 'true';
  const githubEnabled = configs.github_auth_enabled === 'true';
  const emailVerificationEnabled =
    configs.email_verification_enabled === 'true';
  const inviteCodeRequired = configs.invite_code_required === 'true';
  const hasSocial = googleEnabled || githubEnabled;
  const hasAnyMethod = emailEnabled || hasSocial;

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      privacyConsent: false,
      inviteCode: '',
    },
    validators: { onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      setError('');
      const trimmedInvite = value.inviteCode.trim();
      if (inviteCodeRequired && !trimmedInvite) {
        setError(m['common.sign.invite_code_required']());
        return;
      }
      try {
        // Pre-validate invite code so we don't create an unredeemable account.
        if (inviteCodeRequired) {
          try {
            await apiPost('/api/invite-codes/validate', {
              code: trimmedInvite,
            });
          } catch (err: any) {
            setError(err?.message || m['common.sign.invite_code_invalid']());
            return;
          }
        }

        const signupPayload = {
          name: value.email.split('@')[0],
          privacyConsent: value.privacyConsent,
          callbackURL: localizeHref(afterLoginUrl),
          email: value.email,
          password: value.password,
        };
        const result = await signUp.email(signupPayload);
        if (result.error) {
          setError(result.error.message || 'Sign up failed');
          return;
        }

        // Try to redeem when feature is enabled.
        // - Without email verification: we have a session immediately, redeem now.
        // - With email verification: redeem after sign-in; we still attempt now in
        //   case autoSignIn is on, and silently swallow the unauthorized failure.
        if (inviteCodeRequired && trimmedInvite) {
          try {
            await apiPost('/api/invite-codes/redeem', { code: trimmedInvite });
          } catch {}
        }

        if (emailVerificationEnabled) {
          const verifyPath = `/verify-email?sent=1&email=${encodeURIComponent(
            value.email
          )}&callbackUrl=${encodeURIComponent(afterLoginUrl)}`;
          router.push(verifyPath);
        } else {
          // Hard navigation so the destination reloads with a fresh session
          // cookie — a client push would let the guard read a stale (logged-out)
          // session store and bounce straight back to /sign-in.
          navigatingRef.current = true;
          window.location.assign(localizeHref(afterLoginUrl));
        }
      } catch (err: any) {
        setError(err.message || 'Sign up failed');
      }
    },
  });

  async function handleSocial(provider: 'google' | 'github') {
    if (!form.state.values.privacyConsent) {
      setError(m['common.sign.privacy_required']());
      return;
    }
    await signIn.social({ provider, callbackURL: afterLoginUrl });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-50">
      <div className="flex w-full max-w-sm flex-col">
        <Link href="/" className="self-center font-serif text-lg italic">
          {configs.app_name || envConfigs.app_name}
        </Link>

        <div className="mt-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            {m['common.sign.sign_up_title']()}
          </h1>
          <Link
            href={`/sign-in${switchQuery}`}
            className="text-sm font-medium text-zinc-400 underline-offset-4 hover:text-zinc-50 hover:underline"
          >
            {m['common.sign.sign_in_title']()}
          </Link>
        </div>

        {configsLoaded && !hasAnyMethod ? (
          <div className="mt-8 rounded-lg border border-dashed border-white/15 p-6 text-center">
            <p className="text-sm font-medium">
              {m['common.sign.no_methods_title']()}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {m['common.sign.no_methods_description']()}
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <form.Field name="privacyConsent">
              {(field) => (
                <div className="text-sm text-zinc-300">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      form="email-signup"
                      required
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="mt-1"
                    />
                    {m['common.sign.privacy_consent']()}
                  </label>
                  <Link
                    href="/privacy-policy"
                    className="mt-2 inline-block underline"
                  >
                    {m['h3.footer.privacy']()}
                  </Link>
                  <p className="mt-2 text-xs text-zinc-400">
                    {m['common.sign.privacy_notice']()}
                  </p>
                </div>
              )}
            </form.Field>
            {emailEnabled && (
              <form
                id="email-signup"
                className="mt-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup className="gap-5">
                  <form.Field name="email">
                    {(field) => (
                      <TextField
                        field={field}
                        label={m['common.sign.email_title']()}
                        type="email"
                        autoComplete="email"
                        required
                        placeholder={m['common.sign.email_placeholder']()}
                        labelClassName={authLabelClass}
                        inputClassName={authInputClass}
                      />
                    )}
                  </form.Field>
                  <form.Field name="password">
                    {(field) => (
                      <TextField
                        field={field}
                        label={m['common.sign.password_title']()}
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder={m['common.sign.password_placeholder']()}
                        labelClassName={authLabelClass}
                        inputClassName={authInputClass}
                      />
                    )}
                  </form.Field>
                  {inviteCodeRequired && (
                    <form.Field name="inviteCode">
                      {(field) => (
                        <TextField
                          field={field}
                          label={m['common.sign.invite_code_title']()}
                          type="text"
                          required
                          placeholder={m[
                            'common.sign.invite_code_placeholder'
                          ]()}
                          labelClassName={authLabelClass}
                          inputClassName={authInputClass}
                        />
                      )}
                    </form.Field>
                  )}

                  <form.Subscribe selector={(s) => s.isSubmitting}>
                    {(isSubmitting) => (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 w-full rounded-lg bg-zinc-50 font-medium text-zinc-950 hover:bg-white"
                      >
                        {isSubmitting
                          ? '...'
                          : m['common.sign.sign_up_title']()}
                      </Button>
                    )}
                  </form.Subscribe>
                </FieldGroup>
              </form>
            )}

            {hasSocial && emailEnabled && (
              <div className="mt-8">
                <AuthDivider label={m['common.sign.or']()} />
              </div>
            )}

            {hasSocial && (
              <div className="mt-6">
                <AuthSocialButtons
                  googleEnabled={googleEnabled}
                  githubEnabled={githubEnabled}
                  onSocial={handleSocial}
                  googleLabel={m['common.sign.google_sign_in']()}
                  githubLabel={m['common.sign.github_sign_in']()}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/(auth)/sign-up')({
  head: () => authRouteHead('sign-up'),
  component: SignUpPage,
});
