export default function PageHeader({ eyebrow, title, intro, children }) {
  return (
    <div className="border-b border-border bg-secondary/30">
      <div className="shell py-10 sm:py-14">
        {eyebrow ? <p className="eyebrow text-accent">{eyebrow}</p> : null}
        <h1 className="display mt-3 text-4xl sm:text-5xl lg:text-[3.6rem]">{title}</h1>
        {intro ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}