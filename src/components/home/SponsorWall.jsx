import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

const LEVEL_LABEL = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  community: "Community",
};

export default function SponsorWall({ sponsors = [] }) {
  const active = sponsors.filter((s) => s.active !== false);
  if (!active.length) return null;

  return (
    <section className="border-y border-border bg-card">
      <div className="shell py-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-accent">Thank you</p>
            <h2 className="display mt-2 text-2xl sm:text-3xl">Our program sponsors</h2>
          </div>
          <Link
            to="/sponsors"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:underline"
          >
            Become a sponsor →
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {active.map((sponsor) => {
            const content = (
              <div className="flex h-24 items-center justify-center border border-border bg-background px-4 text-center transition-colors hover:border-accent/40">
                {sponsor.logo ? (
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fittingType="fit"
                    className="h-12 w-full object-contain"
                  />
                ) : (
                  <div>
                    <p className="text-sm font-semibold leading-tight">{sponsor.name}</p>
                    <p className="eyebrow mt-1.5 text-muted-foreground/70">
                      {LEVEL_LABEL[sponsor.level] || "Sponsor"}
                    </p>
                  </div>
                )}
              </div>
            );
            return sponsor.website ? (
              <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer">
                {content}
              </a>
            ) : (
              <div key={sponsor.id}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}