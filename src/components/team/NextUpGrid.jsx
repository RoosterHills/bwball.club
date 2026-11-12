import { MapPin } from "lucide-react";
import { nextOfType } from "@/lib/selectors";
import { fmtLongDate, fmtTime } from "@/lib/format";

const SLOTS = [
  { type: "practice", label: "Next practice" },
  { type: "game", label: "Next game" },
  { type: "tournament", label: "Upcoming tournament" },
];

export default function NextUpGrid({ team, events = [] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {SLOTS.map(({ type, label }) => {
        const event = nextOfType(events, team.id, type);
        return (
          <div key={type} className="border border-border bg-card p-5">
            <p className="eyebrow text-accent">{label}</p>
            {event ? (
              <>
                <p className="mt-3 text-[15px] font-semibold leading-snug">{event.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{fmtLongDate(event.start)}</p>
                <p className="num mt-3 text-sm font-semibold">{fmtTime(event.start)}</p>
                <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{event.location || "Location TBD"}</span>
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Nothing scheduled yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}