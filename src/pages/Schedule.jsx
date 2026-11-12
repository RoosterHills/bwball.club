import { useState } from "react";
import PageHeader from "@/components/site/PageHeader";
import EventRow from "@/components/site/EventRow";
import { LoadingBlock } from "@/components/site/Loading";
import { useSiteData } from "@/hooks/useSiteData";
import { sortedEvents, teamNameMap, upcomingEvents } from "@/lib/selectors";
import { isUpcoming } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function Schedule() {
  const { teams, events, loading } = useSiteData();
  const [teamId, setTeamId] = useState(
    () => new URLSearchParams(window.location.search).get("team") || "all"
  );

  const names = teamNameMap(teams);
  const forTeam = (e) => teamId === "all" || e.team === teamId;
  const upcoming = upcomingEvents(events.filter(forTeam));
  const past = sortedEvents(events.filter(forTeam))
    .filter((e) => !isUpcoming(e.start))
    .reverse()
    .slice(0, 8);

  return (
    <>
      <PageHeader
        eyebrow="Schedule"
        title="Game and practice calendar"
        intro="Every team in one calendar. Filter by team, or open a team hub for its full season."
      >
        <div className="flex flex-wrap gap-2">
          {[{ id: "all", label: "All teams" }, ...teams].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTeamId(t.id)}
              className={cn(
                "rounded-[3px] border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors",
                teamId === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/60 hover:border-accent hover:text-accent"
              )}
            >
              {t.label || [t.name, t.age_group].filter(Boolean).join(" ")}
            </button>
          ))}
        </div>
      </PageHeader>

      {loading ? (
        <LoadingBlock label="Loading schedule" />
      ) : (
        <div className="shell grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="display text-2xl">Upcoming</h2>
            <div className="mt-3 border border-border bg-card px-5">
              {upcoming.length ? (
                upcoming.map((event) => (
                  <EventRow key={event.id} event={event} teamName={names[event.team]} />
                ))
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Nothing scheduled for this filter yet.
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="display text-2xl">Recently played</h2>
            <div className="mt-3 border border-border bg-card px-5">
              {past.length ? (
                past.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    teamName={names[event.team]}
                    showCountdown={false}
                  />
                ))
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Past events will appear here once games are played.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}