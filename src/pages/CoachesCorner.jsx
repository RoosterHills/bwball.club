import { Lock } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { EmptyBlock, LoadingBlock } from "@/components/site/Loading";
import { useCollection } from "@/hooks/useSiteData";
import { CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function CoachesCorner() {
  const { items, loading } = useCollection("Resource", "sort_order");
  const staff = items.filter((r) => r.visibility === "coaches");

  return (
    <>
      <PageHeader
        eyebrow="Coaches corner"
        title="Staff room"
        intro="Practice plans, tournament packets, roster downloads, and internal documents for coaches and board members."
      />

      <div className="shell py-10">
        <div className={cn(CARD, "flex items-start gap-3 border-accent/25 bg-accent/[0.04] p-4")}>
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
          <p className="text-xs leading-relaxed text-foreground/70">
            These documents are marked staff-only in the admin dashboard. The site is currently
            public, so anything you upload here is reachable by anyone with the link to this page.
            Ask about adding coach logins if these files need to stay private.
          </p>
        </div>

        {loading ? (
          <LoadingBlock label="Loading staff documents" />
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {staff.length ? (
              staff.map((r) => (
                <div key={r.id} className={cn(CARD, "p-5")}>
                  <p className="text-sm font-semibold leading-snug">{r.title}</p>
                  {r.description ? (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {r.description}
                    </p>
                  ) : null}
                  {r.file_url || r.link_url ? (
                    <a
                      href={r.file_url || r.link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.14em] text-accent hover:underline"
                    >
                      {r.file_url ? "Download →" : "Open link →"}
                    </a>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyBlock>
                  No staff documents yet. Add them from Admin → Resources and set visibility to
                  Coaches only.
                </EmptyBlock>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}