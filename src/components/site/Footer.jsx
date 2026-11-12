import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const FALLBACK_LINKS = [
  { label: "Schedule", to: "/schedule" },
  { label: "Registration", to: "/register" },
  { label: "GameChanger", to: "/gamechanger" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Parent resources", to: "/parents" },
  { label: "Sponsors", to: "/sponsors" },
  { label: "News", to: "/news" },
  { label: "Coaches corner", to: "/coaches" },
];

const isInternal = (to) => String(to || "").startsWith("/");

export default function Footer() {
  const { settings, footerNav } = useSiteContent();
  const links = footerNav.length ? footerNav : FALLBACK_LINKS;
  const siteName = settings?.site_name || "BWBALL.CLUB";

  return (
    <footer id="contact" className="mt-8 border-t border-border bg-primary text-primary-foreground">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <span className="display text-xl">{siteName}</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/60">
            {settings?.footer_about ||
              "The central dugout bulletin board for Big Walnut Baseball — schedules, registrations, volunteers, sponsors, and everything families ask about."}
          </p>
          {settings?.footer_note ? (
            <p className="mt-3 max-w-xs text-xs text-primary-foreground/40">{settings.footer_note}</p>
          ) : null}
          {settings?.facebook_url || settings?.instagram_url ? (
            <div className="mt-4 flex items-center gap-3">
              {settings.facebook_url ? (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-primary-foreground/50 hover:text-accent">
                  <Facebook className="h-4 w-4" />
                </a>
              ) : null}
              {settings.instagram_url ? (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-primary-foreground/50 hover:text-accent">
                  <Instagram className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div>
          <p className="eyebrow text-primary-foreground/40">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2.5">
              <Mail className="h-3.5 w-3.5 text-accent" />
              <a href={`mailto:${settings?.contact_email || "info@bwball.club"}`} className="hover:text-accent">
                {settings?.contact_email || "info@bwball.club"}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-3.5 w-3.5 text-accent" />
              <span>{settings?.contact_phone || "(740) 555-0142"}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span>{settings?.contact_address || "Sunbury, Ohio"}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-primary-foreground/40">Everything else</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2.5 text-sm text-primary-foreground/70">
            {links.map((l) => (
              <li key={l.to}>
                {isInternal(l.to) ? (
                  <Link to={l.to} className="transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                ) : (
                  <a href={l.to} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-primary-foreground/10 py-5 text-[11px] text-primary-foreground/35 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </span>
        <Link to="/admin" className="hover:text-primary-foreground/70">
          Admin dashboard
        </Link>
      </div>
    </footer>
  );
}