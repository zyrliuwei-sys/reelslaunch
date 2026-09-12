import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  ChevronDown,
  Clock3,
  ImagePlus,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';

import { takeVideoComposerDraft } from '@/lib/video-composer-draft';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ReelslaunchHeroComposerLabels {
  addReference: string;
  firstFrame: string;
  lastFrame: string;
  aspectRatio: string;
  avatar: string;
  duration: string;
  durationLoading: string;
  durationPending: string;
  durationUnavailable: string;
  durationUnsupported: string;
  generate: string;
  generated: string;
  image: string;
  imageModel: string;
  model: string;
  placeholder: string;
  product: string;
  removeAttachment: string;
  resolution: string;
  textModel: string;
  video: string;
  videoModel: string;
}

export interface ReelslaunchGenerationReference {
  file: File;
  id: string;
  name: string;
  slot?: 'avatar' | 'product';
  type: 'image' | 'video';
}

export interface ReelslaunchGenerationValues {
  aspectRatio: string;
  batchSize: number;
  duration: 5 | 10;
  mode: 'edit' | 'text' | 'video';
  prompt: string;
  references: ReelslaunchGenerationReference[];
  resolution: '480P' | '768P';
  style: string;
}

export interface ReelslaunchHeroComposerProps {
  appearance?: 'light' | 'console';
  allowImageMode?: boolean;
  allowTextToImageMode?: boolean;
  allowVideoMode?: boolean;
  compactAction?: boolean;
  compactHeight?: boolean;
  compactContentInset?: boolean;
  compactGenerateAction?: boolean;
  restoreLandingDraft?: boolean;
  enableFrameInputs?: boolean;
  forceTextModeVersion?: number;
  isGenerating?: boolean;
  labels: ReelslaunchHeroComposerLabels;
  maxImageReferences?: number;
  onPromptChange?: (prompt: string) => void;
  onGenerate?: (values: ReelslaunchGenerationValues) => void;
  promptValue?: string;
  referenceImageToAdd?: { file: File; id: string } | null;
  requireReferences?: boolean;
  showReferenceControls?: boolean;
}

const aspectRatioOptions = [
  {
    value: '21:9',
    previewClassName: 'h-2 w-7',
    triggerPreviewClassName: 'h-1.5 w-5',
  },
  {
    value: '16:9',
    previewClassName: 'h-2.5 w-6',
    triggerPreviewClassName: 'h-2 w-4.5',
  },
  {
    value: '4:3',
    previewClassName: 'h-3.5 w-5',
    triggerPreviewClassName: 'h-2.5 w-3.5',
  },
  {
    value: '1:1',
    previewClassName: 'size-4.5',
    triggerPreviewClassName: 'size-3.5',
  },
  {
    value: '3:4',
    previewClassName: 'h-5 w-4',
    triggerPreviewClassName: 'h-4 w-3',
  },
  {
    value: '9:16',
    previewClassName: 'h-5.5 w-3',
    triggerPreviewClassName: 'h-4.5 w-2.5',
  },
  {
    value: 'adaptive',
    previewClassName: 'size-5',
    triggerPreviewClassName: 'size-3.5',
  },
] as const;
const resolutionOptions = ['480P', '768P'] as const;
const durationOptions = [5, 10] as const;
const defaultAspectRatio = '9:16';
const defaultMaximumImageReferenceCount = 3;
const minimumMotionVideoDuration = 2;
const maximumMotionVideoDuration = 15;
type ReferenceSlot = 'avatar' | 'product' | null;
type MotionVideoDurationState = 'idle' | 'loading' | 'ready' | 'unavailable';
type ReferenceAttachment = {
  file: File;
  id: string;
  name: string;
  previewUrl: string;
  slot?: Exclude<ReferenceSlot, null>;
  type: 'image' | 'video';
};

function formatDuration(seconds: number) {
  const rounded = Math.round(seconds * 10) / 10;
  return `${rounded}s`;
}

