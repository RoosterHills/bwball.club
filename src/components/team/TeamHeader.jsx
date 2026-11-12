import { Image } from "@/components/ui/image";
import { recordLine, sponsorFor, teamDisplayName, winPct } from "@/lib/selectors";
import { brandBanner, brandLogo, usesLightText } from "@/lib/brand";

export default function TeamHeader({ team, sponsors = [], brand = null }) {
  const name = brand?.display_name || teamDisplayName(team, sponsors);
  const pct = winPct(team);
  const sponsor = sponsorFor(team, sponsors);
  const photo = team.photo || brandBanner(brand);
  const logo = brandLogo(brand);
  const light = usesLightText(brand);
  const faint = light ? "text-white/55" : "text-black/55";
  const strong = light ? "text-white" : "text-black";
  const hair = light ? "border-white/20" : "border-black/10";
  const plate = light ? "bg-white/10" : "bg-black/[0.06]";
  const showSponsor = sponsor && brand?.sponsor_treatment !== "none";
  const showSponsorLogo =
    brand?.sponsor_logo && (brand?.sponsor_treatment === "logo_only" || brand?.sponsor_treatment === "logo_and_text");

  return (
    <div className="brand-band border-b border-border">
      <div className="shell grid gap-8 py-8 sm:py-10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          {logo ? (
            <span className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-[4px] p-1.5 ${plate}`}>
              <Image src={logo} alt={`${name} logo`} fittingType="fit" className="h-full w-full object-contain" />
            </span>
          ) : null}

          <p className="eyebrow brand-accent-text mt-4">
            {[team.age_group, team.season].filter(Boolean).join(" · ")}
          </p>
          <h1 className="display mt-3 text-[2.4rem] leading-[0.95] sm:text-5xl">{name}</h1>
          {team.motto ? (
            <p className="brand-accent-text mt-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
              {team.motto}
            </p>
          ) : null}

          <div className={`mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs ${faint}`}>
            <span>
              Record <span className={`num ml-1 text-base font-semibold ${strong}`}>{recordLine(team)}</span>
            </span>
            {pct !== null ? (
              <span>
                Win rate{" "}
                <span className={`num ml-1 text-base font-semibold ${strong}`}>
                  {Math.round(pct * 100)}%
                </span>
              </span>
            ) : null}
            {team.head_coach ? (
              <span>
                Head coach <span className={`font-medium ${strong}`}>{team.head_coach}</span>
              </span>
            ) : null}
            {team.division ? <span>{team.division}</span> : null}
          </div>

          {showSponsor ? (
            <div className={`mt-6 flex flex-wrap items-center gap-3 border-t ${hair} pt-4`}>
              {showSponsorLogo ? (
                <span className="flex h-9 w-20 items-center">
                  <Image
                    src={brand.sponsor_logo}
                    alt={sponsor.name}
                    fittingType="fit"
                    className="h-9 w-20 object-contain"
                  />
                </span>
              ) : null}
              <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${faint}`}>
                Presented by <span className={`${strong}`}>{sponsor.name}</span>
              </p>
            </div>
          ) : null}
        </div>

        <div className={`relative aspect-[16/9] overflow-hidden border ${hair}`}>
          {photo ? (
            <Image src={photo} alt={name} fittingType="fill" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="display text-6xl opacity-15">{team.age_group}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}