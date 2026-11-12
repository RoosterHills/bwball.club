import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { BTN, INPUT, LABEL, CARD } from "@/lib/styles";

export default function SponsorInquiryForm() {
  const [form, setForm] = useState({ company: "", contact_name: "", email: "", phone: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await base44.entities.SponsorInquiry.create({ ...form, status: "new" });
      setDone(true);
    } catch {
      setError("We couldn't send that. Please try again or email info@bwball.club.");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className={`${CARD} border-accent/40 bg-accent/10 p-6`}>
        <p className="text-sm font-semibold text-foreground">
          Thank you — your sponsorship inquiry is in.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          A board member will reach out within a couple of days with the sponsor packet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`${CARD} p-5 sm:p-6`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="s-company">Business name</label>
          <input id="s-company" required className={INPUT} value={form.company} onChange={set("company")} />
        </div>
        <div>
          <label className={LABEL} htmlFor="s-contact">Contact name</label>
          <input id="s-contact" className={INPUT} value={form.contact_name} onChange={set("contact_name")} />
        </div>
        <div>
          <label className={LABEL} htmlFor="s-email">Email</label>
          <input id="s-email" type="email" required className={INPUT} value={form.email} onChange={set("email")} />
        </div>
        <div>
          <label className={LABEL} htmlFor="s-phone">Phone</label>
          <input id="s-phone" className={INPUT} value={form.phone} onChange={set("phone")} />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="s-message">What would you like to sponsor?</label>
          <textarea
            id="s-message"
            rows={3}
            className={INPUT}
            value={form.message}
            onChange={set("message")}
            placeholder="Team sponsorship, tournament, concessions, or anything else."
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-xs font-medium text-accent">{error}</p> : null}

      <button type="submit" disabled={saving} className={`${BTN.accent} mt-5`}>
        {saving ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}