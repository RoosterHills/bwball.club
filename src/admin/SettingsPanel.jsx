import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import EntityForm from "@/admin/EntityForm";
import { logAudit } from "@/lib/audit";

const rows = (res) => (Array.isArray(res) ? res : res?.items ?? []);

// Single-record settings panel — organization details or site-wide website content.
export default function SettingsPanel({ entity, fields, intro, savedMessage = "Saved" }) {
  const { toast } = useToast();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities[entity].list("-created_date", 1);
        setRecord(rows(res)[0] || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [entity]);

  const save = async (values) => {
    setError("");
    setSaving(true);
    try {
      const saved = record?.id
        ? await base44.entities[entity].update(record.id, values)
        : await base44.entities[entity].create(values);
      setRecord(saved || values);
      logAudit({
        action: record?.id ? "Updated" : "Created",
        entity,
        label: values.site_name || values.name || entity,
      });
      toast({ title: savedMessage });
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center border border-border bg-card py-16">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  return (
    <div className="border border-border bg-card p-5 sm:p-6">
      {intro ? <p className="mb-5 max-w-2xl text-xs leading-relaxed text-muted-foreground">{intro}</p> : null}
      <EntityForm
        key={record?.id || "new"}
        fields={fields}
        record={record}
        onSubmit={save}
        onCancel={() => window.location.reload()}
        saving={saving}
        error={error}
      />
    </div>
  );
}