import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import EntityForm from "@/admin/EntityForm";
import { ORG_FIELDS } from "@/admin/collections";

const rows = (res) => (Array.isArray(res) ? res : res?.items ?? []);

export default function OrganizationPanel() {
  const { toast } = useToast();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.Organization.list("-created_date", 1);
        setRecord(rows(res)[0] || null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async (values) => {
    setError("");
    setSaving(true);
    try {
      const saved = record?.id
        ? await base44.entities.Organization.update(record.id, values)
        : await base44.entities.Organization.create(values);
      setRecord(saved || values);
      toast({ title: "Organization updated" });
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
      <p className="mb-5 text-xs text-muted-foreground">
        These details power the hero, footer contact block, and organization identity across the site.
      </p>
      <EntityForm
        key={record?.id || "new"}
        fields={ORG_FIELDS}
        record={record}
        onSubmit={save}
        onCancel={() => window.location.reload()}
        saving={saving}
        error={error}
      />
    </div>
  );
}