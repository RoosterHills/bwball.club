import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const LINKS = [
  { label: "Schedule", to: "/schedule" },
  { label: "Registration", to: "/register" },
  { label: "GameChanger", to: "/gamechanger" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Parent resources", to: "/parents" },
  { label: "Sponsors", to: "/sponsors" },
  { label: "News", to: "/news" },
  { label: "Coaches corner", to: "/coaches" },
];

export default function Footer() {
  return (
    <footer id="contact" className="mt-8 border-t border-border bg-primary text-primary-foreground">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <span className="display text-xl">BWBALL<span className="text-accent">.</span>CLUB</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/60">
            The central dugout bulletin board for Big Walnut Baseball — schedules, registrations,
            volunteers, sponsors, and everything families ask about.
          </p>
        </div>

        <div>
          <p className="eyebrow text-primary-foreground/40">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2.5">
              <Mail className="h-3.5 w-3.5 text-accent" />
              <a href="mailto:info@bwball.club" className="hover:text-accent">
                info@bwball.club
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-3.5 w-3.5 text-accent" />
              <span>(740) 555-0142</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span>Sunbury, Ohio</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-primary-foreground/40">Everything else</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2.5 text-sm text-primary-foreground/70">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-primary-foreground/10 py-5 text-[11px] text-primary-foreground/35 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Big Walnut Baseball. All rights reserved.</span>
        <Link to="/admin" className="hover:text-primary-foreground/70">
          Admin dashboard
        </Link>
      </div>
    </footer>
  );
}