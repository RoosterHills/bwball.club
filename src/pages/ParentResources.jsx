import { ChevronDown, Download, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import PageHeader from "@/components/site/PageHeader";
import { LoadingBlock } from "@/components/site/Loading";
import { useCollection } from "@/hooks/useSiteData";
import { CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "uniforms", label: "Uniforms & equipment" },
  { key: "policies", label: "Policies & expectations" },
  { key: "travel", label: "Travel" },
  { key: "handbook", label: "Organization handbook" },
  { key: "forms", label: "Forms" },
  { key: "general", label: "General" },
];

const FAQ = [
  {
    q: "What should my player bring to practice?",
    a: "Cleats or turfs, a glove, batting gloves if they use them, a water bottle, and full practice gear. Catchers bring their own gear when scheduled.",
  },
  {
    q: "How early should we arrive for a game?",
    a: "Players should be at the field 45 minutes before first pitch for warm-ups. Arrive earlier for tournament games with a coaches meeting.",
  },
  {
    q: "What happens when it rains?",
    a: "Practices are cancelled or moved indoors by the head coach. Game decisions are made at the field by the umpires. Check the news feed before you leave home — cancellations are posted there first.",
  },
  {
    q: "Are uniforms included in registration?",
    a: "Season registration includes the jersey and hat. Pants, belt, and socks are purchased separately in the team store unless your team specifies otherwise.",
  },
  {
    q: "Can siblings and grandparents come to games?",
    a: "Always. There is no gate fee for regular season games. Tournament hosts may charge admission, which is noted on the tournament announcement.",
  },
  {
    q: "Who do I contact about a schedule conflict?",
    a: "Message your head coach first. Their contact is listed on your team hub under Contact Coaches.",
  },
];

function FaqRow({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/70 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-semibold">{item.q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
      ) : null}
    </div>
  );
}

function ResourceCard({ resource }) {
  const href = resource.file_url || resource.link_url;
  const body = (
    <>
      <div className="flex items-start gap-3">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug">{resource.title}</p>
          {resource.description ? (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {resource.description}
            </p>
          ) : null}
        </div>
      </div>
      {href ? (
        <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
          {resource.file_url ? <Download className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
          {resource.file_url ? "Download" : "Open link"}
        </span>
      ) : null}
    </>
  );

  const cls = cn(CARD, "block p-4", href && "transition-colors hover:border-accent/50");

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default function ParentResources() {
  const { items, loading } = useCollection("Resource", "sort_order");
  const publicItems = items.filter((r) => r.visibility !== "coaches");

  return (
    <>
      <PageHeader
        eyebrow="Parent resource center"
        title="Answers, documents, and expectations"
        intro="Uniforms, travel, rainouts, handbooks, and the questions every new family asks in week one."
      />

      {loading ? (
        <LoadingBlock label="Loading resources" />
      ) : (
        <div className="shell space-y-12 py-10">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="display text-2xl">Quick answers</h2>
              <div className="mt-3 border border-border bg-card px-5">
                {FAQ.map((item) => (
                  <FaqRow key={item.q} item={item} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="display text-2xl">Contact</h2>
              <div className={cn(CARD, "mt-3 p-5 text-sm leading-relaxed text-muted-foreground")}>
                <p className="font-semibold text-foreground">Big Walnut Baseball</p>
                <p className="mt-2">
                  Email{" "}
                  <a href="mailto:info@bwball.club" className="text-accent hover:underline">
                    info@bwball.club
                  </a>{" "}
                  for anything that isn't answered here, or reach your head coach from the team hub.
                </p>
                <p className="mt-3 text-xs">
                  Coaches, staff documents live in the{" "}
                  <a href="/coaches" className="text-accent hover:underline">
                    coaches corner
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {CATEGORIES.map((cat) => {
            const list = publicItems.filter((r) => (r.category || "general") === cat.key);
            if (!list.length) return null;
            return (
              <div key={cat.key}>
                <div className="border-t border-border pt-5">
                  <h2 className="display text-xl">{cat.label}</h2>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((r) => (
                    <ResourceCard key={r.id} resource={r} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}