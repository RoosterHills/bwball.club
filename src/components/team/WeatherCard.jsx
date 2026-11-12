export default function WeatherCard() {
  return (
    <div className="mt-6 border border-border bg-card p-5">
      <p className="eyebrow text-accent">Weather & field status</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Rain, heat, and lightning calls are made by the umpires at the field. Coaches post
        cancellations on the news feed first, so check it before you leave the house.
      </p>
      <a
        href="https://forecast.weather.gov/MapClick.php?lat=40.2426&lon=-82.8591"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.14em] text-accent hover:underline"
      >
        Local forecast →
      </a>
    </div>
  );
}