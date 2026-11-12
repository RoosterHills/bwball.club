export function LoadingBlock({ label = "Loading" }) {
  return (
    <div className="shell flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent" />
        <span className="eyebrow text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function EmptyBlock({ children }) {
  return (
    <div className="border border-dashed border-border bg-card/50 px-5 py-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}