import { Image } from "@/components/ui/image";
import { EmptyBlock } from "@/components/site/Loading";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { OPTION_LABEL } from "@/admin/collections";

const formatCell = (value, col) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === null || value === undefined || value === "") return "—";
  if (col.type === "date" || col.key.endsWith("_date")) return fmtDate(value);
  if (col.key === "start") return String(value).replace("T", " · ");
  if (String(value).startsWith("http")) return String(value).replace(/^https?:\/\//, "").slice(0, 34);
  if (["level", "category", "status", "priority", "type", "visibility"].includes(col.key))
    return OPTION_LABEL(value);
  const str = String(value);
  return str.length > 46 ? `${str.slice(0, 46)}…` : str;
};

export default function EntityTable({ collection, items, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center border border-border bg-card py-16">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!items.length) {
    return <EmptyBlock>Nothing here yet. Use the button above to add the first entry.</EmptyBlock>;
  }

  return (
    <div className="overflow-x-auto border border-border bg-card">
      <table className="w-full min-w-[620px] text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50 text-left">
            {collection.columns.map((col) => (
              <th key={col.key} className="eyebrow whitespace-nowrap px-4 py-3 text-muted-foreground">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border/70 last:border-0">
              {collection.columns.map((col, index) => (
                <td key={col.key} className="px-4 py-3 align-middle">
                  {col.type === "image" ? (
                    item[col.key] ? (
                      <Image
                        src={item[col.key]}
                        alt=""
                        fittingType="fill"
                        className="h-10 w-14 rounded-[3px] object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )
                  ) : col.type === "bool" ? (
                    <span
                      className={cn(
                        "inline-block h-2 w-2 rounded-full",
                        item[col.key] === false ? "bg-border" : "bg-accent"
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        "whitespace-nowrap",
                        index === 0 ? "font-medium text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {formatCell(item[col.key], col)}
                    </span>
                  )}
                </td>
              ))}
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70 hover:text-accent"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="ml-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent/70 hover:text-accent"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}