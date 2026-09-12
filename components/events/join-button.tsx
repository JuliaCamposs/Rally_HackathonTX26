"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JoinButtonProps = {
  joined: boolean;
  onToggle: () => Promise<void> | void;
  size?: "default" | "sm";
  className?: string;
};

/**
 * The Rally join CTA, kept from the prototype: gradient pill "Join this
 * event" that flips to an outlined "You are going · Leave" once joined.
 */
export function JoinButton({ joined, onToggle, size = "default", className }: JoinButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);
    try {
      await onToggle();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      disabled={pending}
      aria-pressed={joined}
      onClick={handleClick}
      className={cn(
        "w-full rounded-xl text-[14.5px] font-bold transition-[filter,background,color,border-color]",
        size === "default" ? "h-auto px-5 py-[13px]" : "h-10 px-4 text-[13px]",
        joined
          ? "border-[1.5px] border-line bg-white text-eucalyptus shadow-none hover:border-eucalyptus hover:bg-white"
          : "bg-eucalyptus text-white shadow-sm hover:brightness-[1.06]",
        className,
      )}
    >
      <Icon
        name={joined ? "check" : "plus"}
        className={size === "default" ? "size-4" : "size-3.5"}
        strokeWidth={2.2}
      />
      {joined ? "You are going · Leave" : "Join this event"}
    </Button>
  );
}
