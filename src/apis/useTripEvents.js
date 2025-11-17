import { useEffect, useState } from "react";
import { normalizeEvent } from "../../utils/normalizeEvent";

export function useTripEvents(file) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!file) return;

    async function load() {
      try {
        const res = await fetch(file);
        const raw = await res.json();
        setEvents(raw.map(normalizeEvent));
      } catch (err) {
        console.error("❌ Failed to load trip events", err);
        setEvents([]);
      }
    }

    load();
  }, [file]);

  return events;
}
