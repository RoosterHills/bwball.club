import { fmtDayNum, fmtMonth, fmtTime, countdown } from "@/lib/format";
import { cn } from "@/lib/utils";

const TYPE_STYLE = {
  game: "border-accent/30 bg-accent/10 text-accent",
  practice: "border-primary/15 bg-primary/[0.05] text-primary/70",
  tournament: "border-primary bg-primary text-primary-foreground",
  meeting: "border-border bg-secondary text-foreground/60",
  other: "border-border bg-secondary text-foreground/60",
};

const TYPE_LABEL = {
  game: "Game",
  practice: "Practice",
  tournament: "Tournament",
  meeting: "Meeting",
  other: "Event",
};

export default function EventRow({ event, teamName, showCountdown = true }) {
  return (
    <div className="flex items-center gap-4 border-b border-border/70 py-3.5 last:border-0">
      <div className="w-12 shrink-0 border-r border-border/70 pr-3 text-center">
        <div className="eyebrow text-muted-foreground">{fmtMonth(event.start)}</div>
        <div className="num mt-1 text-xl font-semibold leading-none">{fmtDayNum(event.start)}</div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "eyebrow rounded-[3px] border px-1.5 py-1",
              TYPE_STYLE[event.type] || TYPE_STYLE.other
            )}
          >
            {TYPE_LABEL[event.type] || "Event"}
          </span>
          {teamName ? (
            <span className="eyebrow text-muted-foreground">{teamName}</span>
          ) : null}
        </div>
        <p className="mt-1.5 truncate text-sm font-semibold leading-snug">{event.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {fmtTime(event.start)}
          {event.location ? ` · ${event.location}` : ""}
        </p>
      </div>
      {showCountdown ? (
        <span className="num hidden shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
          {countdown(event.start)}
        </span>
      ) : null}
    </div>
  );
}