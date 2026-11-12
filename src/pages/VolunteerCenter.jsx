import { useState } from "react";
import PageHeader from "@/components/site/PageHeader";
import { EmptyBlock, LoadingBlock } from "@/components/site/Loading";
import SignupForm from "@/components/volunteer/SignupForm";
import { useCollection } from "@/hooks/useSiteData";
import { fmtDate } from "@/lib/format";
import { BTN, CARD, CHIP } from "@/lib/styles";
import { cn } from "@/lib/utils";

const CATEGORY = {
  concessions: "Concessions",
  field_prep: "Field prep",
  scorekeeping: "Scorekeeping",
  fundraising: "Fundraising",
  event: "Special event",
};

function Opportunity({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(CARD, "p-5")}>
      <div className="flex items-center justify-between gap-3">
        <span className={cn(CHIP, "border-border bg-secondary text-foreground/60")}>
          {CATEGORY[item.category] || "Volunteer"}
        </span>
        {item.date ? (
          <span className="num text-[11px] text-muted-foreground">{fmtDate(item.date)}</span>
        ) : null}
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">{item.title}</h3>
      {item.description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      ) : null}

      {item.spots ? (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="num font-semibold text-foreground/70">{item.spots}</span> spots needed
        </p>
      ) : null}

      <div className="mt-4">
        {open ? (
          <SignupForm opportunity={item} onDone={() => setOpen(false)} />
        ) : (
          <button type="button" onClick={() => setOpen(true)} className={BTN.primary}>
            Sign up
          </button>
        )}
      </div>
    </div>
  );
}

export default function VolunteerCenter() {
  const { items, loading } = useCollection("VolunteerOpportunity", "date");
  const open = items.filter((i) => i.status === "open");
  const closed = items.filter((i) => i.status !== "open");

  return (
    <>
      <PageHeader
        eyebrow="Volunteer center"
        title="The program runs on parents"
        intro="Concessions, field prep, scorekeeping, fundraising, and event help — pick a slot and we'll take it from there."
      />

      {loading ? (
        <LoadingBlock label="Loading opportunities" />
      ) : (
        <div className="shell space-y-10 py-10">
          <div>
            <h2 className="display text-2xl">Open opportunities</h2>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              {open.length ? (
                open.map((item) => <Opportunity key={item.id} item={item} />)
              ) : (
                <div className="lg:col-span-2">
                  <EmptyBlock>No open shifts right now — check back soon.</EmptyBlock>
                </div>
              )}
            </div>
          </div>

          {closed.length ? (
            <div>
              <h2 className="display text-2xl">Filled or closed</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {closed.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 border border-border bg-card px-4 py-3.5"
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="eyebrow text-muted-foreground">
                      {item.status === "filled" ? "Filled" : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}