export default function TeamStory({ team }) {
  const body = team.brand_story || team.description;
  if (!body) return null;

  return (
    <div className="border-t border-border pt-5">
      <p className="eyebrow brand-accent-text">Team identity</p>
      <h2 className="display mt-2 text-2xl">{team.motto || "Our standard"}</h2>
      <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}