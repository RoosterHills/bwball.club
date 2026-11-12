import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/hooks/useSiteContent";

const isInternal = (to) => String(to || "").startsWith("/");

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { headerNav, settings } = useSiteContent();
  const siteName = settings?.site_name || "BWBALL.CLUB";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="num flex h-8 w-8 items-center justify-center rounded-[4px] bg-accent text-[11px] font-semibold text-accent-foreground">
            BW
          </span>
          <span className="display text-[17px] tracking-tight">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {headerNav.map((item) =>
            isInternal(item.to) ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "eyebrow transition-colors hover:text-foreground",
                    isActive ? "text-foreground" : "text-foreground/55"
                  )
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <a
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noreferrer"
                className="eyebrow text-foreground/55 transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/schedule"
            className="hidden border border-primary/15 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:border-accent hover:text-accent sm:inline-block"
          >
            This week
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-border text-foreground xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background xl:hidden">
          <div className="shell grid grid-cols-2 gap-x-4 gap-y-1 py-4">
            {headerNav.map((item) =>
              isInternal(item.to) ? (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-border/60 py-2.5 text-sm font-medium",
                    pathname === item.to ? "text-accent" : "text-foreground/75"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.to}
                  href={item.to}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 py-2.5 text-sm font-medium text-foreground/75"
                >
                  {item.label}
                </a>
              )
            )}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="col-span-2 border-b border-border/60 py-2.5 text-sm font-medium text-foreground/50"
            >
              Admin dashboard
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}