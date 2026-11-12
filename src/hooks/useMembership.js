import { useAuth } from "@/lib/AuthContext";

export const ACCESS_LABELS = {
  fan: "Fan",
  parent: "Parent / Guardian",
  player: "Player",
  coach: "Coach",
  team_admin: "Team admin",
  org_admin: "Organization admin",
};

export const STATUS_LABELS = {
  public: "Public visitor",
  pending: "Awaiting approval",
  approved: "Approved member",
  denied: "Access not approved",
};

export function useMembership() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  const isAdmin = user?.role === "admin";
  const level = isAdmin ? "org_admin" : user?.access_level || "fan";
  const status = isAdmin
    ? "approved"
    : user?.access_status || (isAuthenticated ? "pending" : "public");
  const linkedTeams = Array.isArray(user?.linked_teams) ? user.linked_teams : [];

  const isApproved = status === "approved";

  // Team-only content: admins, or an approved member linked to that team.
  const canViewTeam = (teamId) =>
    !!teamId && (isAdmin || (isApproved && linkedTeams.includes(teamId)));

  return {
    user,
    isAuthenticated,
    isLoadingAuth,
    isAdmin,
    isApproved,
    status,
    level,
    linkedTeams,
    canViewTeam,
  };
}