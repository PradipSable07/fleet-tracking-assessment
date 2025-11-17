import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { normalizeEvent } from "../utils/normalizeEvent";
import { registerTrip } from "../features/tripsSlice";

export function useTripEvents(file) {
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!file) return;

    async function load() {
      try {
        const res = await fetch(file);
        const raw = await res.json();

        const normalized = raw.map(normalizeEvent);
        setEvents(normalized);

        // ---- Extract trip metadata ----
        const first = normalized.find(e => e.tripId);
        if (first) {
          dispatch(
            registerTrip({
              tripId: first.tripId,
              vehicleId: first.vehicleId || first.raw?.vehicle_id,
              file
            })
          );
        }

      } catch (err) {
        console.error("❌ Failed to load trip events", err);
        setEvents([]);
      }
    }

    load();
  }, [file, dispatch]);

  return events;
}
