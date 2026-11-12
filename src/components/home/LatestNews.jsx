import { Link } from "react-router-dom";
import Section from "@/components/site/Section";
import AnnouncementCard from "@/components/site/AnnouncementCard";
import { teamNameMap } from "@/lib/selectors";

export default function LatestNews({ announcements = [], teams = [], title }) {
  const names = teamNameMap(teams);
  const latest = [...announcements]
    .sort(
      (a, b) =>
        new Date(b.publish_date || b.created_date || 0) -
        new Date(a.publish_date || a.created_date || 0)
    )
    .slice(0, 3);

  return (
    <Section
      eyebrow="From the dugout"
      title={title || "Latest announcements"}
      action={
        <Link
          to="/news"
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:underline"
        >
          All news →
        </Link>
      }
    >
      {latest.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} teamName={names[a.team]} />
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
          No announcements yet.
        </p>
      )}
    </Section>
  );
}