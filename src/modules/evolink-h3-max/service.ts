import { and, desc, eq, inArray, isNull } from 'drizzle-orm';

import {
  AITaskStatus,
  extractEvolinkVideoUrls,
  type SaveFilesFunction,
} from '@/core/ai';
import { db } from '@/core/db';
import { aiTask, type AiTask } from '@/config/db/schema';

const MODELS = [
  'minimax-h3-max-text-to-video',
  'minimax-h3-max-image-to-video',
] as const;
const terminalStatuses = new Set<string>([
  AITaskStatus.SUCCESS,
  AITaskStatus.FAILED,
  AITaskStatus.CANCELED,
]);

export type EvolinkH3MaxInput = {
  aspectRatio?: string;
  duration: number;
  imageUrls: string[];
  mode: 'text-to-video' | 'image-to-video' | 'reference-to-video';
  prompt: string;
  resolution: '480P' | '768P';
  videoUrls: string[];
};

export type EvolinkH3MaxTask = {
  billedCredits?: number;
  createdAt: string;
  errorMessage?: string;
  id: string;
  isArchived: boolean;
  model: string;
  prompt: string;
  progress: number;
  providerTaskId: string | null;
  resultUrls: string[];
  status: string;
};

function parseJson<T>(value: string | null | undefined): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function mapStatus(status: unknown): AITaskStatus {
  switch (String(status ?? '').toLowerCase()) {
    case 'completed':
    case 'success':
    case 'succeeded':
      return AITaskStatus.SUCCESS;
    case 'failed':
    case 'error':
      return AITaskStatus.FAILED;
    case 'cancelled':
    case 'canceled':
      return AITaskStatus.CANCELED;
    case 'processing':
    case 'running':
      return AITaskStatus.PROCESSING;
    default:
      return AITaskStatus.PENDING;
  }
}

function urls(task: AiTask) {
  const result = parseJson<unknown>(task.taskResult);
  if (isRecord(result) && Array.isArray(result.archivedVideoUrls)) {
    return result.archivedVideoUrls.filter(
      (url): url is string => typeof url === 'string'
    );
  }
  return extractEvolinkVideoUrls(result);
}

function toClientTask(task: AiTask): EvolinkH3MaxTask {
  const info = parseJson<{ progress?: number; errorMessage?: string }>(
    task.taskInfo
  );
  return {
    billedCredits: task.costCredits,
    createdAt: task.createdAt.toISOString(),
    id: task.id,
    isArchived: false,
    model: task.model,
    prompt: task.prompt,
    progress: Math.max(0, Math.min(100, Number(info?.progress) || 0)),
    providerTaskId: task.taskId ?? null,
    resultUrls: urls(task),
    status: task.status,
    ...(info?.errorMessage ? { errorMessage: info.errorMessage } : {}),
  };
}

function modelFor(input: EvolinkH3MaxInput) {
  return input.mode === 'image-to-video' ? MODELS[1] : MODELS[0];
}

export function validateEvolinkH3MaxInput(input: EvolinkH3MaxInput) {
  if (!input.prompt.trim()) throw new Error('Prompt is required');
  if (input.prompt.length > 7000)
    throw new Error('Prompt must be 7000 characters or fewer');
  if (
    !Number.isInteger(input.duration) ||
    input.duration < 5 ||
    input.duration > 15
  ) {
    throw new Error('Duration must be a whole number from 5 to 15 seconds');
  }
  if (input.resolution !== '480P' && input.resolution !== '768P') {
    throw new Error('Resolution must be 480P or 768P');
  }
  if (input.mode === 'reference-to-video' || input.videoUrls.length) {
    throw new Error(
      'EvoLink H3 Max supports text-to-video or first/last-frame image-to-video, not reference videos'
    );
  }
  if (input.mode === 'text-to-video' && input.imageUrls.length) {
    throw new Error('Text-to-video does not accept images');
  }
  if (
    input.mode === 'image-to-video' &&
    (input.imageUrls.length < 1 || input.imageUrls.length > 2)
  ) {
    throw new Error(
      'Image-to-video requires a first frame and an optional last frame'
    );
  }
  if (
    input.aspectRatio &&
    !['16:9', '21:9', '4:3', '1:1', '3:4', '9:16'].includes(input.aspectRatio)
  ) {
    throw new Error('Unsupported aspect ratio');
  }
  for (const value of input.imageUrls) {
    const url = new URL(value);
    if (url.protocol !== 'https:')
      throw new Error('Images must use public HTTPS URLs');
  }
}

async function readEvolink(response: Response) {
  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      isRecord(body) &&
      isRecord(body.error) &&
      typeof body.error.message === 'string'
        ? body.error.message
        : `Request failed (${response.status})`;
    throw new Error(`EvoLink H3 Max: ${message}`);
  }
  if (isRecord(body) && isRecord(body.data)) return body.data;
  if (!isRecord(body)) throw new Error('EvoLink returned an invalid response');
  return body;
}

