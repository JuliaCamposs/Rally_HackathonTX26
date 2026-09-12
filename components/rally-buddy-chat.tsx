"use client";

import { useRef, useState } from "react";
import { ArrowRight, Clock, MapPin, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { RallyBuddy } from "@/components/rally-buddy";
import type { BuddyResponse } from "@/lib/types";

type BuddyState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: BuddyResponse }
  | { kind: "error"; message: string };

export function RallyBuddyChat({ onSelectEvent }: { onSelectEvent: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<BuddyState>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2 || state.kind === "loading") return;
    setState({ kind: "loading" });

    try {
      const response = await fetch("/api/buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const payload = (await response.json().catch(() => null)) as (BuddyResponse & { error?: string }) | null;
      if (!response.ok) throw new Error(payload?.error ?? "Rally Buddy couldn’t search right now.");
      setState({ kind: "success", data: payload as BuddyResponse });
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "Rally Buddy couldn’t search right now.",
      });
    }
  }

  function reset() {
    setQuery("");
    setState({ kind: "idle" });
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="rally-buddy-chat">
      {open && (
        <section className="rally-buddy-panel" aria-label="Rally Buddy activity finder">
          <header>
            <div className="rally-buddy-panel-avatar"><RallyBuddy animated /></div>
            <div>
              <span><Sparkles size={12} /> AI activity finder</span>
              <h2>Rally Buddy</h2>
              <p>Tell me what you feel like doing.</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Rally Buddy"><X size={17} /></button>
          </header>

          <div className="rally-buddy-conversation" aria-live="polite">
            {state.kind === "idle" && (
              <div className="rally-buddy-intro">
                <p>I’ll look only at events that are actually on Rally right now.</p>
                <div>
                  {["Something social tonight", "A beginner-friendly workout", "Help me study"].map((idea) => (
                    <button key={idea} type="button" onClick={() => { setQuery(idea); inputRef.current?.focus(); }}>{idea}</button>
                  ))}
                </div>
              </div>
            )}

            {state.kind === "loading" && (
              <div className="rally-buddy-status" role="status">
                <RallyBuddy animated className="h-16 w-12" />
                <span>Checking the live Rally map…</span>
              </div>
            )}

            {state.kind === "error" && (
              <div className="rally-buddy-error" role="alert">
                <strong>I hit a detour.</strong>
                <p>{state.message}</p>
                <button type="button" onClick={() => setState({ kind: "idle" })}><RotateCcw size={14} /> Try again</button>
              </div>
            )}

            {state.kind === "success" && (
              <div className="rally-buddy-results">
                <p className="rally-buddy-reply">{state.data.reply}</p>
                {state.data.recommendations.length === 0 ? (
                  <div className="rally-buddy-empty">
                    <RallyBuddy className="h-16 w-12" />
                    <span>No matching events yet. Try a different activity or time.</span>
                  </div>
                ) : (
                  <div className="rally-buddy-recommendations">
                    {state.data.recommendations.map(({ event, reason }) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => { onSelectEvent(event.id); setOpen(false); }}
                      >
                        <span className="rally-buddy-rec-title">{event.title}<ArrowRight size={15} /></span>
                        <span className="rally-buddy-rec-reason">{reason}</span>
                        <span className="rally-buddy-rec-meta">
                          <span><MapPin size={12} /> {event.venueName}</span>
                          <span><Clock size={12} /> {event.live ? "Happening now" : `${event.dayLabel} · ${event.timeLabel}`}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <button type="button" className="rally-buddy-new-search" onClick={reset}>
                  <RotateCcw size={13} /> New search
                </button>
                <small>{state.data.remaining} of 6 searches left this minute</small>
              </div>
            )}
          </div>

          <form onSubmit={search}>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. I want to meet people outdoors"
              aria-label="Describe an activity"
              maxLength={300}
              disabled={state.kind === "loading"}
            />
            <button type="submit" aria-label="Ask Rally Buddy" disabled={query.trim().length < 2 || state.kind === "loading"}>
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="rally-buddy-launcher"
        onClick={() => { setOpen((value) => !value); requestAnimationFrame(() => inputRef.current?.focus()); }}
        aria-expanded={open}
        aria-label={open ? "Close Rally Buddy" : "Ask Rally Buddy to find an activity"}
      >
        <RallyBuddy animated className="h-14 w-11" />
        <span><strong>Ask Rally Buddy</strong><small>Find your next plan</small></span>
      </button>
    </div>
  );
}
