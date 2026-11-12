import { Link } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  Activity,
  Radio,
  HeartHandshake,
  BadgeCheck,
  Mail,
} from "lucide-react";

const ACTIONS = [
  { label: "Register", note: "Tryouts & camps", to: "/register", Icon: ClipboardList },
  { label: "Schedules", note: "All teams", to: "/schedule", Icon: CalendarDays },
  { label: "Watch Live", note: "Stream games", to: "/gamechanger", Icon: Radio },
  { label: "GameChanger", note: "Scores & stats", to: "/gamechanger", Icon: Activity },
  { label: "Volunteer", note: "Sign up", to: "/volunteer", Icon: HeartHandshake },
  { label: "Sponsors", note: "Our partners", to: "/sponsors", Icon: BadgeCheck },
  { label: "Contact", note: "Reach a coach", to: "/#contact", Icon: Mail },
];

export default function QuickActions() {
  return (
    <div className="shell relative z-10 -mt-6 sm:-mt-8">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {ACTIONS.map(({ label, note, to, Icon }) => (
          <Link
            key={label + to}
            to={to}
            className="lift group flex flex-col gap-2.5 border border-border bg-card px-3.5 py-4 hover:border-accent/50"
          >
            <Icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <div>
              <p className="text-[13px] font-semibold leading-tight">{label}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {note}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}