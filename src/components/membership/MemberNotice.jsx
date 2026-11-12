import { Link } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";

const COPY = {
  pending: {
    icon: ShieldCheck,
    title: "Your access request is being reviewed",
    body: "An administrator approves every account by hand so player and family information stays protected. You'll be able to open member content as soon as your request is approved.",
  },
  denied: {
    icon: Lock,
    title: "Member access was not approved",
    body: "If you believe this was a mistake, reach out to the organization and an administrator can review your account again.",
  },
  public: {
    icon: Lock,
    title: "Sign in to see member content",
    body: "Rosters, private galleries, travel details, documents and team communication are only visible to approved families, coaches and staff.",
  },
};

export default function MemberNotice({ status = "pending", action = true }) {
  const copy = COPY[status] || COPY.pending;
  const Icon = copy.icon;

  return (
    <div className="shell py-14">
      <div className="mx-auto max-w-xl border border-border bg-card p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="display mt-5 text-2xl leading-tight">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.body}</p>
        {action ? (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              to="/membership"
              className="bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              My access
            </Link>
            <Link
              to="/"
              className="border border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80 hover:border-accent hover:text-accent"
            >
              Back to site
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}