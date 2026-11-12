import { useState } from "react";
import PageHeader from "@/components/site/PageHeader";
import AnnouncementCard from "@/components/site/AnnouncementCard";
import { EmptyBlock, LoadingBlock } from "@/components/site/Loading";
import { useSiteData } from "@/hooks/useSiteData";
import { teamNameMap } from "@/lib/selectors";
import { cn } from "@/lib/utils";

export default function News() {
  const { announcements, teams, loading } = useSiteData();
  const [teamId, setTeamId] = useState("all");
  const names = teamNameMap(teams);

  const visible = announcements
    .filter((a) => teamId === "all" || a.team === teamId)
    .sort(
      (a, b) =>
        new Date(b.publish_date || b.created_date || 0) -
        new Date(a.publish_date || a.created_date || 0)
    );

  return (
    <>
      <PageHeader
        eyebrow="Announcements"
        title="Everything posted, newest first"
        intro="League news, weather updates, schedule changes, and team notes. Priority items are flagged so nothing important gets missed."
      >
        <div className="flex flex-wrap gap-2">
          {[{ id: "all", label: "All news" }, ...teams].map((t) => (
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
        <LoadingBlock label="Loading announcements" />
      ) : (
        <div className="shell py-10">
          {visible.length ? (
            <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} teamName={names[a.team]} />
              ))}
            </div>
          ) : (
            <EmptyBlock>No announcements for this filter.</EmptyBlock>
          )}
        </div>
      )}
    </>
  );
}