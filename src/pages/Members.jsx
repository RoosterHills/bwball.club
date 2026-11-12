import { Link } from "react-router-dom";
import { FileText, Image as ImageIcon, Users } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCollection, useSiteData } from "@/hooks/useSiteData";
import { useMembership, ACCESS_LABELS } from "@/hooks/useMembership";
import MemberNotice from "@/components/membership/MemberNotice";
import { EmptyBlock } from "@/components/site/Loading";

export default function Members() {
  const { user, isApproved, isAdmin, status, level, linkedTeams } = useMembership();
  const { teams } = useSiteData();
  const { items: media } = useCollection("MediaAsset", "sort_order");
  const { items: resources } = useCollection("Resource", "sort_order");
  const { items: players } = useCollection("Player", "sort_order");

  if (!isApproved) return <MemberNotice status={status} />;

  const myTeams = teams.filter((team) => isAdmin || linkedTeams.includes(team.id));
  const teamIds = myTeams.map((team) => team.id);
  const inScope = (teamId) => isAdmin || !teamId || teamIds.includes(teamId);

  const photos = media.filter(
    (asset) =>
      !asset.archived &&
      asset.image &&
      asset.privacy !== "public" &&
      (isAdmin || asset.privacy !== "admin") &&
      inScope(asset.team)
  );
  const documents = resources.filter((r) => r.visibility !== "public" && inScope(r.team));
  const roster = players.filter((player) => player.active !== false && inScope(player.team));
  const teamName = (id) => {
    const team = teams.find((t) => t.id === id);
    return team ? [team.age_group, team.name].filter(Boolean).join(" · ") : "Team";
  };

  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="shell py-10 sm:py-14">
          <p className="eyebrow text-accent">Member area</p>
          <h1 className="display mt-3 text-4xl leading-[0.95] sm:text-5xl">
            Welcome, {user?.full_name?.split(" ")[0] || "member"}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {ACCESS_LABELS[level] || "Member"} access · {myTeams.length ? "linked to " : "no teams linked yet"}
            {myTeams.length ? myTeams.map((t) => teamName(t.id)).join(", ") : ""}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/membership"
              className="border border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80 hover:border-accent hover:text-accent"
            >
              My access
            </Link>
            <Link
              to="/schedule"
              className="border border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80 hover:border-accent hover:text-accent"
            >
              Full calendar
            </Link>
            <Link
              to="/parents"
              className="border border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80 hover:border-accent hover:text-accent"
            >
              Resources
            </Link>
          </div>
        </div>
      </div>

      <div className="shell space-y-10 py-10">
        <section>
          <div className="flex items-end justify-between border-t border-border pt-5">
            <div>
              <p className="eyebrow text-muted-foreground flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> Rosters
              </p>
              <h2 className="display mt-2 text-2xl">Players</h2>
            </div>
            <span className="num text-xs text-muted-foreground">{roster.length}</span>
          </div>
          {roster.length ? (
            <div className="mt-3 overflow-x-auto border border-border bg-card">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-left">
                    <th className="eyebrow px-4 py-3 text-muted-foreground">Player</th>
                    <th className="eyebrow px-4 py-3 text-muted-foreground">Team</th>
                    <th className="eyebrow px-4 py-3 text-muted-foreground">#</th>
                    <th className="eyebrow px-4 py-3 text-muted-foreground">Positions</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((player) => (
                    <tr key={player.id} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-3 font-medium">{player.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{teamName(player.team)}</td>
                      <td className="num px-4 py-3 text-muted-foreground">{player.jersey_number || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{player.positions || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-3">
              <EmptyBlock>Rosters open up once your account is linked to a team.</EmptyBlock>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-end justify-between border-t border-border pt-5">
            <div>
              <p className="eyebrow text-muted-foreground flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5" /> Private galleries
              </p>
              <h2 className="display mt-2 text-2xl">Team photos</h2>
            </div>
            <Link to="/gallery" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:underline">
              Public gallery →
            </Link>
          </div>
          {photos.length ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((asset) => (
                <figure key={asset.id} className="overflow-hidden border border-border bg-card">
                  <div className="aspect-square bg-secondary">
                    <Image
                      src={asset.image}
                      alt={asset.title}
                      fittingType="fill"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="p-3">
                    <p className="text-xs font-semibold leading-tight">{asset.title}</p>
                    {asset.gallery ? (
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {asset.gallery}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-3">
              <EmptyBlock>No member-only photos have been shared yet.</EmptyBlock>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-end justify-between border-t border-border pt-5">
            <div>
              <p className="eyebrow text-muted-foreground flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" /> Documents
              </p>
              <h2 className="display mt-2 text-2xl">Team files</h2>
            </div>
          </div>
          {documents.length ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {documents.map((item) => (
                <a
                  key={item.id}
                  href={item.file_url || item.link_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 border border-border bg-card px-4 py-3.5 text-sm hover:border-accent/50"
                >
                  <FileText className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                  <span className="truncate font-medium">{item.title}</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-3">
              <EmptyBlock>Member documents appear here once an administrator uploads them.</EmptyBlock>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}