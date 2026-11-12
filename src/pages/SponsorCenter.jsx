import { Image } from "@/components/ui/image";
import PageHeader from "@/components/site/PageHeader";
import { LoadingBlock } from "@/components/site/Loading";
import SponsorInquiryForm from "@/components/sponsors/SponsorInquiryForm";
import { useSiteData } from "@/hooks/useSiteData";
import { CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

const LEVELS = [
  { key: "platinum", label: "Platinum partners" },
  { key: "gold", label: "Gold partners" },
  { key: "silver", label: "Silver partners" },
  { key: "community", label: "Community partners" },
];

const PACKAGES = [
  {
    name: "Team sponsor",
    price: "$2,500",
    note: "Your business name becomes the team name across the entire site.",
    items: ["Team name on every page", "Logo on the team hub", "Banner at home games"],
  },
  {
    name: "Program partner",
    price: "$5,000",
    note: "Front-and-center recognition for families all season.",
    items: ["Everything in Team sponsor", "Hero placement on the homepage", "Two social recognitions"],
  },
  {
    name: "Community supporter",
    price: "$500",
    note: "Perfect for local businesses that want to back the program.",
    items: ["Logo on the sponsor wall", "Listing in the sponsor directory", "Season thank-you post"],
  },
];

export default function SponsorCenter() {
  const { sponsors, loading } = useSiteData();
  const active = sponsors.filter((s) => s.active !== false);

  return (
    <>
      <PageHeader
        eyebrow="Sponsor center"
        title="The businesses behind the program"
        intro="Sponsorships keep registration affordable for every family. Here's who is backing us this season, and how your business can join them."
      />

      {loading ? (
        <LoadingBlock label="Loading sponsors" />
      ) : (
        <div className="shell space-y-12 py-10">
          {LEVELS.map((level) => {
            const list = active.filter((s) => (s.level || "community") === level.key);
            if (!list.length) return null;
            return (
              <div key={level.key}>
                <div className="border-t border-border pt-5">
                  <p className="eyebrow text-accent">{level.label}</p>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <div key={s.id} className={cn(CARD, "flex flex-col p-5")}>
                      {s.logo ? (
                        <Image
                          src={s.logo}
                          alt={s.name}
                          fittingType="fit"
                          className="mb-4 h-14 w-32 object-contain"
                        />
                      ) : (
                        <p className="display text-lg leading-tight">{s.name}</p>
                      )}
                      {s.blurb ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
                      ) : null}
                      {s.website ? (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent hover:underline"
                        >
                          Visit website →
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div>
            <div className="border-t border-border pt-5">
              <p className="eyebrow text-accent">Sponsor packages</p>
              <h2 className="display mt-2 text-2xl sm:text-3xl">Put your business on the field</h2>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {PACKAGES.map((pkg) => (
                <div key={pkg.name} className={cn(CARD, "flex flex-col p-5")}>
                  <p className="eyebrow text-muted-foreground">{pkg.name}</p>
                  <p className="num mt-2 text-3xl font-semibold">{pkg.price}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pkg.note}</p>
                  <ul className="mt-4 space-y-2 border-t border-border/70 pt-4 text-sm text-foreground/75">
                    {pkg.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div id="become-a-sponsor">
            <div className="border-t border-border pt-5">
              <p className="eyebrow text-accent">Become a sponsor</p>
              <h2 className="display mt-2 text-2xl sm:text-3xl">Tell us about your business</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Send this over and a board member will follow up with the full sponsor packet.
              </p>
            </div>
            <div className="mt-4 max-w-2xl">
              <SponsorInquiryForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}