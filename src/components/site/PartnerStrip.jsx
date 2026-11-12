import { Image } from "@/components/ui/image";
import { useCollection } from "@/hooks/useSiteData";

export default function PartnerStrip({ title }) {
  const { items } = useCollection("Partner", "sort_order");
  const partners = items.filter((p) => p.active !== false);

  if (!partners.length) return null;

  return (
    <section className="border-y border-border bg-card">
      <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="eyebrow text-muted-foreground">{title || "Official partners"}</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {partners.map((partner) => {
            const content = (
              <>
                {partner.logo ? (
                  <span className="flex h-8 w-20 items-center">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fittingType="fit"
                      className="h-8 w-20 object-contain"
                    />
                  </span>
                ) : null}
                <span>
                  <span className="block text-sm font-semibold leading-tight">{partner.name}</span>
                  {partner.role_label ? (
                    <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {partner.role_label}
                    </span>
                  ) : null}
                </span>
              </>
            );

            return partner.website ? (
              <a
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100"
              >
                {content}
              </a>
            ) : (
              <div key={partner.id} className="flex items-center gap-3 opacity-80">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}