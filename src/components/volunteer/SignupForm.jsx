import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { INPUT, LABEL, BTN } from "@/lib/styles";

export default function SignupForm({ opportunity, onDone }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await base44.entities.VolunteerSignup.create({
        ...form,
        opportunity: opportunity.id,
        opportunity_title: opportunity.title,
      });
      setDone(true);
      onDone?.();
    } catch {
      setError("We couldn't save your sign-up. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="mt-4 border border-accent/40 bg-accent/10 px-4 py-4 text-sm text-foreground">
        <p className="font-semibold">You're on the list for {opportunity.title}.</p>
        <p className="mt-1 text-muted-foreground">
          A volunteer coordinator will follow up by email with details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 border border-border bg-background p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="vol-name">Name</label>
          <input id="vol-name" required className={INPUT} value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className={LABEL} htmlFor="vol-email">Email</label>
          <input
            id="vol-email"
            type="email"
            required
            className={INPUT}
            value={form.email}
            onChange={set("email")}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="vol-phone">Phone (optional)</label>
          <input id="vol-phone" className={INPUT} value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <label className={LABEL} htmlFor="vol-notes">Notes (optional)</label>
          <input id="vol-notes" className={INPUT} value={form.notes} onChange={set("notes")} />
        </div>
      </div>

      {error ? <p className="mt-3 text-xs font-medium text-accent">{error}</p> : null}

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={saving} className={BTN.primary}>
          {saving ? "Saving…" : "Confirm sign-up"}
        </button>
        <button type="button" onClick={() => onDone?.()} className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-accent">
          Cancel
        </button>
      </div>
    </form>
  );
}