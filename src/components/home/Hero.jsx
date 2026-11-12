import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MEDIA } from "@/lib/media";
import { recordLine, sponsorFor } from "@/lib/selectors";
import { fmtDate, fmtTime } from "@/lib/format";

function TeamHubButton({ team, sponsors, nextEvent, delay }) {
  const sponsor = sponsorFor(team, sponsors);
  return (
    <Link
      to={`/teams/${team.id}`}
      className="rise group flex items-center justify-between gap-4 border border-primary-foreground/15 bg-primary-foreground/[0.04] px-5 py-4 transition-colors hover:border-accent/60 hover:bg-primary-foreground/[0.08]"
      style={{ "--rise-delay": delay }}
    >
      <div className="min-w-0">
        <p className="eyebrow text-accent">{team.age_group} Team Hub</p>
        <p className="mt-1.5 truncate text-base font-semibold">
          {sponsor?.name ? `${sponsor.name} ` : ""}
          {team.name}
        </p>
        <p className="mt-1 truncate text-[11px] text-primary-foreground/50">
          {nextEvent
            ? `Next: ${fmtDate(nextEvent.start)} · ${fmtTime(nextEvent.start)}`
            : "Schedule coming soon"}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <span className="num block text-lg font-semibold">{recordLine(team)}</span>
        <ArrowRight className="ml-auto mt-1 h-4 w-4 text-primary-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
      </div>
    </Link>
  );
}

export default function Hero({ teams = [], sponsors = [], nextEventFor, heroImage }) {
  const hero = heroImage || MEDIA.hero;

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 stitch" aria-hidden="true" />
      {hero ? (
        <img
          src={hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          aria-hidden="true"
        />
      ) : null}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/55"
        aria-hidden="true"
      />

      <div className="shell relative pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow rise text-accent">Sunbury, Ohio · Youth Baseball</p>
            <h1 className="display mt-4 text-[13vw] leading-[0.84] sm:text-[4.6rem] lg:text-[5.6rem]">
              <span className="rise block" style={{ "--rise-delay": "60ms" }}>
                BIG WALNUT
              </span>
              <span className="rise block text-accent" style={{ "--rise-delay": "140ms" }}>
                BASEBALL
              </span>
            </h1>
            <p
              className="rise mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/65 sm:text-[15px]"
              style={{ "--rise-delay": "220ms" }}
            >
              The home for our players, coaches, families, and community — schedules, scores,
              sign-ups, and answers, all in one place.
            </p>
          </div>

          <div className="grid gap-2.5">
            {teams.length ? (
              teams.map((team, i) => (
                <TeamHubButton
                  key={team.id}
                  team={team}
                  sponsors={sponsors}
                  nextEvent={nextEventFor ? nextEventFor(team.id) : null}
                  delay={`${280 + i * 80}ms`}
                />
              ))
            ) : (
              <p className="border border-primary-foreground/15 px-5 py-4 text-sm text-primary-foreground/50">
                Team hubs are being set up.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}