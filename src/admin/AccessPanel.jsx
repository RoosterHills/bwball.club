import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useCollection } from "@/hooks/useSiteData";
import { logAudit } from "@/lib/audit";
import { ACCESS_LABELS } from "@/hooks/useMembership";

const rows = (res) => (Array.isArray(res) ? res : res?.items ?? []);
const GRANT_LEVELS = ["fan", "parent", "player", "coach", "team_admin"];
const STATUS_STYLE = {
  pending: "border-accent/40 bg-accent/10 text-foreground",
  approved: "border-primary/20 bg-secondary text-foreground",
  denied: "border-destructive/30 bg-destructive/10 text-foreground",
};

export default function AccessPanel() {
  const { toast } = useToast();
  const { items: requests, reload } = useCollection("MembershipRequest", "-created_date");
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [grant, setGrant] = useState({});

  const loadUsers = async () => {
    try {
      setUsers(rows(await base44.entities.User.list()));
      setError("");
    } catch {
      setError("Sign in as an administrator to review members.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const approve = async (request) => {
    setBusy(request.id);
    setError("");
    try {
      const match = users.find(
        (u) => String(u.email).toLowerCase() === String(request.email).toLowerCase()
      );
      if (match) {
        await base44.entities.User.update(match.id, {
          access_level: grant[request.id] || request.requested_level || "parent",
          access_status: "approved",
          ...(request.team ? { linked_teams: [request.team] } : {}),
        });
      }
      await base44.entities.MembershipRequest.update(request.id, { status: "approved" });
      logAudit({ action: "Approved access", entity: "User", label: request.email });
      toast({
        title: match ? "Access approved" : "Request approved — no account yet",
        description: match ? request.email : "They can sign up with this email to get in.",
      });
      await Promise.all([reload(), loadUsers()]);
    } catch {
      setError("Could not approve that request.");
    } finally {
      setBusy("");
    }
  };

  const deny = async (request) => {
    setBusy(request.id);
    try {
      await base44.entities.MembershipRequest.update(request.id, { status: "denied" });
      const match = users.find(
        (u) => String(u.email).toLowerCase() === String(request.email).toLowerCase()
      );
      if (match) {
        await base44.entities.User.update(match.id, { access_status: "denied" });
      }
      logAudit({ action: "Denied access", entity: "User", label: request.email });
      toast({ title: "Request denied" });
      await Promise.all([reload(), loadUsers()]);
    } catch {
      setError("Could not update that request.");
    } finally {
      setBusy("");
    }
  };

  const pending = requests.filter((r) => (r.status || "pending") === "pending");
  const handled = requests.filter((r) => (r.status || "pending") !== "pending");

  return (
    <div className="space-y-5">
      <div className="border border-border bg-card p-5">
        <p className="eyebrow text-accent">Waiting on you</p>
        <h3 className="display mt-2 text-xl">Access requests</h3>
        <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted-foreground">
          Approving links the person to the team they asked for and unlocks member content. Nothing
          private opens until you approve.
        </p>
      </div>

      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}

      <div className="space-y-2 sm:hidden">
        {pending.length ? (
          pending.map((request) => (
            <div key={request.id} className="border border-border bg-card p-4">
              <p className="text-sm font-semibold leading-tight">{request.name}</p>
              <p className="mt-0.5 break-all text-xs text-muted-foreground">{request.email}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="eyebrow text-muted-foreground/60">Grant</span>
                  <select
                    value={grant[request.id] || request.requested_level || "parent"}
                    onChange={(e) => setGrant((prev) => ({ ...prev, [request.id]: e.target.value }))}
                    className="mt-1 w-full border border-input bg-background px-2 py-1 text-xs outline-none focus:border-accent"
                  >
                    {GRANT_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {ACCESS_LABELS[level]}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <span className="eyebrow text-muted-foreground/60">Players</span>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{request.players || "—"}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2 border-t border-border/70 pt-3">
                <button
                  type="button"
                  disabled={busy === request.id}
                  onClick={() => approve(request)}
                  className="flex-1 bg-primary px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busy === request.id}
                  onClick={() => deny(request)}
                  className="flex-1 border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/70 hover:border-destructive hover:text-destructive disabled:opacity-60"
                >
                  Deny
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-border bg-card px-4 py-10 text-center text-xs text-muted-foreground">
            No one is waiting for approval.
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto border border-border bg-card sm:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left">
              <th className="eyebrow px-4 py-3 text-muted-foreground">Person</th>
              <th className="eyebrow px-4 py-3 text-muted-foreground">Wants</th>
              <th className="eyebrow px-4 py-3 text-muted-foreground">Players</th>
              <th className="eyebrow px-4 py-3 text-muted-foreground">Decision</th>
            </tr>
          </thead>
          <tbody>
            {pending.length ? (
              pending.map((request) => (
                <tr key={request.id} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{request.name}</p>
                    <p className="text-xs text-muted-foreground">{request.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <select
                      value={grant[request.id] || request.requested_level || "parent"}
                      onChange={(e) => setGrant((prev) => ({ ...prev, [request.id]: e.target.value }))}
                      className="border border-input bg-background px-2 py-1 text-xs outline-none focus:border-accent"
                    >
                      {GRANT_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {ACCESS_LABELS[level]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {request.players || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busy === request.id}
                        onClick={() => approve(request)}
                        className="bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busy === request.id}
                        onClick={() => deny(request)}
                        className="border border-border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/70 hover:border-destructive hover:text-destructive disabled:opacity-60"
                      >
                        Deny
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-xs text-muted-foreground">
                  No one is waiting for approval.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {handled.length ? (
        <div className="border border-border bg-card">
          <p className="eyebrow border-b border-border px-4 py-3 text-muted-foreground">
            Recent decisions
          </p>
          <ul className="divide-y divide-border/70">
            {handled.slice(0, 8).map((request) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs">
                <span>
                  <span className="font-medium">{request.name}</span>{" "}
                  <span className="text-muted-foreground">{request.email}</span>
                </span>
                <span className={`border px-2 py-0.5 uppercase tracking-[0.12em] ${STATUS_STYLE[request.status] || STATUS_STYLE.pending}`}>
                  {request.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}