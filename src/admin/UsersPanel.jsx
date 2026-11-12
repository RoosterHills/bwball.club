import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useCollection } from "@/hooks/useSiteData";
import { logAudit } from "@/lib/audit";

const LEVELS = ["fan", "parent", "player", "coach", "team_admin", "org_admin"];
const STATUSES = ["pending", "approved", "denied"];

const rows = (res) => (Array.isArray(res) ? res : res?.items ?? []);

const selectClass = "w-full border border-input bg-background px-2 py-1 text-xs outline-none focus:border-accent";

function RoleSelect({ user, onChange }) {
  return (
    <select
      value={user.role || "user"}
      onChange={(e) => onChange(user, { role: e.target.value })}
      className={selectClass}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  );
}

function LevelSelect({ user, onChange }) {
  return (
    <select
      value={user.access_level || "fan"}
      onChange={(e) => onChange(user, { access_level: e.target.value })}
      className={selectClass}
    >
      {LEVELS.map((level) => (
        <option key={level} value={level}>
          {level.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}

function StatusSelect({ user, onChange }) {
  return (
    <select
      value={user.access_status || "pending"}
      onChange={(e) => onChange(user, { access_status: e.target.value })}
      className={selectClass}
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

function TeamSelect({ user, teams, onChange }) {
  return (
    <select
      value={(user.linked_teams || [])[0] || ""}
      onChange={(e) =>
        onChange(user, { linked_teams: e.target.value ? [e.target.value] : [] })
      }
      className={selectClass}
    >
      <option value="">No team</option>
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {[team.age_group, team.name].filter(Boolean).join(" · ")}
        </option>
      ))}
    </select>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground/60">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

export default function UsersPanel() {
  const { toast } = useToast();
  const { items: teams } = useCollection("Team", "sort_order");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await base44.entities.User.list();
      setUsers(rows(res));
      setError("");
    } catch {
      setError("Sign in as an administrator to manage users and roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (user, next) => {
    try {
      await base44.entities.User.update(user.id, { role: next });
      logAudit({ action: "Role changed", entity: "User", label: `${user.email} → ${next}` });
      toast({ title: "Role updated" });
      await load();
    } catch {
      setError("Could not change that role.");
    }
  };

  const changeAccess = async (user, patch) => {
    try {
      await base44.entities.User.update(user.id, patch);
      logAudit({
        action: "Access updated",
        entity: "User",
        label: `${user.email} → ${Object.values(patch).join(", ")}`,
      });
      toast({ title: "Access updated" });
      await load();
    } catch {
      setError("Could not change access. You may need to be signed in as an admin.");
    }
  };

  const invite = async (event) => {
    event.preventDefault();
    const address = email.trim();
    if (!address) return;
    setBusy(true);
    setError("");
    try {
      await base44.users.inviteUser(address, role);
      logAudit({ action: "Invited", entity: "User", label: `${address} as ${role}` });
      toast({ title: "Invitation sent", description: address });
      setEmail("");
    } catch {
      setError("Could not send that invitation. You may need to be signed in as an admin.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="border border-border bg-card p-5">
        <p className="eyebrow text-accent">Add someone</p>
        <h3 className="display mt-2 text-xl">Invite a coach, board member, or helper</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Admins can manage everything in this dashboard. Regular users can sign in but cannot edit.
        </p>
        <form onSubmit={invite} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="coach@example.com"
            className="w-full flex-1 border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={busy} className="bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60">
            {busy ? "Sending…" : "Send invite"}
          </button>
        </form>
      </div>

      {error ? <p className="text-xs font-medium text-accent">{error}</p> : null}

      {loading ? (
        <div className="flex items-center justify-center border border-border bg-card py-16">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : users.length ? (
        <>
          <div className="space-y-2 sm:hidden">
            {users.map((user) => (
              <div key={user.id} className="border border-border bg-card p-4">
                <p className="text-sm font-semibold leading-tight">{user.full_name || "—"}</p>
                <p className="mt-0.5 break-all text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Field label="Role">
                    <RoleSelect user={user} onChange={changeRole} />
                  </Field>
                  <Field label="Access">
                    <LevelSelect user={user} onChange={changeAccess} />
                  </Field>
                  <Field label="Status">
                    <StatusSelect user={user} onChange={changeAccess} />
                  </Field>
                  <Field label="Team">
                    <TeamSelect user={user} teams={teams} onChange={changeAccess} />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto border border-border bg-card sm:block">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left">
                  <th className="eyebrow px-4 py-3 text-muted-foreground">Person</th>
                  <th className="eyebrow px-4 py-3 text-muted-foreground">Email</th>
                  <th className="eyebrow px-4 py-3 text-muted-foreground">Role</th>
                  <th className="eyebrow px-4 py-3 text-muted-foreground">Access</th>
                  <th className="eyebrow px-4 py-3 text-muted-foreground">Status</th>
                  <th className="eyebrow px-4 py-3 text-muted-foreground">Team link</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 font-medium">{user.full_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <RoleSelect user={user} onChange={changeRole} />
                    </td>
                    <td className="px-4 py-3">
                      <LevelSelect user={user} onChange={changeAccess} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect user={user} onChange={changeAccess} />
                    </td>
                    <td className="px-4 py-3">
                      <TeamSelect user={user} teams={teams} onChange={changeAccess} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="border border-border bg-card">
          <p className="px-4 py-12 text-center text-sm text-muted-foreground">
            No one has joined yet. Send the first invitation above.
          </p>
        </div>
      )}
    </div>
  );
}