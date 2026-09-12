"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { MessageDto } from "@/lib/types";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  if (name === "You") return "You";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

type EventChatProps = {
  eventId: string;
  joined: boolean;
  attendeeCount: number;
  messages: MessageDto[];
  onSend: (body: string) => Promise<void>;
};

/**
 * Group chat, kept from the prototype: members-only (locked teaser until
 * joined), message bubbles with mine/theirs styling, pill composer with a
 * gradient send button.
 */
export function EventChat({ joined, attendeeCount, messages, onSend }: EventChatProps) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      await onSend(body);
      setDraft("");
      requestAnimationFrame(() => {
        listRef.current?.lastElementChild?.scrollIntoView({ block: "end" });
        inputRef.current?.focus();
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2.5 border-t border-line-soft pt-3.5">
      <div className="flex items-center gap-2">
        <h3 className="font-heading m-0 text-[13.5px] font-bold">Group chat</h3>
        <span className="text-xs text-faint tabular-nums">{messages.length} messages</span>
      </div>

      {!joined ? (
        <div className="flex flex-col items-center gap-[7px] rounded-[14px] border border-dashed border-line bg-line-soft px-4 py-[18px] text-center text-[13px] text-mute">
          <Icon name="lock" className="size-[19px] text-faint" />
          <span>Join to open the group chat with {attendeeCount} people.</span>
        </div>
      ) : (
        <>
          <div ref={listRef} className="flex flex-col gap-[11px]">
            {messages.map((m) => (
              <div key={m.id} className="flex gap-[9px]">
                <Avatar className="size-[25px] flex-none" title={m.authorName}>
                  <AvatarFallback
                    className={cn("text-[10px] font-bold text-white", m.mine && "bg-ink")}
                    style={m.mine ? undefined : { backgroundColor: m.authorColor }}
                  >
                    {initials(m.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[11.5px] font-bold text-eucalyptus">
                    {m.authorName}
                    <time className="ml-1.5 font-medium text-faint tabular-nums">{m.timeLabel}</time>
                  </span>
                  <span
                    className={cn(
                      "rounded-[4px_13px_13px_13px] bg-line-soft px-3 py-2 text-[13.5px] leading-[1.45] break-anywhere text-[#22332c]",
                      m.mine && "rounded-[13px_4px_13px_13px] bg-[#e6f2df]",
                    )}
                  >
                    {m.body}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message the group…"
              aria-label="Message the group"
              autoComplete="off"
              maxLength={500}
              className="h-auto flex-1 rounded-full border-[1.5px] border-line bg-white px-[15px] py-[11px] text-[13.5px] shadow-none placeholder:text-faint focus-visible:border-jade focus-visible:ring-0"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={sending || !draft.trim()}
              className="grid size-[42px] flex-none place-items-center rounded-full bg-brand text-white transition-[filter] hover:brightness-[1.06] disabled:opacity-50"
            >
              <Icon name="send" className="size-[17px]" strokeWidth={2} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
