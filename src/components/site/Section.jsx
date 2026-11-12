import { cn } from "@/lib/utils";

export default function Section({ id, eyebrow, title, intro, action, children, className }) {
  return (
    <section id={id} className={cn("shell py-12 sm:py-16", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-6">
        <div className="max-w-2xl">
          {eyebrow ? <p className="eyebrow text-accent">{eyebrow}</p> : null}
          {title ? (
            <h2 className="display mt-2.5 text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</h2>
          ) : null}
          {intro ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}