/** A compact landing composer that can expose only the models currently available. */
export function ReelslaunchHeroComposer({
  appearance = 'light',
  allowImageMode = true,
  allowTextToImageMode = true,
  allowVideoMode = true,
  compactAction = false,
  compactHeight = false,
  compactContentInset = false,
  compactGenerateAction = false,
  restoreLandingDraft = false,
  enableFrameInputs = false,
  forceTextModeVersion,
  isGenerating = false,
  labels,
  maxImageReferences = defaultMaximumImageReferenceCount,
  onPromptChange,
  onGenerate,
  promptValue,
  referenceImageToAdd,
  requireReferences = true,
  showReferenceControls = true,
}: ReelslaunchHeroComposerProps) {
  const isConsoleAppearance = appearance === 'console';
  const [frameTarget, setFrameTarget] = useState<0 | 1>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'edit' | 'text' | 'video'>(
    allowTextToImageMode ? 'text' : allowVideoMode ? 'video' : 'edit'
  );
  const [uncontrolledPrompt, setUncontrolledPrompt] = useState('');
  const style = 'Closeup';
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);
  const [resolution, setResolution] = useState<'480P' | '768P'>('768P');
  const [duration, setDuration] = useState<(typeof durationOptions)[number]>(5);
  const batchSize = 1;
  const [references, setReferences] = useState<ReferenceAttachment[]>([]);
  const [referenceSlot, setReferenceSlot] = useState<ReferenceSlot>(null);
  const [hasRequestedGeneration, setHasRequestedGeneration] = useState(false);
  const [motionVideoDuration, setMotionVideoDuration] = useState<number | null>(
    null
  );
  const [motionVideoDurationState, setMotionVideoDurationState] =
    useState<MotionVideoDurationState>('idle');
  const referencesRef = useRef<ReferenceAttachment[]>([]);
  const addedReferenceImageIdRef = useRef<string | null>(null);
  const motionVideo = references.find(
    (reference) => reference.slot === 'product' && reference.type === 'video'
  );
  const avatarImage = references.find(
    (reference) => reference.slot === 'avatar' && reference.type === 'image'
  );
  const prompt = promptValue ?? uncontrolledPrompt;
  const imageReferences = references.filter(
    (reference) => reference.type === 'image'
  );
  const frameInputs = enableFrameInputs && mode !== 'video';
  const hasReachedImageReferenceLimit =
    mode === 'edit' && imageReferences.length >= maxImageReferences;
  const hasRequiredReferences =
    mode === 'text'
      ? prompt.trim().length > 0
      : mode === 'edit'
        ? prompt.trim().length > 0 && imageReferences.length > 0
        : prompt.trim().length > 0 && references.length > 0;
  const isReady = requireReferences
    ? hasRequiredReferences
    : prompt.trim().length > 0;
  const isMotionVideoDurationUnsupported =
    motionVideoDurationState === 'ready' &&
    motionVideoDuration !== null &&
    (motionVideoDuration < minimumMotionVideoDuration ||
      motionVideoDuration > maximumMotionVideoDuration);
  const canGenerate =
    isReady && (mode !== 'video' || !isMotionVideoDurationUnsupported);
  const hasMultipleModels =
    Number(allowTextToImageMode) +
      Number(allowImageMode) +
      Number(allowVideoMode) >
    1;
  const useCompactGenerateAction =
    compactAction || compactGenerateAction || mode === 'text';
  const modelOptions = [
    ...(allowTextToImageMode
      ? [{ label: labels.textModel, value: 'text' as const }]
      : []),
    ...(allowImageMode
      ? [{ label: labels.imageModel, value: 'edit' as const }]
      : []),
    ...(allowVideoMode
      ? [{ label: labels.videoModel, value: 'video' as const }]
      : []),
  ];

  const durationText =
    motionVideoDurationState === 'loading'
      ? labels.durationLoading
      : motionVideoDurationState === 'unavailable'
        ? labels.durationUnavailable
        : motionVideoDuration === null
          ? labels.durationPending
          : formatDuration(motionVideoDuration);
  const durationHelp = isMotionVideoDurationUnsupported
    ? labels.durationUnsupported
    : undefined;

  const updatePrompt = (nextPrompt: string) => {
    if (promptValue === undefined) {
      setUncontrolledPrompt(nextPrompt);
    }
    onPromptChange?.(nextPrompt);
  };

  useEffect(() => {
    referencesRef.current = references;
  }, [references]);

  useEffect(
    () => () => {
      referencesRef.current.forEach((reference) => {
        URL.revokeObjectURL(reference.previewUrl);
      });
    },
    []
  );

  useEffect(() => {
    if (!motionVideo) {
      setMotionVideoDuration(null);
      setMotionVideoDurationState('idle');
      return;
    }

    let cancelled = false;
    const video = document.createElement('video');
    video.preload = 'metadata';
    setMotionVideoDuration(null);
    setMotionVideoDurationState('loading');

    video.onloadedmetadata = () => {
      if (cancelled) return;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        setMotionVideoDuration(video.duration);
        setMotionVideoDurationState('ready');
      } else {
        setMotionVideoDurationState('unavailable');
      }
    };
    video.onerror = () => {
      if (!cancelled) setMotionVideoDurationState('unavailable');
    };
    video.src = motionVideo.previewUrl;

    return () => {
      cancelled = true;
      video.removeAttribute('src');
      video.load();
    };
  }, [motionVideo?.id, motionVideo?.previewUrl]);

  const updateMode = (nextMode: 'edit' | 'text' | 'video') => {
    if (nextMode === 'edit' && !allowImageMode) return;
    if (nextMode === 'text' && !allowTextToImageMode) return;
    if (nextMode === 'video' && !allowVideoMode) return;
    setMode(nextMode);
    if (nextMode === 'edit') {
      setReferences((current) => {
        current
          .filter((reference) => reference.type === 'video')
          .forEach((reference) => URL.revokeObjectURL(reference.previewUrl));
        return current.filter((reference) => reference.type === 'image');
      });
    }
    if (nextMode === 'text') {
      setReferences((current) => {
        current.forEach((reference) =>
          URL.revokeObjectURL(reference.previewUrl)
        );
        return [];
      });
      setReferenceSlot(null);
    }
    setHasRequestedGeneration(false);
  };

  // A previously sent prompt can be returned to this composer for another
  // generation. Text-to-video is the only H3 Max mode that needs no upload.
  useEffect(() => {
    if (forceTextModeVersion === undefined || !allowTextToImageMode) return;

    setMode('text');
    setReferences((current) => {
      current.forEach((reference) => URL.revokeObjectURL(reference.previewUrl));
      return [];
    });
    setReferenceSlot(null);
    setHasRequestedGeneration(false);
  }, [allowTextToImageMode, forceTextModeVersion]);

  useEffect(() => {
    if (allowVideoMode || mode !== 'video') return;

    setMode(allowTextToImageMode ? 'text' : 'edit');
    setReferences((current) => {
      current
        .filter((reference) => reference.type === 'video')
        .forEach((reference) => URL.revokeObjectURL(reference.previewUrl));
      return current.filter((reference) => reference.type === 'image');
    });
    setHasRequestedGeneration(false);
  }, [allowTextToImageMode, allowVideoMode, mode]);

  useEffect(() => {
    if (!restoreLandingDraft) return;
    const draft = takeVideoComposerDraft();
    if (!draft) return;
    setMode(draft.references.length ? 'edit' : 'text');
    setAspectRatio(draft.aspectRatio);
    setResolution(draft.resolution);
    setDuration(draft.duration);
    setReferences(
      draft.references.map((reference) => ({
        ...reference,
        previewUrl: URL.createObjectURL(reference.file),
      }))
    );
  }, [restoreLandingDraft]);

  const openFilePicker = (slot: ReferenceSlot = null) => {
    setReferenceSlot(slot);
    window.requestAnimationFrame(() => fileInputRef.current?.click());
  };

  const acceptedFileTypes =
    mode === 'text' || mode === 'edit' || referenceSlot === 'avatar'
      ? 'image/*'
      : referenceSlot === 'product'
        ? 'video/*'
        : 'image/*,video/*';

  const removeReference = (id: string) => {
    setReferences((current) => {
      const removed = current.find((reference) => reference.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);

      return current.filter((reference) => reference.id !== id);
    });
    setHasRequestedGeneration(false);
  };

  const addUploadedReferences = (files: FileList | File[] | null) => {
    if (!files?.length) return;

    // Adding an image from text-to-video turns the request into image-to-video
    // so the attachment is used rather than discarded.
    const uploadMode = mode === 'text' ? 'edit' : mode;
    const expectedType =
      uploadMode === 'edit' || referenceSlot === 'avatar'
        ? 'image'
        : referenceSlot === 'product'
          ? 'video'
          : null;
    if (frameInputs) {
      const filesToAdd = Array.from(files)
        .filter((file) => file.type.startsWith('image/'))
        .slice(0, frameTarget === 0 ? 2 : 1);
      if (!filesToAdd.length) return;
      const added = filesToAdd.map(
        (file, index): ReferenceAttachment => ({
          id: `${Date.now()}-${index}-${file.name}`,
          file,
          name: file.name,
          previewUrl: URL.createObjectURL(file),
          type: 'image',
        })
      );
      setReferences((current) => {
        const next = [...current];
        const target = Math.min(frameTarget, next.length);
        for (let index = 0; index < added.length; index++) {
          const old = next[target + index];
          if (old) URL.revokeObjectURL(old.previewUrl);
          next[target + index] = added[index];
        }
        next.slice(2).forEach((item) => URL.revokeObjectURL(item.previewUrl));
        return next.slice(0, 2);
      });
      setMode('edit');
      setReferenceSlot(null);
      setHasRequestedGeneration(false);
      return;
    }
    const uploaded = Array.from(files)
      .filter((file) =>
        expectedType === 'image'
          ? file.type.startsWith('image/')
          : expectedType === 'video'
            ? file.type.startsWith('video/')
            : file.type.startsWith('image/') || file.type.startsWith('video/')
      )
      .map(
        (file, index): ReferenceAttachment => ({
          id: `${Date.now()}-${index}-${file.name}`,
          file,
          name: file.name,
          previewUrl: URL.createObjectURL(file),
          slot: referenceSlot ?? undefined,
          type: file.type.startsWith('video/') ? 'video' : 'image',
        })
      )
      .slice(0, referenceSlot ? 1 : undefined);

    if (!uploaded.length) return;

    if (mode === 'text') setMode('edit');

    setReferences((current) => {
      const retained = current.filter((reference) => {
        if (!referenceSlot || reference.slot !== referenceSlot) return true;
        URL.revokeObjectURL(reference.previewUrl);
        return false;
      });
      let assigned = uploaded;
      if (!referenceSlot && uploadMode === 'video') {
        let hasAvatar = retained.some(
          (reference) =>
            reference.slot === 'avatar' && reference.type === 'image'
        );
        let hasMotionVideo = retained.some(
          (reference) =>
            reference.slot === 'product' && reference.type === 'video'
        );
        assigned = uploaded.map((reference) => {
          if (reference.type === 'image' && !hasAvatar) {
            hasAvatar = true;
            return { ...reference, slot: 'avatar' };
          }
          if (reference.type === 'video' && !hasMotionVideo) {
            hasMotionVideo = true;
            return { ...reference, slot: 'product' };
          }
          return reference;
        });
      }
      const availableImageSlots = Math.max(
        0,
        maxImageReferences -
          retained.filter((reference) => reference.type === 'image').length
      );
      const accepted =
        uploadMode === 'edit'
          ? assigned
              .filter((reference) => reference.type === 'image')
              .slice(0, availableImageSlots)
          : assigned;
      return [...retained, ...accepted];
    });
    setReferenceSlot(null);
    setHasRequestedGeneration(false);
  };

  useEffect(() => {
    if (
      !referenceImageToAdd ||
      addedReferenceImageIdRef.current === referenceImageToAdd.id
    ) {
      return;
    }

    addedReferenceImageIdRef.current = referenceImageToAdd.id;
    addUploadedReferences([referenceImageToAdd.file]);
  }, [referenceImageToAdd]);

  const requestGeneration = () => {
    if (!canGenerate || isGenerating) return;

    setHasRequestedGeneration(true);
    onGenerate?.({
      mode,
      prompt,
      references: references.map(
        ({ file, id, name, slot, type }): ReelslaunchGenerationReference => ({
          file,
          id,
          name,
          slot,
          type,
        })
      ),
      style,
      aspectRatio,
      batchSize,
      duration,
      resolution,
    });

    // Reference images belong to the request that was just sent. Remove their
    // thumbnails immediately afterwards so the next prompt starts cleanly,
    // and return to text mode because edit mode requires an attachment.
    if (mode === 'edit') {
      setReferences((current) => {
        current.forEach((reference) =>
          URL.revokeObjectURL(reference.previewUrl)
        );
        return [];
      });
      setReferenceSlot(null);
      if (allowTextToImageMode) setMode('text');
    }
  };

  return (
    <section
      aria-label={labels.model}
      className={`mx-auto w-full ${
        isConsoleAppearance ? 'text-neutral-100' : 'text-[#15202b]'
      } ${
        isConsoleAppearance
          ? 'max-w-none'
          : compactAction
            ? 'max-w-[860px]'
            : 'max-w-[1088px]'
      }`}
    >
      <div className="flex w-full items-end gap-2">
        <div
          className={`min-w-0 flex-1 ${
            isConsoleAppearance
              ? 'bg-transparent'
              : 'rounded-[28px] border border-[#ead7df] bg-[#fff8fa] p-1 shadow-[0_12px_30px_rgba(66,20,37,0.09)]'
          }`}
        >
          <div
            className={`${
              isConsoleAppearance ? 'bg-transparent' : 'bg-[#fff1f5]'
            } ${
              compactAction
                ? `${compactHeight ? 'min-h-[140px]' : 'min-h-[172px]'} ${
                    isConsoleAppearance
                      ? 'p-0 sm:p-1'
                      : 'rounded-[20px] p-2 sm:p-2.5'
                  }`
                : 'min-h-[104px] rounded-[22px] p-3'
            }`}
          >
            <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row">
              <div
                className={`flex min-w-0 flex-1 flex-col ${
                  compactAction
                    ? compactHeight
                      ? 'min-h-24'
                      : 'min-h-32'
                    : 'min-h-20'
                } ${compactAction && compactContentInset ? 'sm:ml-6' : ''}`}
              >
                <label className="sr-only" htmlFor="hero-marketing-prompt">
                  {labels.placeholder}
                </label>
                <div
                  className={`relative flex w-full flex-1 flex-col ${
                    compactAction ? 'px-0' : 'px-1'
                  } ${compactAction ? 'min-h-12' : 'min-h-12'}`}
                >
                  {showReferenceControls ? (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={acceptedFileTypes}
                        className="sr-only"
                        onChange={(event) => {
                          addUploadedReferences(event.target.files);
                          event.target.value = '';
                        }}
                      />
                      <button
                        type="button"
                        disabled={!frameInputs && hasReachedImageReferenceLimit}
                        onClick={() => {
                          setFrameTarget(0);
                          openFilePicker();
                        }}
                        className={`absolute z-10 inline-flex shrink-0 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                          compactAction ? 'left-0' : 'left-2'
                        } ${
                          isConsoleAppearance
                            ? 'shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200'
                            : 'shadow-[0_5px_14px_rgba(66,20,37,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c92f68]'
                        } ${
                          // Match the thumbnail row's py-1 so both edges (and
                          // badges) sit flush once references are attached.
                          references.length ? 'top-1' : 'top-0'
                        } ${
                          isConsoleAppearance
                            ? references.length
                              ? 'border-cyan-100/25 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/15'
                              : 'border-white/15 bg-white/[0.06] text-neutral-200 hover:border-white/25 hover:bg-white/10 hover:text-white'
                            : references.length
                              ? 'border-[#efb0c4] bg-[#fde3ec] text-[#c92f68] hover:bg-[#f9ccd9]'
                              : 'border-[#efbed0] bg-white text-[#c92f68] hover:bg-[#fff5f8] hover:text-[#a62150]'
                        } size-10`}
                        aria-label={
                          frameInputs ? labels.firstFrame : labels.addReference
                        }
                        title={
                          frameInputs
                            ? labels.firstFrame
                            : references.length
                              ? `${labels.addReference} (${imageReferences.length}/${maxImageReferences})`
                              : labels.addReference
                        }
                      >
                        <ImagePlus className="size-4.5" aria-hidden="true" />
                        {references.length ? (
                          <span
                            className={`absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full text-[9px] font-bold shadow-sm ${
                              isConsoleAppearance
                                ? 'bg-cyan-100 text-[#0e1011]'
                                : 'bg-[#c92f68] text-white'
                            }`}
                          >
                            {references.length}
                          </span>
                        ) : null}
                      </button>
                      {frameInputs ? (
                        <>
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute left-10 flex h-10 w-8 items-center justify-center text-neutral-500 ${references.length ? 'top-1' : 'top-0'} ${compactAction ? '' : 'translate-x-2'}`}
                          >
                            <Plus className="size-3.5" />
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFrameTarget(1);
                              openFilePicker();
                            }}
                            disabled={!imageReferences.length}
                            aria-label={labels.lastFrame}
                            title={labels.lastFrame}
                            className={`absolute z-10 inline-flex size-10 ${compactAction ? 'left-[4.5rem]' : 'left-20'} items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-neutral-200 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:opacity-45 ${references.length ? 'top-1' : 'top-0'}`}
                          >
                            <ImagePlus
                              className="size-4.5"
                              aria-hidden="true"
                            />
                          </button>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {references.length ? (
                    <div
                      className={`flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                        frameInputs
                          ? 'min-h-16 pl-32'
                          : compactAction
                            ? 'min-h-10 pl-12'
                            : 'min-h-12 pl-14'
                      }`}
                    >
                      {references.map((reference, index) => (
                        <AttachmentPreview
                          key={reference.id}
                          attachment={reference}
                          appearance={appearance}
                          compact={compactAction}
                          frameLabel={
                            frameInputs
                              ? index === 0
                                ? labels.firstFrame
                                : labels.lastFrame
                              : undefined
                          }
                          removeLabel={labels.removeAttachment}
                          onRemove={() => removeReference(reference.id)}
                        />
                      ))}
                    </div>
                  ) : null}
                  <textarea
                    id="hero-marketing-prompt"
                    rows={references.length ? 1 : 2}
                    value={prompt}
                    onChange={(event) => {
                      updatePrompt(event.target.value);
                      setHasRequestedGeneration(false);
                    }}
                    placeholder={labels.placeholder}
                    className={`block w-full flex-1 resize-none bg-transparent py-1 pr-1 outline-none ${frameInputs ? 'pl-36' : 'pl-16'} ${
                      isConsoleAppearance
                        ? 'text-neutral-100 placeholder:text-neutral-500'
                        : 'text-[#15202b] placeholder:text-[#7b8995]'
                    } ${
                      compactAction
                        ? 'min-h-10 text-sm leading-5 sm:text-base'
                        : 'min-h-20 text-sm leading-5'
                    } ${references.length ? 'mt-2' : ''}`}
                  />
                </div>

                <div
                  className={`flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    compactAction
                      ? compactHeight
                        ? 'mt-auto translate-y-9 [&>button]:bg-transparent [&>span]:bg-transparent'
                        : 'mt-auto translate-y-7'
                      : 'mt-2.5'
                  }`}
                >
                  {hasMultipleModels ? (
                    <ModelPicker
                      appearance={appearance}
                      label={labels.model}
                      options={modelOptions}
                      value={mode}
                      onChange={updateMode}
                    />
                  ) : (
                    <ModelBadge
                      appearance={appearance}
                      label={labels.model}
                      value={modelOptions[0]?.label ?? labels.model}
                    />
                  )}

                  {mode !== 'video' ? (
                    <ImageSettingsPicker
                      appearance={appearance}
                      aspectRatio={aspectRatio}
                      aspectRatioLabel={labels.aspectRatio}
                      onAspectRatioChange={(nextRatio) => {
                        setAspectRatio(nextRatio);
                        setHasRequestedGeneration(false);
                      }}
                      duration={duration}
                      durationLabel={labels.duration}
                      onDurationChange={(nextDuration) => {
                        setDuration(nextDuration);
                        setHasRequestedGeneration(false);
                      }}
                      onResolutionChange={(nextResolution) => {
                        setResolution(nextResolution);
                        setHasRequestedGeneration(false);
                      }}
                      resolution={resolution}
                      resolutionLabel={labels.resolution}
                    />
                  ) : null}

                  {mode === 'video' ? (
                    <span
                      aria-label={`${labels.duration}: ${durationText}${
                        durationHelp ? `. ${durationHelp}` : ''
                      }`}
                      aria-live="polite"
                      className={`inline-flex h-7 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-medium tabular-nums transition-colors ${
                        isMotionVideoDurationUnsupported
                          ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                          : motionVideoDurationState === 'ready'
                            ? isConsoleAppearance
                              ? 'bg-cyan-200/10 text-cyan-100'
                              : 'bg-[#fde3ec] text-[#c92f68]'
                            : isConsoleAppearance
                              ? 'bg-white/[0.06] text-neutral-400'
                              : 'bg-[#fff5f8] text-[#627181]'
                      }`}
                      title={durationHelp}
                    >
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      <span>{durationText}</span>
                    </span>
                  ) : null}
                </div>
              </div>

              <div
                className={`flex shrink-0 items-stretch gap-1.5 self-end ${
                  useCompactGenerateAction
                    ? isConsoleAppearance
                      ? 'mr-0 ml-auto size-14 self-end'
                      : 'mr-0 ml-auto size-14 self-end'
                    : 'h-14 sm:w-[232px]'
                } ${compactAction ? (compactHeight ? 'translate-y-9' : 'translate-y-7') : ''}`}
              >
                <button
                  type="button"
                  disabled={!canGenerate || isGenerating}
                  onClick={requestGeneration}
                  aria-label={
                    hasRequestedGeneration ? labels.generated : labels.generate
                  }
                  title={
                    hasRequestedGeneration ? labels.generated : labels.generate
                  }
                  className={`group relative overflow-hidden px-4 text-xs font-bold tracking-wide uppercase transition-[filter,transform] hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                    isConsoleAppearance
                      ? 'text-[#0e1011] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200'
                      : 'text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c92f68]'
                  } ${
                    useCompactGenerateAction
                      ? isConsoleAppearance
                        ? compactHeight
                          ? 'size-full flex-none rounded-[14px] border border-white/15 bg-transparent p-0 text-neutral-200 shadow-none disabled:text-neutral-500'
                          : 'size-full flex-none rounded-[14px] border border-white/70 bg-white p-0 shadow-[inset_0_-3px_0_rgba(148,163,184,0.48)] disabled:border-white/10 disabled:bg-white/10 disabled:text-white/40'
                        : 'size-full flex-none rounded-[18px] border border-white/65 bg-[#c92f68] p-0 shadow-[inset_0_-4px_0_#9f1f50,0_8px_18px_rgba(201,47,104,0.32)]'
                      : isConsoleAppearance
                        ? 'min-w-[112px] flex-1 rounded-xl bg-white shadow-[inset_0_-3px_0_rgba(148,163,184,0.48)] disabled:bg-white/10 disabled:text-white/40'
                        : 'min-w-[112px] flex-1 rounded-xl bg-[#c92f68] shadow-[inset_0_-3px_0_#9f1f50,0_8px_18px_rgba(201,47,104,0.2)]'
                  }`}
                >
                  {!isConsoleAppearance ? (
                    <span className="absolute -right-5 -bottom-8 size-24 rounded-full bg-white/20 blur-2xl transition-transform duration-300 group-hover:scale-125" />
                  ) : null}
                  <span
                    className={`relative flex items-center justify-center ${
                      useCompactGenerateAction
                        ? 'h-full'
                        : 'h-full flex-col gap-1'
                    }`}
                  >
                    {useCompactGenerateAction ? (
                      <>
                        <ArrowUp
                          className="size-6 stroke-[2.5]"
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          {hasRequestedGeneration
                            ? labels.generated
                            : labels.generate}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" aria-hidden="true" />
                        <span>
                          {hasRequestedGeneration
                            ? labels.generated
                            : labels.generate}
                        </span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModelPicker({
  appearance = 'light',
  label,
  onChange,
  options,
  value,
}: {
  appearance?: 'light' | 'console';
  label: string;
  onChange: (value: 'edit' | 'text' | 'video') => void;
  options: { label: string; value: 'edit' | 'text' | 'video' }[];
  value: 'edit' | 'text' | 'video';
}) {
  const isConsoleAppearance = appearance === 'console';
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label}
        className={`group/model inline-flex h-9 shrink-0 items-center gap-3 rounded-xl border px-4 text-xs font-semibold transition-[background-color,border-color,box-shadow,color] focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isConsoleAppearance
            ? 'border-white/15 bg-white/[0.06] text-neutral-200 hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-cyan-200'
            : 'border-[#d7dde2] bg-white text-[#354454] shadow-[0_2px_8px_rgba(21,32,43,0.06)] hover:border-[#b9c5cf] hover:bg-[#f3f5f6] hover:text-[#15202b] hover:shadow-[0_5px_13px_rgba(21,32,43,0.1)] focus-visible:outline-[#627181]'
        }`}
      >
        <span className="max-w-[12.5rem] truncate leading-none">
          {selected?.label}
        </span>
        <ChevronDown
          className={`size-3.5 shrink-0 transition-transform duration-150 group-data-popup-open/model:rotate-180 ${
            isConsoleAppearance
              ? 'text-neutral-500 group-hover/model:text-neutral-200'
              : 'text-[#8a9aa6] group-hover/model:text-[#4b5b68]'
          }`}
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={10}
        className={`w-[min(19rem,calc(100vw-2rem))] min-w-[min(19rem,calc(100vw-2rem))] rounded-xl border p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.32)] ${
          isConsoleAppearance
            ? 'border-white/15 bg-[#17191b] text-neutral-100'
            : 'border-[#d7dde2] bg-[#fbfcfd] text-[#15202b] shadow-[0_18px_48px_rgba(21,32,43,0.16)]'
        }`}
      >
        <p
          className={`px-2.5 pt-1.5 pb-2 text-[10px] font-semibold tracking-[0.16em] uppercase ${
            isConsoleAppearance ? 'text-neutral-500' : 'text-[#627181]'
          }`}
        >
          {label}
        </p>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) =>
            onChange(nextValue as 'edit' | 'text' | 'video')
          }
          className="grid gap-1"
        >
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              label={option.label}
              closeOnClick
              className={`group/model-option flex min-h-11 items-center rounded-lg border border-transparent px-2.5 py-2 text-xs font-semibold transition-[background-color,border-color,color] duration-150 [&_[data-slot=dropdown-menu-radio-item-indicator]]:right-2 ${
                isConsoleAppearance
                  ? 'text-neutral-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white focus:border-white/20 focus:bg-white/[0.08] focus:text-white data-checked:border-white/20 data-checked:bg-white/[0.08] data-checked:text-white [&_[data-slot=dropdown-menu-radio-item-indicator]]:text-cyan-100'
                  : 'text-[#627181] hover:border-[#d7dde2] hover:bg-[#f3f5f6] hover:text-[#15202b] focus:border-[#b9c5cf] focus:bg-[#eef1f3] focus:text-[#15202b] data-checked:border-[#8ba0ac] data-checked:bg-[#eef1f3] data-checked:text-[#15202b] [&_[data-slot=dropdown-menu-radio-item-indicator]]:text-[#15202b]'
              }`}
            >
              <span className="min-w-0 truncate">{option.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ModelBadge({
  appearance = 'light',
  label,
  value,
}: {
  appearance?: 'light' | 'console';
  label: string;
  value: string;
}) {
  const isConsoleAppearance = appearance === 'console';

  return (
    <span
      aria-label={label}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-2 text-xs font-semibold ${
        isConsoleAppearance
          ? 'border-white/15 bg-white/[0.06] text-neutral-200'
          : 'border-[#d7dde2] bg-white text-[#354454] shadow-[0_2px_8px_rgba(21,32,43,0.06)]'
      }`}
    >
      <span className="max-w-[12.5rem] truncate leading-none">{value}</span>
    </span>
  );
}

