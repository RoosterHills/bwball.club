import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { recordLine, teamDisplayName } from "@/lib/selectors";
import { fmtDate, fmtTime } from "@/lib/format";

export default function TeamCard({ team, sponsors, nextEvent }) {
  const name = teamDisplayName(team, sponsors);

  return (
    <Link
      to={`/teams/${team.id}`}
      className="group lift flex flex-col overflow-hidden rounded-[6px] border border-border bg-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-primary/5">
        {team.photo ? (
          <Image
            src={team.photo}
            alt={name}
            fittingType="fill"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.10),transparent_60%)]">
            <span className="display text-5xl text-primary/15">{team.age_group}</span>
          </div>
        )}
        <span className="num absolute left-3 top-3 rounded-[3px] bg-primary px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-primary-foreground">
          {team.age_group}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="display text-xl leading-tight">{name}</h3>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-accent" />
        </div>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="num font-semibold text-foreground/70">{recordLine(team)}</span>
          {team.season ? <span>{team.season}</span> : null}
        </div>

        <div className="mt-auto border-t border-border/70 pt-3.5 text-xs">
          {nextEvent ? (
            <>
              <span className="eyebrow text-muted-foreground">Next up</span>
              <p className="mt-1.5 font-medium">
                {nextEvent.title} · {fmtDate(nextEvent.start)}, {fmtTime(nextEvent.start)}
              </p>
            </>
          ) : (
            <span className="text-muted-foreground">No events scheduled yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}