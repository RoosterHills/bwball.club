import { Link } from "react-router-dom";
import Section from "@/components/site/Section";
import EventRow from "@/components/site/EventRow";
import { eventsInWindow, teamNameMap } from "@/lib/selectors";

export default function ThisWeek({ events = [], teams = [] }) {
  const window = eventsInWindow(events, 7);
  const names = teamNameMap(teams);

  return (
    <div className="bg-secondary/40">
      <Section
        eyebrow="Next 7 days"
        title="What's happening this week"
        action={
          <Link
            to="/schedule"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:underline"
          >
            Open schedule →
          </Link>
        }
      >
        {window.length ? (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="border border-border bg-card px-5">
              {window.slice(0, 6).map((event) => (
                <EventRow key={event.id} event={event} teamName={names[event.team]} />
              ))}
            </div>
            <div className="border border-border bg-card p-5">
              <p className="eyebrow text-muted-foreground">Game day checklist</p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/75">
                <li>Jersey, pants, belt, and hat packed the night before.</li>
                <li>Arrive 45 minutes before first pitch.</li>
                <li>Bring water — concessions support the program, but hydration is on us.</li>
                <li>Check the news feed for weather and field changes.</li>
              </ul>
              <Link
                to="/parents"
                className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:underline"
              >
                Parent resources →
              </Link>
            </div>
          </div>
        ) : (
          <p className="border border-dashed border-border bg-card/60 px-5 py-10 text-center text-sm text-muted-foreground">
            Nothing on the calendar in the next seven days.
          </p>
        )}
      </Section>
    </div>
  );
}