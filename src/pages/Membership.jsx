import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMembership, ACCESS_LABELS, STATUS_LABELS } from "@/hooks/useMembership";
import { useSiteData } from "@/hooks/useSiteData";
import RequestForm from "@/components/membership/RequestForm";

export default function Membership() {
  const { user, status, level, isApproved, isAdmin, linkedTeams } = useMembership();
  const { teams } = useSiteData();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    base44.entities.MembershipRequest.list("-created_date", 5)
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.items ?? [];
        if (live) setRequest(list[0] || null);
      })
      .catch(() => {})
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const linkedNames = teams
    .filter((team) => linkedTeams.includes(team.id))
    .map((team) => [team.age_group, team.name].filter(Boolean).join(" · "));

  return (
    <div className="shell max-w-3xl py-12 sm:py-16">
      <p className="eyebrow text-accent">Membership</p>
      <h1 className="display mt-3 text-4xl leading-[0.95] sm:text-5xl">My access</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Accounts are approved by an administrator so player and family information stays with the
        people who belong to it. Public schedules, news, sponsors and highlights never need a login.
      </p>

      <div className="mt-8 grid gap-3 border border-border bg-card p-6 sm:grid-cols-3">
        <div>
          <p className="eyebrow text-muted-foreground">Status</p>
          <p className="mt-1.5 text-sm font-semibold">{STATUS_LABELS[status] || status}</p>
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Account type</p>
          <p className="mt-1.5 text-sm font-semibold">{ACCESS_LABELS[level] || level}</p>
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Linked teams</p>
          <p className="mt-1.5 text-sm font-semibold">
            {linkedNames.length ? linkedNames.join(", ") : "None yet"}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Signed in as {user?.full_name || user?.email}. Need to switch accounts?{" "}
        <button
          type="button"
          onClick={() => base44.auth.logout()}
          className="font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4"
        >
          Sign out
        </button>
        .
      </p>

      {isApproved ? (
        <div className="mt-8 border border-border bg-card p-6">
          <h2 className="display text-xl">You're approved</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isAdmin
              ? "As an organization administrator you can manage everything from the dashboard."
              : "Member content is open to you — rosters, private galleries, documents and team details."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/members"
              className="bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Member area
            </Link>
            {isAdmin ? (
              <Link
                to="/admin"
                className="border border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80 hover:border-accent hover:text-accent"
              >
                Admin dashboard
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {request ? (
            <div className="border border-border bg-secondary/40 p-5 text-sm">
              <p className="eyebrow text-muted-foreground">Your latest request</p>
              <p className="mt-1.5 font-medium">
                {ACCESS_LABELS[request.requested_level] || request.requested_level} ·{" "}
                {request.status}
              </p>
              {request.players ? (
                <p className="mt-1 text-muted-foreground">Players: {request.players}</p>
              ) : null}
            </div>
          ) : null}
          {loading ? null : <RequestForm user={user} />}
        </div>
      )}
    </div>
  );
}