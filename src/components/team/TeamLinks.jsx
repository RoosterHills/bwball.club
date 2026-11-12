import { Link } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  Camera,
  FolderOpen,
  HeartHandshake,
  Mail,
  Radio,
  ShoppingBag,
  Users,
} from "lucide-react";

export default function TeamLinks({ team }) {
  const links = [
    { label: "Schedule", to: `/schedule?team=${team.id}`, Icon: CalendarDays },
    team.roster_url && { label: "Roster", href: team.roster_url, Icon: Users },
    team.watch_live_url && { label: "Watch Live", href: team.watch_live_url, Icon: Radio },
    team.gamechanger_url && { label: "GameChanger", href: team.gamechanger_url, Icon: Activity },
    team.photos_url && { label: "Photos", href: team.photos_url, Icon: Camera },
    team.store_url && { label: team.store_label || "Team Store", href: team.store_url, Icon: ShoppingBag },
    { label: "Volunteer", to: "/volunteer", Icon: HeartHandshake },
    {
      label: "Contact Coaches",
      href: team.head_coach_email ? `mailto:${team.head_coach_email}` : "/#contact",
      Icon: Mail,
    },
    { label: "Resources", to: "/parents", Icon: FolderOpen },
  ].filter(Boolean);

  return (
    <div>
      <p className="eyebrow text-muted-foreground">Quick access</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
        {links.map(({ label, to, href, Icon }) => {
          const inner = (
            <>
              <Icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
              <span>{label}</span>
            </>
          );
          const cls =
            "lift flex items-center gap-2.5 border border-border bg-card px-4 py-3.5 text-[12px] font-semibold text-foreground/80 hover:border-accent/50 hover:text-accent";
          return to ? (
            <Link key={label} to={to} className={cls}>
              {inner}
            </Link>
          ) : (
            <a key={label} href={href} target="_blank" rel="noreferrer" className={cls}>
              {inner}
            </a>
          );
        })}
      </div>
    </div>
  );
}