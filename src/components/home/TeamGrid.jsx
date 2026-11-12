import { Link } from "react-router-dom";
import Section from "@/components/site/Section";
import TeamCard from "@/components/site/TeamCard";
import { nextEventFor as findNext } from "@/lib/selectors";
import { brandFor } from "@/lib/brand";

export default function TeamGrid({ teams = [], brands = [], sponsors = [], events = [] }) {
  return (
    <Section
      id="teams"
      eyebrow="Team hubs"
      title="Your team, one tap away"
      intro="Each team has its own hub with the schedule, roster, live stream, photos, and coach contacts."
      action={
        <Link
          to="/schedule"
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:underline"
        >
          Full schedule →
        </Link>
      }
    >
      {teams.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              brand={brandFor(team, brands)}
              sponsors={sponsors}
              nextEvent={findNext(events, team.id)}
            />
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-border bg-card/50 px-5 py-10 text-center text-sm text-muted-foreground">
          No teams are active right now. Check back soon.
        </p>
      )}
    </Section>
  );
}