function ImageSettingsPicker({
  appearance = 'light',
  aspectRatio,
  aspectRatioLabel,
  duration,
  durationLabel,
  onAspectRatioChange,
  onDurationChange,
  onResolutionChange,
  resolution,
  resolutionLabel,
}: {
  appearance?: 'light' | 'console';
  aspectRatio: string;
  aspectRatioLabel: string;
  duration: (typeof durationOptions)[number];
  durationLabel: string;
  onAspectRatioChange: (value: string) => void;
  onDurationChange: (value: (typeof durationOptions)[number]) => void;
  onResolutionChange: (value: (typeof resolutionOptions)[number]) => void;
  resolution: (typeof resolutionOptions)[number];
  resolutionLabel: string;
}) {
  const isConsoleAppearance = appearance === 'console';
  const selectedOption =
    aspectRatioOptions.find((option) => option.value === aspectRatio) ??
    aspectRatioOptions[5];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${aspectRatioLabel}: ${aspectRatio}. ${resolutionLabel}: ${resolution}. ${durationLabel}: ${duration}s`}
        className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isConsoleAppearance
            ? 'border-white/15 bg-white/[0.07] text-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-cyan-200'
            : 'border-[#d7dde2] bg-white text-[#4b5b68] shadow-sm hover:bg-[#f3f5f6] hover:text-[#15202b] focus-visible:outline-[#627181]'
        }`}
      >
        <span
          className={`block rounded-[3px] border border-current ${selectedOption.triggerPreviewClassName}`}
          aria-hidden="true"
        />
        <span>{aspectRatio}</span>
        <span
          className={`h-3.5 w-px ${
            isConsoleAppearance ? 'bg-white/20' : 'bg-[#d7dde2]'
          }`}
          aria-hidden="true"
        />
        <span>{resolution}</span>
        <span
          className={`h-3.5 w-px ${
            isConsoleAppearance ? 'bg-white/20' : 'bg-[#d7dde2]'
          }`}
          aria-hidden="true"
        />
        <span>{duration}s</span>
        <ChevronDown
          className={`size-3.5 ${
            isConsoleAppearance ? 'text-neutral-500' : 'text-[#627181]'
          }`}
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={10}
        className={`w-[min(460px,calc(100vw-1.5rem))] min-w-[min(280px,calc(100vw-1.5rem))] overflow-hidden rounded-[22px] border p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.44)] ${
          isConsoleAppearance
            ? 'border-white/15 bg-[#18191c] text-neutral-100'
            : 'border-[#d7dde2] bg-white text-[#15202b] shadow-[0_18px_48px_rgba(21,32,43,0.18)]'
        }`}
      >
        <div className="relative">
          <p
            className={`px-1 pt-0.5 pb-2.5 text-[10px] font-semibold tracking-[0.18em] uppercase ${
              isConsoleAppearance ? 'text-neutral-500' : 'text-[#627181]'
            }`}
          >
            {resolutionLabel}
          </p>
          <DropdownMenuRadioGroup
            value={resolution}
            onValueChange={(nextValue) =>
              onResolutionChange(
                nextValue as (typeof resolutionOptions)[number]
              )
            }
            className={`flex rounded-xl p-1 ${
              isConsoleAppearance ? 'bg-white/[0.06]' : 'bg-[#eff1f3]'
            }`}
          >
            {resolutionOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option}
                value={option}
                label={option}
                closeOnClick={false}
                className={`flex h-11 flex-1 justify-center rounded-[14px] px-2 text-sm font-medium tracking-[-0.02em] transition-[background-color,color,box-shadow] [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden ${
                  isConsoleAppearance
                    ? 'text-neutral-400 hover:text-white focus:bg-white/[0.1] focus:text-white data-checked:bg-[#333438] data-checked:text-white data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.16)]'
                    : 'text-[#627181] hover:text-[#15202b] focus:bg-white focus:text-[#15202b] data-checked:bg-white data-checked:text-[#15202b] data-checked:shadow-[0_3px_8px_rgba(21,32,43,0.12)]'
                }`}
              >
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>

        <div
          className={`my-3 border-t ${
            isConsoleAppearance ? 'border-white/[0.09]' : 'border-[#e4e8eb]'
          }`}
        />

        <div>
          <p
            className={`px-1 pb-2.5 text-[10px] font-semibold tracking-[0.18em] uppercase ${
              isConsoleAppearance ? 'text-neutral-500' : 'text-[#627181]'
            }`}
          >
            {durationLabel}
          </p>
          <DropdownMenuRadioGroup
            value={String(duration)}
            onValueChange={(nextValue) =>
              onDurationChange(
                Number(nextValue) as (typeof durationOptions)[number]
              )
            }
            className={`flex rounded-xl p-1 ${
              isConsoleAppearance ? 'bg-white/[0.06]' : 'bg-[#eff1f3]'
            }`}
          >
            {durationOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option}
                value={String(option)}
                label={`${option}s`}
                closeOnClick={false}
                className={`flex h-10 flex-1 justify-center rounded-[12px] px-2 text-sm font-medium tracking-[-0.02em] transition-[background-color,color,box-shadow] [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden ${
                  isConsoleAppearance
                    ? 'text-neutral-400 hover:text-white focus:bg-white/[0.1] focus:text-white data-checked:bg-[#333438] data-checked:text-white data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.16)]'
                    : 'text-[#627181] hover:text-[#15202b] focus:bg-white focus:text-[#15202b] data-checked:bg-white data-checked:text-[#15202b] data-checked:shadow-[0_3px_8px_rgba(21,32,43,0.12)]'
                }`}
              >
                {option}s
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>

        <div
          className={`my-3 border-t ${
            isConsoleAppearance ? 'border-white/[0.09]' : 'border-[#e4e8eb]'
          }`}
        />

        <div>
          <p
            className={`px-1 pb-2.5 text-[10px] font-semibold tracking-[0.18em] uppercase ${
              isConsoleAppearance ? 'text-neutral-500' : 'text-[#627181]'
            }`}
          >
            {aspectRatioLabel}
          </p>
          <DropdownMenuRadioGroup
            value={aspectRatio}
            onValueChange={(nextValue) =>
              onAspectRatioChange(String(nextValue))
            }
            className="grid grid-cols-3 gap-1.5 sm:grid-cols-5"
          >
            {aspectRatioOptions.map((option) => {
              const selected = aspectRatio === option.value;
              return (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  label={option.value}
                  closeOnClick={false}
                  className={`group/ratio flex h-[74px] flex-col justify-center gap-1.5 rounded-[14px] border border-transparent px-1.5 py-1.5 text-xs font-medium transition-[background-color,border-color,color,box-shadow] duration-150 [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden ${
                    isConsoleAppearance
                      ? 'text-neutral-400 hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.08] focus:text-white data-checked:border-white/[0.04] data-checked:bg-[#303135] data-checked:text-white data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                      : 'text-[#627181] hover:bg-[#f3f5f6] hover:text-[#15202b] focus:bg-[#e9eef1] focus:text-[#15202b] data-checked:bg-[#e9eef1] data-checked:text-[#15202b]'
                  }`}
                >
                  <span
                    className="grid size-7 shrink-0 place-items-center"
                    aria-hidden="true"
                  >
                    <span
                      className={`block rounded-[2px] border-2 transition-colors ${option.previewClassName} ${
                        selected
                          ? isConsoleAppearance
                            ? 'border-cyan-100 text-cyan-100'
                            : 'border-[#15202b] text-[#15202b]'
                          : isConsoleAppearance
                            ? 'border-neutral-600 text-neutral-600 group-hover/ratio:border-neutral-300 group-hover/ratio:text-neutral-300'
                            : 'border-[#8ba0ac] text-[#8ba0ac] group-hover/ratio:border-[#4b5b68] group-hover/ratio:text-[#4b5b68]'
                      }`}
                    />
                  </span>
                  <span className="tabular-nums">{option.value}</span>
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AttachmentPreview({
  attachment,
  appearance = 'light',
  compact = false,
  onRemove,
  removeLabel,
  frameLabel,
}: {
  attachment: ReferenceAttachment;
  appearance?: 'light' | 'console';
  compact?: boolean;
  onRemove: () => void;
  removeLabel: string;
  frameLabel?: string;
}) {
  const isConsoleAppearance = appearance === 'console';

  return (
    <figure
      className={`group/attachment relative shrink-0 overflow-visible rounded-lg border ${
        isConsoleAppearance
          ? 'border-white/15 bg-white/[0.06] shadow-[0_6px_16px_rgba(0,0,0,0.24)]'
          : 'border-[#e8cbd5] bg-[#fffafd] shadow-[0_6px_16px_rgba(66,20,37,0.12)]'
      } ${compact ? 'size-10' : 'size-12'}`}
    >
      {attachment.type === 'video' ? (
        <video
          src={attachment.previewUrl}
          muted
          playsInline
          className="size-full rounded-[7px] object-cover"
        />
      ) : (
        <img
          src={attachment.previewUrl}
          alt={attachment.name}
          className="size-full rounded-[7px] object-cover"
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${removeLabel}: ${attachment.name}`}
        className={`absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full border bg-white shadow-[0_2px_8px_rgba(21,32,43,0.16)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isConsoleAppearance
            ? 'border-white/15 bg-[#26292c] text-neutral-300 hover:bg-red-500 hover:text-white focus-visible:outline-cyan-200'
            : 'border-[#e8cbd5] text-[#627181] hover:bg-[#ef5350] hover:text-white focus-visible:outline-[#c92f68]'
        }`}
      >
        <X className="size-3" strokeWidth={2.5} aria-hidden="true" />
      </button>
      <figcaption
        className={
          frameLabel
            ? 'absolute top-full left-1/2 mt-1 -translate-x-1/2 text-[10px] whitespace-nowrap text-neutral-400'
            : 'sr-only'
        }
      >
        {frameLabel ?? attachment.name}
      </figcaption>
    </figure>
  );
}
