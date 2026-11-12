import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCollection } from "@/hooks/useSiteData";
import { useMembership } from "@/hooks/useMembership";

export default function TeamPrivateSection({ team }) {
  const { isApproved, canViewTeam } = useMembership();
  const { items: media } = useCollection("MediaAsset", "sort_order");
  const { items: players } = useCollection("Player", "sort_order");

  if (!canViewTeam(team.id)) {
    return (
      <div className="flex flex-col gap-3 border border-dashed border-border bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
          <div>
            <p className="text-sm font-semibold">Roster, private gallery and team files are members only</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {isApproved
                ? "Ask an administrator to link your account to this team — access is approved by hand."
                : "Approved families, coaches and staff can sign in to see them."}
            </p>
          </div>
        </div>
        <Link
          to="/membership"
          className="shrink-0 border border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/80 hover:border-accent hover:text-accent"
        >
          Request access
        </Link>
      </div>
    );
  }

  const photos = media.filter(
    (asset) => !asset.archived && asset.image && asset.team === team.id && asset.privacy !== "public"
  );
  const roster = players.filter((p) => p.team === team.id && p.active !== false);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="eyebrow text-muted-foreground">Team roster</p>
        {roster.length ? (
          <ul className="mt-3 divide-y divide-border border border-border bg-card">
            {roster.map((player) => (
              <li key={player.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="font-medium">{player.name}</span>
                <span className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  {player.positions ? <span>{player.positions}</span> : null}
                  <span className="num font-semibold text-foreground/70">
                    {player.jersey_number ? `#${player.jersey_number}` : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
            No roster has been entered for this team yet.
          </p>
        )}
      </div>

      <div>
        <p className="eyebrow text-muted-foreground">Private gallery</p>
        {photos.length ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {photos.slice(0, 6).map((asset) => (
              <span key={asset.id} className="block aspect-square overflow-hidden border border-border bg-card">
                <Image
                  src={asset.image}
                  alt={asset.title}
                  fittingType="fill"
                  className="h-full w-full object-cover"
                />
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
            No team-only photos yet.
          </p>
        )}
      </div>
    </div>
  );
}