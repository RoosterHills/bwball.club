import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const rows = (res) => (Array.isArray(res) ? res : res?.items ?? []);

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const EMPTY = {
  organization: null,
  teams: [],
  sponsors: [],
  events: [],
  announcements: [],
  loading: true,
};

export function useSiteData() {
  const [data, setData] = useState(EMPTY);

  const load = useCallback(async () => {
    try {
      const [orgRes, teamRes, sponsorRes, eventRes, annRes] = await Promise.all([
        base44.entities.Organization.list("-created_date", 1),
        base44.entities.Team.list("-created_date", 100),
        base44.entities.Sponsor.list("-created_date", 100),
        base44.entities.Event.list("start", 300),
        base44.entities.Announcement.list("-created_date", 100),
      ]);

      const today = startOfToday();
      setData({
        organization: rows(orgRes)[0] || null,
        teams: rows(teamRes)
          .filter((t) => t.active !== false)
          .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)),
        sponsors: rows(sponsorRes).filter((s) => s.active !== false),
        events: rows(eventRes),
        announcements: rows(annRes).filter(
          (a) => !a.expiration_date || new Date(a.expiration_date) >= today
        ),
        loading: false,
      });
    } catch {
      setData((d) => ({ ...d, loading: false }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, reload: load };
}

export function useCollection(entityName, sort = "-created_date") {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setItems([]);
    try {
      const res = await base44.entities[entityName].list(sort, 200);
      setItems(rows(res));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [entityName, sort]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, reload: load };
}

export { rows };