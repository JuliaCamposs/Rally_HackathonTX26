"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { POINTS_PER_PRESENCE } from "@/lib/points";
import { cn } from "@/lib/utils";

type ConfirmPresenceButtonProps = {
  joined: boolean;
  present: boolean;
  onConfirm: () => Promise<void> | void;
  className?: string;
};

export function ConfirmPresenceButton({
  joined,
  present,
  onConfirm,
  className,
}: ConfirmPresenceButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending || present || !joined) return;
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
    }
  }

  if (!joined) {
    return (
      <p className="m-0 text-center text-[12.5px] text-mute">
        Join, then confirm you&apos;re here for {POINTS_PER_PRESENCE} points.
      </p>
    );
  }

  return (
    <Button
      type="button"
      disabled={pending || present}
      aria-pressed={present}
      onClick={handleClick}
      className={cn(
        "w-full rounded-xl text-[14.5px] font-bold",
        present
          ? "border-[1.5px] border-pistachio bg-pistachio/40 text-deep shadow-none hover:bg-pistachio/40"
          : "bg-brand text-white shadow-[0_3px_12px_rgba(15,92,76,0.24)] hover:brightness-[1.06]",
        className,
      )}
    >
      <Icon name="check" className="size-4" strokeWidth={2.2} />
      {present
        ? `Presence confirmed · +${POINTS_PER_PRESENCE}`
        : `I'm here · +${POINTS_PER_PRESENCE} pts`}
    </Button>
  );
}
