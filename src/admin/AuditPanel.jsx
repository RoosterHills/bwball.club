import { useCollection } from "@/hooks/useSiteData";
import { EmptyBlock } from "@/components/site/Loading";

const when = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

export default function AuditPanel() {
  const { items, loading } = useCollection("AuditLog", "-created_date");

  if (loading) {
    return (
      <div className="flex items-center justify-center border border-border bg-card py-16">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!items.length) {
    return <EmptyBlock>No changes recorded yet. Every save and delete in this dashboard lands here.</EmptyBlock>;
  }

  return (
    <>
      <ul className="space-y-2 sm:hidden">
        {items.map((entry) => (
          <li key={entry.id} className="border border-border bg-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold">{entry.action}</span>
              <span className="eyebrow shrink-0 text-muted-foreground/60">
                {entry.entity_name || "—"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{entry.record_label || "—"}</p>
            <p className="mt-2 text-[11px] text-muted-foreground/70">
              {when(entry.created_date)}
              {entry.actor_email ? ` · ${entry.actor_email}` : ""}
            </p>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto border border-border bg-card sm:block">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left">
              <th className="eyebrow px-4 py-3 text-muted-foreground">When</th>
              <th className="eyebrow px-4 py-3 text-muted-foreground">Action</th>
              <th className="eyebrow px-4 py-3 text-muted-foreground">Area</th>
              <th className="eyebrow px-4 py-3 text-muted-foreground">What</th>
              <th className="eyebrow px-4 py-3 text-muted-foreground">Who</th>
            </tr>
          </thead>
          <tbody>
            {items.map((entry) => (
              <tr key={entry.id} className="border-b border-border/70 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{when(entry.created_date)}</td>
                <td className="px-4 py-3 font-medium">{entry.action}</td>
                <td className="px-4 py-3 text-muted-foreground">{entry.entity_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{entry.record_label || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{entry.actor_email || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}