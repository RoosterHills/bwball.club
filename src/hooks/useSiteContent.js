import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const rows = (res) => (Array.isArray(res) ? res : res?.items ?? []);

export const DEFAULT_NAV = [
  { label: "Schedule", to: "/schedule" },
  { label: "Register", to: "/register" },
  { label: "GameChanger", to: "/gamechanger" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Parents", to: "/parents" },
  { label: "Sponsors", to: "/sponsors" },
  { label: "Coaches", to: "/coaches" },
];

const toNav = (item) => ({ label: item.label, to: item.href, external: item.external });

// Site-wide editable content: homepage copy, footer, contact details, and navigation.
export function useSiteContent() {
  const [settings, setSettings] = useState(null);
  const [headerNav, setHeaderNav] = useState(DEFAULT_NAV);
  const [footerNav, setFooterNav] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [settingsRes, navRes] = await Promise.all([
          base44.entities.SiteSettings.list("-created_date", 1),
          base44.entities.NavItem.list("sort_order", 100),
        ]);
        setSettings(rows(settingsRes)[0] || null);

        const items = rows(navRes).filter((n) => n.visible !== false && n.href);
        // The account link in the header already points at the member area,
        // so a nav item for it would show the same destination twice.
        const header = items.filter(
          (n) => (n.group || "header") === "header" && !["/members", "/login"].includes(n.href)
        );
        const footer = items.filter((n) => n.group === "footer");
        if (header.length) setHeaderNav(header.map(toNav));
        if (footer.length) setFooterNav(footer.map(toNav));
      } catch {
        // Fall back to the built-in navigation and copy.
      }
    })();
  }, []);

  return { settings, headerNav, footerNav };
}