import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { useCollection, useSiteData } from "@/hooks/useSiteData";
import { sortedEvents, teamDisplayName } from "@/lib/selectors";
import { brandFont, brandFor, brandVars } from "@/lib/brand";
import { isUpcoming } from "@/lib/format";
import TeamHeader from "@/components/team/TeamHeader";
import NextUpGrid from "@/components/team/NextUpGrid";
import TeamLinks from "@/components/team/TeamLinks";
import WeatherCard from "@/components/team/WeatherCard";
import EventRow from "@/components/site/EventRow";
import AnnouncementCard from "@/components/site/AnnouncementCard";
import { LoadingBlock } from "@/components/site/Loading";
import NotFoundBlock from "@/components/site/NotFoundBlock";
import { BTN } from "@/lib/styles";

// Matches a team by record id (/teams/abc) or public slug (/16u, /13u).
const matchTeam = (teams, { teamId, slug }) => {
  if (teamId) return teams.find((t) => t.id === teamId);
  const key = String(slug || "").toLowerCase();
  if (!key) return undefined;
  return teams.find((t) => {
    const teamSlug = String(t.slug || "").toLowerCase().replace(/^\/+/, "");
    const age = String(t.age_group || "").toLowerCase();
    return teamSlug === key || (!teamSlug && age === key);
  });
};

export default function TeamHub() {
  const params = useParams();
  const { teams, brands, sponsors, events, announcements, loading } = useSiteData();
  const { items: resources } = useCollection("Resource", "sort_order");

  const team = matchTeam(teams, params);
  const brand = team ? brandFor(team, brands) : null;

  if (loading) return <LoadingBlock label="Loading team" />;
  if (!team) {
    return (
      <NotFoundBlock
        title="Team not found"
        message="That team hub isn't active. Head back to the homepage to pick a team."
      />
    );
  }

  const teamEvents = sortedEvents(events).filter((e) => e.team === team.id);
  const upcoming = teamEvents.filter((e) => isUpcoming(e.start));
  const teamNews = announcements.filter((a) => a.team === team.id);
  const teamResources = resources.filter(
    (r) => r.visibility !== "coaches" && (!r.team || r.team === team.id)
  );

  return (
    <div data-brand-font={brandFont(brand)} style={brandVars(brand)}>
      <div className="shell pt-6">
        <Link
          to="/#teams"
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="h-3 w-3" /> All team hubs
        </Link>
      </div>

      <div className="mt-4">
        <TeamHeader team={team} sponsors={sponsors} brand={brand} />
      </div>

      <div className="shell space-y-10 py-8 sm:py-10">
        <NextUpGrid team={team} events={events} />
        <TeamLinks team={team} />

        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          <div>
            <div className="flex items-end justify-between border-t border-border pt-5">
              <h2 className="display text-2xl">Team schedule</h2>
              <Link to={`/schedule?team=${team.id}`} className={BTN.small}>
                Open →
              </Link>
            </div>
            <div className="mt-3 border border-border bg-card px-5">
              {upcoming.length ? (
                upcoming.map((event) => <EventRow key={event.id} event={event} />)
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No upcoming events on the calendar.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between border-t border-border pt-5">
              <h2 className="display text-2xl">Team news</h2>
              <Link to="/news" className={BTN.small}>
                All →
              </Link>
            </div>
            <div className="mt-3 space-y-6">
              {teamNews.length ? (
                teamNews
                  .slice(0, 3)
                  .map((a) => (
                    <AnnouncementCard
                      key={a.id}
                      announcement={a}
                      teamName={teamDisplayName(team, sponsors)}
                    />
                  ))
              ) : (
                <p className="border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
                  No team-specific announcements.
                </p>
              )}
            </div>
            <WeatherCard />
          </div>
        </div>

        {teamResources.length ? (
          <div>
            <div className="flex items-end justify-between border-t border-border pt-5">
              <h2 className="display text-2xl">Team resources</h2>
              <Link to="/parents" className={BTN.small}>
                All resources →
              </Link>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {teamResources.map((r) => (
                <a
                  key={r.id}
                  href={r.file_url || r.link_url || "/parents"}
                  target={r.file_url || r.link_url ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-3 border border-border bg-card px-4 py-3.5 text-sm hover:border-accent/50"
                >
                  <FileText className="h-4 w-4 shrink-0 brand-accent-text" strokeWidth={1.75} />
                  <span className="truncate font-medium">{r.title}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}