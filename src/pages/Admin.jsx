import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useCollection } from "@/hooks/useSiteData";
import { COLLECTIONS, SITE_FIELDS, ORG_FIELDS } from "@/admin/collections";
import EntityTable from "@/admin/EntityTable";
import EntityForm from "@/admin/EntityForm";
import SettingsPanel from "@/admin/SettingsPanel";
import UsersPanel from "@/admin/UsersPanel";
import AuditPanel from "@/admin/AuditPanel";
import ArchivedPanel from "@/admin/ArchivedPanel";
import IntegrationsPanel from "@/admin/IntegrationsPanel";
import { logAudit } from "@/lib/audit";
import { BTN } from "@/lib/styles";
import { cn } from "@/lib/utils";

const PANEL_SECTIONS = [
  { key: "org", label: "Organization settings", group: "Website" },
  { key: "website", label: "Website & homepage", group: "Website" },
  { key: "users", label: "Users & roles", group: "People" },
  { key: "integrations", label: "Integrations", group: "System" },
  { key: "archive", label: "Archived content", group: "System" },
  { key: "audit", label: "Audit log", group: "System" },
];

const GROUP_OF = {
  teams: "Program",
  brands: "Program",
  sports: "Program",
  seasons: "Program",
  sponsors: "Program",
  events: "Season ops",
  announcements: "Season ops",
  registrations: "Season ops",
  volunteer: "Season ops",
  signups: "Season ops",
  resources: "Season ops",
  inquiries: "Season ops",
  media: "Media",
  nav: "Website",
};

const GROUP_ORDER = ["Program", "Season ops", "Media", "Website", "People", "System"];

const SECTIONS = [
  ...COLLECTIONS.map((c) => ({
    key: c.key,
    label: c.label,
    type: "collection",
    group: GROUP_OF[c.key] || "Program",
  })),
  ...PANEL_SECTIONS.map((p) => ({ ...p, type: "panel" })),
];

const labelFor = (collection, values) =>
  values.name ||
  values.title ||
  values.label ||
  values.brand_name ||
  values.company ||
  values.email ||
  collection.entity;

export default function Admin() {
  const { toast } = useToast();
  const [sectionKey, setSectionKey] = useState("teams");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const section = SECTIONS.find((s) => s.key === sectionKey) || SECTIONS[0];
  const collection =
    section.type === "collection" ? COLLECTIONS.find((c) => c.key === section.key) : null;

  const { items, loading, reload } = useCollection(
    collection?.entity || "Sport",
    collection?.sort || "sort_order"
  );
  const { items: teamList } = useCollection("Team", "sort_order");
  const { items: sponsorList } = useCollection("Sponsor", "name");
  const { items: seasonList } = useCollection("Season", "-created_date");
  const { items: sportList } = useCollection("Sport", "sort_order");
  const { items: brandList } = useCollection("TeamBrand", "brand_name");

  const lookups = {
    teams: teamList.map((t) => ({
      value: t.id,
      label: [t.name, t.age_group].filter(Boolean).join(" "),
    })),
    sponsors: sponsorList.map((s) => ({ value: s.id, label: s.name })),
    seasons: seasonList.map((s) => ({ value: s.id, label: s.name })),
    sports: sportList.map((s) => ({ value: s.id, label: s.name })),
    brands: brandList.map((b) => ({
      value: b.id,
      label: b.display_name ? `${b.brand_name} — ${b.display_name}` : b.brand_name,
    })),
  };

  const openSection = (key) => {
    setSectionKey(key);
    setEditing(null);
    setFormError("");
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
      logAudit({
        action: editing?.id ? "Updated" : "Created",
        entity: collection.entity,
        label: labelFor(collection, values),
      });
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
      logAudit({ action: "Deleted", entity: collection.entity, label: labelFor(collection, item) });
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
            <p className="eyebrow text-accent">Super admin</p>
            <h1 className="display mt-2 text-3xl sm:text-4xl">Program control room</h1>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
              Everything visitors see is edited here — teams, brands, sponsors, schedules, news,
              registrations, documents, media, navigation, and site copy.
            </p>
          </div>
          <Link to="/" className={BTN.ghost}>
            View site
          </Link>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[215px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:gap-5 lg:overflow-visible lg:pb-0">
              {GROUP_ORDER.map((group) => {
                const list = SECTIONS.filter((s) => s.group === group);
                if (!list.length) return null;
                return (
                  <div key={group} className="shrink-0">
                    <p className="eyebrow hidden px-2 text-muted-foreground/60 lg:block">{group}</p>
                    <div className="flex gap-1.5 lg:mt-2 lg:flex-col lg:gap-0.5">
                      {list.map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => openSection(s.key)}
                          className={cn(
                            "whitespace-nowrap rounded-[3px] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors lg:w-full",
                            sectionKey === s.key
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/60 hover:bg-card hover:text-accent"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="display text-2xl">{section.label}</h2>
                {collection ? (
                  <p className="text-xs text-muted-foreground">
                    {loading
                      ? "Loading…"
                      : `${items.length} ${items.length === 1 ? "entry" : "entries"}`}
                  </p>
                ) : null}
              </div>
              {collection ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditing({});
                    setFormError("");
                  }}
                  className={BTN.accent}
                >
                  <Plus className="h-3.5 w-3.5" /> New{" "}
                  {section.label.replace(/s$/, "").toLowerCase()}
                </button>
              ) : null}
            </div>

            {section.type === "panel" ? (
              section.key === "org" ? (
                <SettingsPanel
                  entity="Organization"
                  fields={ORG_FIELDS}
                  intro="These details power the organization identity, contact block, and hero photo across the site."
                  savedMessage="Organization updated"
                />
              ) : section.key === "website" ? (
                <SettingsPanel
                  entity="SiteSettings"
                  fields={SITE_FIELDS}
                  intro="Homepage title and intro, buttons, section headings, footer copy, contact details, and organization-wide GameChanger and livestream links."
                  savedMessage="Website content updated"
                />
              ) : section.key === "users" ? (
                <UsersPanel />
              ) : section.key === "audit" ? (
                <AuditPanel />
              ) : section.key === "archive" ? (
                <ArchivedPanel onRestored={reload} />
              ) : (
                <IntegrationsPanel onEditTeams={() => openSection("teams")} />
              )
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {editing && collection ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/40" onClick={closeForm}>
          <div
            className="h-full w-full max-w-xl overflow-y-auto border-l border-border bg-background p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-accent">
                  {editing.id ? "Edit" : "New"} {section.label.replace(/s$/, "").toLowerCase()}
                </p>
                <h2 className="display mt-2 text-2xl">
                  {editing.id ? "Update details" : "Add entry"}
                </h2>
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