import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useCollection } from "@/hooks/useSiteData";
import { COLLECTIONS } from "@/admin/collections";
import EntityTable from "@/admin/EntityTable";
import EntityForm from "@/admin/EntityForm";
import OrganizationPanel from "@/admin/OrganizationPanel";
import { BTN } from "@/lib/styles";
import { cn } from "@/lib/utils";

const TABS = [{ key: "organization", label: "Organization" }, ...COLLECTIONS.map((c) => ({ key: c.key, label: c.label }))];

export default function Admin() {
  const { toast } = useToast();
  const [tab, setTab] = useState("teams");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const collection = COLLECTIONS.find((c) => c.key === tab) || COLLECTIONS[0];
  const { items, loading, reload } = useCollection(collection.entity, collection.sort);
  const { items: teamList } = useCollection("Team", "sort_order");
  const { items: sponsorList } = useCollection("Sponsor", "name");

  const lookups = {
    teams: teamList.map((t) => ({
      value: t.id,
      label: [t.name, t.age_group].filter(Boolean).join(" "),
    })),
    sponsors: sponsorList.map((s) => ({ value: s.id, label: s.name })),
  };

  const closeForm = () => {
    setEditing(null);
    setFormError("");
  };

  const save = async (values) => {
    setFormError("");
    setSaving(true);
    try {
      if (editing?.id) await base44.entities[collection.entity].update(editing.id, values);
      else await base44.entities[collection.entity].create(values);
      closeForm();
      await reload();
      toast({ title: `${collection.label} saved` });
    } catch {
      setFormError("Could not save. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm("Delete this entry? This can't be undone.")) return;
    try {
      await base44.entities[collection.entity].delete(item.id);
      await reload();
      toast({ title: "Deleted" });
    } catch {
      toast({ title: "Could not delete", description: "Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="shell py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">Admin dashboard</p>
            <h1 className="display mt-2 text-3xl sm:text-4xl">Program control room</h1>
          </div>
          <Link to="/" className={BTN.ghost}>
            View site
          </Link>
        </div>

        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Everything on the site is edited here — teams, sponsors, events, news, registrations,
          volunteers, and documents. Currently anyone who has this link can edit, so add a login
          before sharing the site publicly.
        </p>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                closeForm();
              }}
              className={cn(
                "shrink-0 rounded-[3px] border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                tab === t.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/60 hover:border-accent hover:text-accent"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "organization" ? (
            <OrganizationPanel />
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  {loading ? "Loading…" : `${items.length} ${items.length === 1 ? "entry" : "entries"}`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditing({});
                    setFormError("");
                  }}
                  className={BTN.accent}
                >
                  <Plus className="h-3.5 w-3.5" /> New {collection.label.replace(/s$/, "").toLowerCase()}
                </button>
              </div>

              <EntityTable
                collection={collection}
                items={items}
                loading={loading}
                onEdit={(item) => {
                  setEditing(item);
                  setFormError("");
                }}
                onDelete={remove}
              />
            </>
          )}
        </div>
      </div>

      {editing && tab !== "organization" ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/40" onClick={closeForm}>
          <div
            className="h-full w-full max-w-xl overflow-y-auto border-l border-border bg-background p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-accent">
                  {editing.id ? "Edit" : "New"} {collection.label.replace(/s$/, "").toLowerCase()}
                </p>
                <h2 className="display mt-2 text-2xl">{editing.id ? "Update details" : "Add entry"}</h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-accent"
              >
                Close
              </button>
            </div>

            <div className="mt-6">
              <EntityForm
                key={editing.id || "new"}
                fields={collection.fields}
                record={editing.id ? editing : null}
                lookups={lookups}
                onSubmit={save}
                onCancel={closeForm}
                saving={saving}
                error={formError}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}