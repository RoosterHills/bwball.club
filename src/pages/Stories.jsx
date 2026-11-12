import { useMemo, useState } from "react";
import { Image } from "@/components/ui/image";
import { useCollection } from "@/hooks/useSiteData";
import { EmptyBlock, LoadingBlock } from "@/components/site/Loading";

const KIND_LABEL = {
  community_impact: "Community impact",
  alumni_spotlight: "Alumni spotlight",
  championship: "Championships",
  award: "Awards",
  team_history: "Team history",
  fundraiser: "Fundraisers",
};

export default function Stories() {
  const { items, loading } = useCollection("Story", "sort_order");
  const [filter, setFilter] = useState("all");

  const stories = useMemo(() => items.filter((s) => s.published !== false), [items]);
  const kinds = useMemo(
    () => Array.from(new Set(stories.map((s) => s.kind).filter(Boolean))),
    [stories]
  );
  const shown = filter === "all" ? stories : stories.filter((s) => s.kind === filter);

  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="shell py-10 sm:py-14">
          <p className="eyebrow text-accent">Community & alumni</p>
          <h1 className="display mt-3 text-4xl leading-[0.95] sm:text-5xl">
            The story of this program
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Championships, awards, service projects and the players who came through here before.
            Big Walnut Baseball is built by the families, volunteers and alumni around it.
          </p>
        </div>
      </div>

      <div className="shell py-8 sm:py-10">
        {kinds.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "border border-primary bg-primary px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                  : "border border-border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 hover:border-accent hover:text-accent"
              }
            >
              Everything
            </button>
            {kinds.map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setFilter(kind)}
                className={
                  filter === kind
                    ? "border border-primary bg-primary px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                    : "border border-border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 hover:border-accent hover:text-accent"
                }
              >
                {KIND_LABEL[kind] || kind}
              </button>
            ))}
          </div>
        ) : null}

        {loading ? (
          <LoadingBlock label="Loading stories" />
        ) : shown.length ? (
          <div className="mt-6 space-y-5">
            {shown.map((story) => (
              <article
                key={story.id}
                className="grid gap-5 border border-border bg-card p-5 sm:grid-cols-[280px_1fr] sm:p-6"
              >
                {story.image ? (
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fittingType="fill"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div>
                  <p className="eyebrow text-accent">
                    {KIND_LABEL[story.kind] || "Story"}
                    {story.grad_year ? ` · Class of ${story.grad_year}` : ""}
                  </p>
                  <h2 className="display mt-2 text-2xl leading-tight">{story.title}</h2>
                  {story.person ? (
                    <p className="mt-1 text-sm font-medium text-foreground/70">{story.person}</p>
                  ) : null}
                  {story.summary ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{story.summary}</p>
                  ) : null}
                  {story.body ? (
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {story.body}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyBlock>
              No stories published yet. Championships, alumni spotlights and community projects will
              appear here.
            </EmptyBlock>
          </div>
        )}
      </div>
    </div>
  );
}