export async function submitEvolinkH3MaxTask(params: {
  apiKey: string;
  input: EvolinkH3MaxInput;
  taskId: string;
  userId: string;
}): Promise<EvolinkH3MaxTask> {
  validateEvolinkH3MaxInput(params.input);
  const model = modelFor(params.input);
  const [task] = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.id, params.taskId),
        eq(aiTask.userId, params.userId),
        eq(aiTask.provider, 'evolink'),
        eq(aiTask.model, model),
        isNull(aiTask.deletedAt)
      )
    )
    .limit(1);
  if (!task || task.status !== AITaskStatus.PENDING)
    throw new Error('H3 Max task is not ready to submit');

  try {
    const response = await fetch(
      'https://api.evolink.ai/v1/videos/generations',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${params.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: params.input.prompt,
          duration: params.input.duration,
          quality: params.input.resolution.toLowerCase(),
          ...(params.input.mode === 'text-to-video'
            ? { aspect_ratio: params.input.aspectRatio ?? '9:16' }
            : {}),
          ...(params.input.imageUrls[0]
            ? { image_start: params.input.imageUrls[0] }
            : {}),
          ...(params.input.imageUrls[1]
            ? { image_end: params.input.imageUrls[1] }
            : {}),
        }),
      }
    );
    const remote = await readEvolink(response);
    const remoteId = remote.task_id ?? remote.id;
    if (typeof remoteId !== 'string')
      throw new Error('EvoLink returned no task ID');
    const status = mapStatus(remote.status ?? remote.task_status);
    const updated = {
      ...task,
      status,
      taskId: remoteId,
      taskInfo: JSON.stringify({ progress: 0, providerStatus: remote.status }),
      taskResult: JSON.stringify(remote),
    };
    await db()
      .update(aiTask)
      .set({
        status,
        taskId: remoteId,
        taskInfo: updated.taskInfo,
        taskResult: updated.taskResult,
      })
      .where(eq(aiTask.id, task.id));
    return toClientTask(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'EvoLink request failed';
    await db()
      .update(aiTask)
      .set({
        status: AITaskStatus.FAILED,
        taskInfo: JSON.stringify({ errorMessage: message }),
      })
      .where(eq(aiTask.id, task.id));
    throw error;
  }
}

async function ownedTask(taskId: string, userId: string) {
  const [task] = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.id, taskId),
        eq(aiTask.userId, userId),
        eq(aiTask.provider, 'evolink'),
        inArray(aiTask.model, MODELS),
        isNull(aiTask.deletedAt)
      )
    )
    .limit(1);
  if (!task) throw new Error('H3 Max video task not found');
  return task;
}

export async function getEvolinkH3MaxTask(params: {
  apiKey: string;
  saveFiles?: SaveFilesFunction;
  taskId: string;
  userId: string;
}) {
  const task = await ownedTask(params.taskId, params.userId);
  if (!task.taskId || terminalStatuses.has(task.status))
    return toClientTask(task);
  const remote = await readEvolink(
    await fetch(
      `https://api.evolink.ai/v1/tasks/${encodeURIComponent(task.taskId)}`,
      { headers: { Authorization: `Bearer ${params.apiKey}` } }
    )
  );
  const status = mapStatus(remote.status ?? remote.task_status ?? remote.state);
  const taskInfo = JSON.stringify({
    progress:
      status === AITaskStatus.SUCCESS ? 100 : Number(remote.progress) || 0,
    providerStatus: remote.status ?? remote.task_status,
    ...(isRecord(remote.error) && typeof remote.error.message === 'string'
      ? { errorMessage: remote.error.message }
      : {}),
  });
  let taskResult = JSON.stringify(remote);
  if (status === AITaskStatus.SUCCESS && params.saveFiles) {
    const resultUrls = extractEvolinkVideoUrls(remote);
    if (resultUrls.length) {
      try {
        const saved = await params.saveFiles(
          resultUrls.map((url, index) => ({
            url,
            contentType: 'video/mp4',
            key: `evolink/h3-max/${task.id}/${index + 1}.mp4`,
            index,
            type: 'video',
          }))
        );
        if (
          saved?.length === resultUrls.length &&
          saved.every((file) => file.url)
        ) {
          taskResult = JSON.stringify({
            archivedVideoUrls: saved.map((file) => file.url),
            providerResult: remote,
          });
        }
      } catch {
        // Keep the provider URL playable if storage is temporarily unavailable.
      }
    }
  }
  await db()
    .update(aiTask)
    .set({ status, taskInfo, taskResult })
    .where(eq(aiTask.id, task.id));
  return toClientTask({ ...task, status, taskInfo, taskResult });
}

export async function listEvolinkH3MaxTasks(params: {
  userId: string;
  limit?: number;
}) {
  const tasks = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.userId, params.userId),
        eq(aiTask.provider, 'evolink'),
        inArray(aiTask.model, MODELS),
        isNull(aiTask.deletedAt)
      )
    )
    .orderBy(desc(aiTask.createdAt))
    .limit(Math.min(20, Math.max(1, params.limit ?? 8)));
  return tasks.map(toClientTask);
}

export async function getEvolinkH3MaxDownloadUrl(params: {
  taskId: string;
  userId: string;
  index: number;
}) {
  if (!Number.isInteger(params.index) || params.index < 0)
    throw new Error('Invalid video index');
  const task = await ownedTask(params.taskId, params.userId);
  const url = urls(task)[params.index];
  if (!url) throw new Error('Generated video is unavailable');
  return url;
}
