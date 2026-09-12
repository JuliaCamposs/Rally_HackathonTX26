function clockParts(d: Date): { h: number; m: string; ampm: string } {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return { h, m, ampm };
}

/** "3:22 PM" */
export function formatClock(d: Date): string {
  const { h, m, ampm } = clockParts(d);
  return `${h}:${m} ${ampm}`;
}

/** "3:40 – 5:30 PM" (meridiem repeated when it flips) */
export function formatTimeRange(start: Date, end: Date): string {
  const s = clockParts(start);
  const e = clockParts(end);
  const startLabel = s.ampm === e.ampm ? `${s.h}:${s.m}` : `${s.h}:${s.m} ${s.ampm}`;
  return `${startLabel} – ${e.h}:${e.m} ${e.ampm}`;
}

/** "Today" / "Tomorrow" / "Fri, Oct 3" */
export function formatDay(d: Date, now: Date): string {
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(d) - startOfDay(now)) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** "Started 20 min ago" / "Starts in 2 hr" / "Ended" */
export function formatWhen(start: Date, end: Date, now: Date): string {
  if (now >= start && now <= end) {
    const mins = Math.max(1, Math.round((now.getTime() - start.getTime()) / 60_000));
    if (mins < 60) return `Started ${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return `Started ${hrs} hr ago`;
  }
  if (now < start) {
    const mins = Math.max(1, Math.round((start.getTime() - now.getTime()) / 60_000));
    if (mins < 60) return `Starts in ${mins} min`;
    const hrs = Math.round(mins / 60);
    return `Starts in ${hrs} hr`;
  }
  return "Ended";
}

export function isLive(start: Date, end: Date, now: Date): boolean {
  return now >= start && now <= end;
}
