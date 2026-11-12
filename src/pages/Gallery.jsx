import { useMemo, useState } from "react";
import { Image } from "@/components/ui/image";
import { useCollection } from "@/hooks/useSiteData";
import { EmptyBlock, LoadingBlock } from "@/components/site/Loading";

const CATEGORY_LABEL = {
  team_photo: "Team photos",
  championship: "Championships",
  community_service: "Community service",
  fundraiser: "Fundraisers",
  practice: "Practices",
  celebration: "Celebrations",
  tradition: "Traditions",
  alumni: "Alumni",
  gallery: "Galleries",
  banner: "Highlights",
  general: "Moments",
};

export default function Gallery() {
  const { items, loading } = useCollection("MediaAsset", "sort_order");
  const [filter, setFilter] = useState("all");

  const photos = useMemo(
    () =>
      items.filter(
        (asset) =>
          !asset.archived &&
          (!asset.privacy || asset.privacy === "public") &&
          asset.image
      ),
    [items]
  );

  const categories = useMemo(() => {
    const seen = new Set(photos.map((p) => p.category).filter(Boolean));
    return Array.from(seen);
  }, [photos]);

  const shown = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="shell py-10 sm:py-14">
          <p className="eyebrow text-accent">Public highlights</p>
          <h1 className="display mt-3 text-4xl leading-[0.95] sm:text-5xl">
            Our seasons, in pictures
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Championships, tournament wins, practices, community service days, fundraisers and the
            traditions that hold this program together. Everything here is shared by the
            organization for the whole community — team galleries and family information stay behind
            a member login.
          </p>
        </div>
      </div>

      <div className="shell py-8 sm:py-10">
        {categories.length > 1 ? (
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
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={
                  filter === category
                    ? "border border-primary bg-primary px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                    : "border border-border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 hover:border-accent hover:text-accent"
                }
              >
                {CATEGORY_LABEL[category] || category}
              </button>
            ))}
          </div>
        ) : null}

        {loading ? (
          <LoadingBlock label="Loading gallery" />
        ) : shown.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((asset) => (
              <figure key={asset.id} className="lift overflow-hidden border border-border bg-card">
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <Image
                    src={asset.image}
                    alt={asset.title}
                    fittingType="fill"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="p-4">
                  <p className="text-sm font-semibold leading-tight">{asset.title}</p>
                  {asset.caption ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{asset.caption}</p>
                  ) : null}
                  {asset.gallery ? (
                    <p className="eyebrow mt-2 text-muted-foreground/70">{asset.gallery}</p>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyBlock>
              No public photos in this view yet. Check back after the next game day.
            </EmptyBlock>
          </div>
        )}
      </div>
    </div>
  );
}