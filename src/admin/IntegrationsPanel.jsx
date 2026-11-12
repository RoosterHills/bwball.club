import { useCollection } from "@/hooks/useSiteData";
import { BTN } from "@/lib/styles";

const LINK_FIELDS = [
  { key: "gamechanger_url", label: "GameChanger" },
  { key: "watch_live_url", label: "Livestream" },
  { key: "store_url", label: "Team store" },
  { key: "photos_url", label: "Photos" },
];

export default function IntegrationsPanel({ onEditTeams }) {
  const { items: teams, loading } = useCollection("Team", "sort_order");

  return (
    <div className="space-y-5">
      <div className="border border-border bg-card p-5">
        <p className="eyebrow text-accent">Organization links</p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          The organization-wide GameChanger and livestream addresses live in Website &amp; homepage.
          Each team's own links are edited in Teams — changes appear immediately on that team's hub.
        </p>
        <button type="button" onClick={onEditTeams} className={`${BTN.ghost} mt-4`}>
          Edit teams
        </button>
      </div>

      <div className="overflow-x-auto border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent" />
          </div>
        ) : (
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left">
                <th className="eyebrow px-4 py-3 text-muted-foreground">Team</th>
                {LINK_FIELDS.map((field) => (
                  <th key={field.key} className="eyebrow px-4 py-3 text-muted-foreground">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {[team.name, team.age_group].filter(Boolean).join(" ")}
                  </td>
                  {LINK_FIELDS.map((field) => (
                    <td key={field.key} className="px-4 py-3">
                      {team[field.key] ? (
                        <a
                          href={team[field.key]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-accent hover:underline"
                        >
                          Open link
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not set</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}