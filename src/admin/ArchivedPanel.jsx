import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useCollection } from "@/hooks/useSiteData";
import { EmptyBlock } from "@/components/site/Loading";
import { Image } from "@/components/ui/image";
import { logAudit } from "@/lib/audit";

export default function ArchivedPanel({ onRestored }) {
  const { toast } = useToast();
  const teams = useCollection("Team", "sort_order");
  const media = useCollection("MediaAsset", "sort_order");

  const archivedTeams = teams.items.filter((t) => t.archived);
  const archivedMedia = media.items.filter((m) => m.archived);

  const restore = async (entity, record, label) => {
    try {
      await base44.entities[entity].update(record.id, { archived: false });
      logAudit({ action: "Restored", entity, label });
      await Promise.all([teams.reload(), media.reload()]);
      onRestored?.();
      toast({ title: "Restored" });
    } catch {
      toast({ title: "Could not restore", description: "Please try again." });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-accent">Teams</p>
        <h3 className="display mt-2 text-xl">Archived teams</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Archived teams are hidden from the site but keep their history — restore one any time.
        </p>
        <div className="mt-3 space-y-2">
          {archivedTeams.length ? (
            archivedTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between gap-3 border border-border bg-card px-4 py-3">
                <div>
                  <p className="text-sm font-medium">
                    {[team.name, team.age_group].filter(Boolean).join(" ")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{team.season || "No season"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => restore("Team", team, [team.name, team.age_group].filter(Boolean).join(" "))}
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent hover:underline"
                >
                  Restore
                </button>
              </div>
            ))
          ) : (
            <EmptyBlock>No archived teams.</EmptyBlock>
          )}
        </div>
      </div>

      <div>
        <p className="eyebrow text-accent">Media</p>
        <h3 className="display mt-2 text-xl">Archived photos and galleries</h3>
        <div className="mt-3">
          {archivedMedia.length ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {archivedMedia.map((asset) => (
                <div key={asset.id} className="border border-border bg-card p-3">
                  {asset.image ? (
                    <Image src={asset.image} alt={asset.title} fittingType="fill" className="h-24 w-full object-cover opacity-60" />
                  ) : null}
                  <p className="mt-2 truncate text-sm font-medium">{asset.title}</p>
                  <button
                    type="button"
                    onClick={() => restore("MediaAsset", asset, asset.title)}
                    className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent hover:underline"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyBlock>No archived media.</EmptyBlock>
          )}
        </div>
      </div>
    </div>
  );
}