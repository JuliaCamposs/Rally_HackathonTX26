"use client";

import { Camera, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { POINTS_PER_PRESENCE } from "@/lib/points";
import { cn } from "@/lib/utils";

type ConfirmPresenceButtonProps = {
  joined: boolean;
  live: boolean;
  present: boolean;
  onConfirm: (proof: File) => Promise<void> | void;
  className?: string;
};

export function ConfirmPresenceButton({
  joined,
  live,
  present,
  onConfirm,
  className,
}: ConfirmPresenceButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function clearPhoto() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setProof(null);
    setPreviewUrl(null);
  }

  async function handleSubmit() {
    if (pending || present || !joined || !live || !proof) return;
    setPending(true);
    setError(null);
    try {
      await onConfirm(proof);
      clearPhoto();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit photo proof");
    } finally {
      setPending(false);
    }
  }

  function openPhotoPicker() {
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.click();
  }

  function choosePhoto(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setError("Keep the event photo under 20 MB.");
      return;
    }
    if (file.type && !file.type.startsWith("image/")) {
      setError("Choose a valid event photo.");
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setProof(file);
    setPreviewUrl(nextPreviewUrl);
  }

  if (!joined) {
    return (
      <p className="m-0 text-center text-[12.5px] text-mute">
        Join, then check in with an event photo for {POINTS_PER_PRESENCE} points.
      </p>
    );
  }

  if (present) {
    return (
      <Button
        type="button"
        disabled
        aria-pressed={true}
        className={cn(
          "w-full rounded-xl border-[1.5px] border-pistachio bg-pistachio/40 text-[14.5px] font-bold text-deep shadow-none hover:bg-pistachio/40",
          className,
        )}
      >
        <Icon name="check" className="size-4" strokeWidth={2.2} />
        Photo submitted · +{POINTS_PER_PRESENCE}
      </Button>
    );
  }

  if (!live) {
    return (
      <p className="m-0 text-center text-[12.5px] text-mute">
        Photo check-in opens when the event starts.
      </p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-label="Take or choose an event photo"
        onChange={(event) => choosePhoto(event.target.files?.[0])}
      />

      {previewUrl && proof ? (
        <div className="overflow-hidden rounded-xl border border-line bg-white p-2.5">
          {/* A blob URL is local-only and cannot be optimized by next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Your event photo proof preview"
            className="aspect-[16/9] w-full rounded-lg bg-ground object-cover"
          />
          <p className="mt-2 mb-0 text-[11.5px] leading-relaxed text-mute">
            Your photo stays private and is stored only as check-in proof.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={openPhotoPicker}
              className="rounded-lg border-line font-bold"
            >
              <RotateCcw className="size-3.5" />
              Retake
            </Button>
            <Button
              type="button"
              disabled={pending}
              onClick={handleSubmit}
              className="rounded-lg bg-brand font-bold text-white hover:brightness-[1.06]"
            >
              <Icon name="check" className="size-3.5" strokeWidth={2.2} />
              {pending ? "Submitting…" : `Submit · +${POINTS_PER_PRESENCE}`}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button
            type="button"
            onClick={openPhotoPicker}
            className="w-full rounded-xl bg-brand text-[14.5px] font-bold text-white shadow-[0_3px_12px_rgba(15,92,76,0.24)] hover:brightness-[1.06]"
          >
            <Camera className="size-4" strokeWidth={2.2} />
            I&apos;m here · take a photo
          </Button>
          <p className="m-0 text-center text-[11.5px] text-mute">
            Photo proof is required to earn +{POINTS_PER_PRESENCE} points.
          </p>
        </>
      )}

      {error && (
        <p role="alert" className="m-0 text-center text-[12px] font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
