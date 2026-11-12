import { isUpcoming, daysAway } from "./format";

const byStart = (a, b) => new Date(a.start || 0) - new Date(b.start || 0);

export function sortedEvents(events = []) {
  return [...events].sort(byStart);
}

export function upcomingEvents(events = []) {
  return sortedEvents(events).filter((e) => isUpcoming(e.start));
}

export function nextEventFor(events = [], teamId) {
  if (!teamId) return null;
  return upcomingEvents(events).find((e) => e.team === teamId) || null;
}

export function nextOfType(events = [], teamId, type) {
  if (!teamId) return null;
  return upcomingEvents(events).find((e) => e.team === teamId && e.type === type) || null;
}

export function eventsInWindow(events = [], days = 7) {
  return upcomingEvents(events).filter((e) => {
    const d = daysAway(e.start);
    return d !== null && d <= days;
  });
}

export function sponsorFor(team, sponsors = []) {
  if (!team?.sponsor) return null;
  return sponsors.find((s) => s.id === team.sponsor) || null;
}

// Sponsorship drives the team name: "ABC Heating & Cooling Eagles 16U"
export function teamDisplayName(team, sponsors = []) {
  if (!team) return "";
  const sponsor = sponsorFor(team, sponsors);
  return [sponsor?.name, team.name, team.age_group].filter(Boolean).join(" ");
}

export function teamShortName(team) {
  if (!team) return "";
  return [team.name, team.age_group].filter(Boolean).join(" ");
}

export function recordLine(team) {
  if (!team) return "";
  const w = Number(team.wins) || 0;
  const l = Number(team.losses) || 0;
  const t = Number(team.ties) || 0;
  if (!w && !l && !t) return "Record TBD";
  return t ? `${w}-${l}-${t}` : `${w}-${l}`;
}

export function winPct(team) {
  const w = Number(team?.wins) || 0;
  const l = Number(team?.losses) || 0;
  const t = Number(team?.ties) || 0;
  const games = w + l + t;
  if (!games) return null;
  return (w + t * 0.5) / games;
}

export function teamNameMap(teams = []) {
  return teams.reduce((acc, t) => {
    acc[t.id] = teamShortName(t);
    return acc;
  }, {});
}