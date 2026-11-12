import PageHeader from "@/components/site/PageHeader";
import { EmptyBlock, LoadingBlock } from "@/components/site/Loading";
import { useSiteData } from "@/hooks/useSiteData";
import { nextEventFor, recordLine, teamDisplayName } from "@/lib/selectors";
import { fmtDate, fmtTime } from "@/lib/format";
import { BTN } from "@/lib/styles";

const LINKS = [
  { key: "gamechanger_url", label: "Open GameChanger" },
  { key: "watch_live_url", label: "Watch Live" },
  { key: "schedule_url", label: "View Schedule" },
  { key: "stats_url", label: "View Team Stats" },
];

export default function GameChangerHub() {
  const { teams, sponsors, events, loading } = useSiteData();

  return (
    <>
      <PageHeader
        eyebrow="GameChanger hub"
        title="Scores, streams, and stats"
        intro="GameChanger doesn't offer a public feed, so each team keeps its links here. When a link changes, an admin updates it once and every button on the site follows."
      />

      {loading ? (
        <LoadingBlock label="Loading team links" />
      ) : (
        <div className="shell grid gap-4 py-10 lg:grid-cols-2">
          {teams.length ? (
            teams.map((team) => {
              const next = nextEventFor(events, team.id);
              return (
                <div key={team.id} className="border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-accent">{team.age_group}</p>
                      <h2 className="display mt-2 text-2xl leading-tight">
                        {teamDisplayName(team, sponsors)}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="eyebrow text-muted-foreground">Record</p>
                      <p className="num mt-1 text-lg font-semibold">{recordLine(team)}</p>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                    {next
                      ? `Next up: ${next.title} · ${fmtDate(next.start)}, ${fmtTime(next.start)}`
                      : "No games scheduled yet."}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {LINKS.map(({ key, label }) =>
                      team[key] ? (
                        <a
                          key={key}
                          href={team[key]}
                          target="_blank"
                          rel="noreferrer"
                          className={BTN.ghost}
                        >
                          {label}
                        </a>
                      ) : (
                        <span
                          key={key}
                          className="inline-flex items-center justify-center rounded-[4px] border border-dashed border-border px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60"
                        >
                          {label} · link soon
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="lg:col-span-2">
              <EmptyBlock>No teams are active yet.</EmptyBlock>
            </div>
          )}
        </div>
      )}
    </>
  );
}