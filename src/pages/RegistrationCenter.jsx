import PageHeader from "@/components/site/PageHeader";
import { EmptyBlock, LoadingBlock } from "@/components/site/Loading";
import { useCollection } from "@/hooks/useSiteData";
import { fmtDate, fmtMoney } from "@/lib/format";
import { BTN, CARD, CHIP } from "@/lib/styles";
import { cn } from "@/lib/utils";

const LABEL = {
  tryout: "Tryout",
  camp: "Camp",
  clinic: "Clinic",
  season: "Season",
  tournament: "Tournament",
};

function RegistrationCard({ item }) {
  const open = item.status === "open";
  return (
    <div className={cn(CARD, "flex flex-col p-5")}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            CHIP,
            open
              ? "border-accent/40 bg-accent/10 text-foreground"
              : "border-border bg-secondary text-muted-foreground"
          )}
        >
          {open ? "Open" : "Closed"}
        </span>
        <span className="eyebrow text-muted-foreground">{LABEL[item.category] || "Program"}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">{item.title}</h3>
      {item.description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      ) : null}

      <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/70 pt-3 text-xs">
        {item.event_date ? (
          <div>
            <dt className="eyebrow text-muted-foreground/70">Date</dt>
            <dd className="num mt-1 font-semibold">{fmtDate(item.event_date)}</dd>
          </div>
        ) : null}
        <div>
          <dt className="eyebrow text-muted-foreground/70">Cost</dt>
          <dd className="num mt-1 font-semibold">{fmtMoney(item.cost) || "TBD"}</dd>
        </div>
      </dl>

      <div className="mt-auto pt-4">
        {open && item.link ? (
          <a href={item.link} target="_blank" rel="noreferrer" className={BTN.accent}>
            Register →
          </a>
        ) : open ? (
          <p className="text-xs text-muted-foreground">
            Registration link coming soon — contact a coach to be added.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">This registration window has closed.</p>
        )}
      </div>
    </div>
  );
}

export default function RegistrationCenter() {
  const { items, loading } = useCollection("Registration", "event_date");
  const open = items.filter((i) => i.status === "open");
  const closed = items.filter((i) => i.status !== "open");

  return (
    <>
      <PageHeader
        eyebrow="Registration center"
        title="Sign up for what's next"
        intro="Tryouts, camps, clinics, season registration, and tournaments — all in one place."
      />

      {loading ? (
        <LoadingBlock label="Loading registrations" />
      ) : (
        <div className="shell space-y-10 py-10">
          <div>
            <h2 className="display text-2xl">Open now</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {open.length ? (
                open.map((item) => <RegistrationCard key={item.id} item={item} />)
              ) : (
                <div className="sm:col-span-2 lg:col-span-3">
                  <EmptyBlock>
                    No open registrations right now. New windows are announced on the news feed.
                  </EmptyBlock>
                </div>
              )}
            </div>
          </div>

          {closed.length ? (
            <div>
              <h2 className="display text-2xl">Closed</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {closed.map((item) => (
                  <RegistrationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}