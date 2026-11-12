import { Image } from "@/components/ui/image";
import { recordLine, teamDisplayName, winPct } from "@/lib/selectors";

export default function TeamHeader({ team, sponsors = [] }) {
  const name = teamDisplayName(team, sponsors);
  const pct = winPct(team);

  return (
    <div className="border-b border-border bg-primary text-primary-foreground">
      <div className="shell grid gap-6 py-8 sm:py-10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="eyebrow text-accent">
            {team.age_group} {team.season ? `· ${team.season}` : ""}
          </p>
          <h1 className="display mt-3 text-[2.6rem] leading-[0.95] sm:text-5xl">{name}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-primary-foreground/55">
            <span>
              Record{" "}
              <span className="num ml-1 text-base font-semibold text-primary-foreground">
                {recordLine(team)}
              </span>
            </span>
            {pct !== null ? (
              <span>
                Win rate{" "}
                <span className="num ml-1 text-base font-semibold text-primary-foreground">
                  {Math.round(pct * 100)}%
                </span>
              </span>
            ) : null}
            {team.head_coach ? (
              <span>
                Head coach{" "}
                <span className="font-medium text-primary-foreground">{team.head_coach}</span>
              </span>
            ) : null}
            {team.division ? <span>{team.division}</span> : null}
          </div>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden border border-primary-foreground/15">
          {team.photo ? (
            <Image src={team.photo} alt={name} fittingType="fill" className="h-full w-full object-cover" />
          ) : (
            <div className="stitch flex h-full items-center justify-center">
              <span className="display text-6xl text-primary-foreground/15">{team.age_group}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}