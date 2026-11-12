import { cn } from "@/lib/utils";
import { fmtDate } from "@/lib/format";

const PRIORITY = {
  urgent: { label: "Urgent", dot: "bg-accent", text: "text-accent" },
  high: { label: "Important", dot: "bg-accent/70", text: "text-accent/80" },
  normal: { label: "News", dot: "bg-primary/25", text: "text-muted-foreground" },
};

export default function AnnouncementCard({ announcement, teamName }) {
  const p = PRIORITY[announcement.priority] || PRIORITY.normal;

  return (
    <article className="flex h-full flex-col border-t-2 border-primary/70 pt-4">
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", p.dot)} />
        <span className={cn("eyebrow", p.text)}>{p.label}</span>
        <span className="eyebrow text-muted-foreground/60">
          {teamName || "All teams"}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug">{announcement.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {announcement.body}
      </p>
      <p className="mt-auto pt-4 text-[11px] text-muted-foreground/70">
        {fmtDate(announcement.publish_date || announcement.created_date)}
      </p>
    </article>
  );
}