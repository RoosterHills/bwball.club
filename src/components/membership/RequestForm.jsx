import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useSiteData } from "@/hooks/useSiteData";
import { logAudit } from "@/lib/audit";
import { ACCESS_LABELS } from "@/hooks/useMembership";

const LEVELS = ["fan", "parent", "player", "coach", "team_admin"];

const FIELD =
  "w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent";

export default function RequestForm({ user }) {
  const { toast } = useToast();
  const { teams } = useSiteData();
  const [values, setValues] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    requested_level: "parent",
    players: "",
    team: "",
    message: "",
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const change = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await base44.entities.MembershipRequest.create(values);
      logAudit({ action: "Requested access", entity: "MembershipRequest", label: values.email });
      setDone(true);
      toast({ title: "Request sent", description: "An administrator will review your account." });
    } catch {
      setError("We couldn't send your request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="border border-accent/40 bg-accent/10 p-6 text-sm">
        <p className="font-semibold text-foreground">Your request is in the queue.</p>
        <p className="mt-1 text-muted-foreground">
          An administrator approves accounts by hand. You'll see member content here as soon as
          your access is approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-border bg-card p-6">
      <p className="eyebrow text-accent">Request access</p>
      <h2 className="display mt-2 text-xl">Tell us who you are</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-muted-foreground">
          Name
          <input
            required
            value={values.name}
            onChange={(e) => change("name", e.target.value)}
            className={`mt-1 ${FIELD}`}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          Email
          <input
            required
            type="email"
            value={values.email}
            onChange={(e) => change("email", e.target.value)}
            className={`mt-1 ${FIELD}`}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          I am a…
          <select
            value={values.requested_level}
            onChange={(e) => change("requested_level", e.target.value)}
            className={`mt-1 ${FIELD}`}
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {ACCESS_LABELS[level]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          Team
          <select
            value={values.team}
            onChange={(e) => change("team", e.target.value)}
            className={`mt-1 ${FIELD}`}
          >
            <option value="">All teams / not sure</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {[team.age_group, team.name].filter(Boolean).join(" · ")}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-muted-foreground sm:col-span-2">
          Player(s) you're connected to
          <input
            value={values.players}
            onChange={(e) => change("players", e.target.value)}
            placeholder="Optional — helps us link you to the right team"
            className={`mt-1 ${FIELD}`}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground sm:col-span-2">
          Anything we should know
          <textarea
            rows={3}
            value={values.message}
            onChange={(e) => change("message", e.target.value)}
            className={`mt-1 ${FIELD}`}
          />
        </label>
      </div>

      {error ? <p className="mt-3 text-xs font-medium text-destructive">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 bg-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60"
      >
        {saving ? "Sending…" : "Request access"}
      </button>
    </form>
  );
}