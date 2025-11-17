import { useEffect, useState } from "react";

export function useTripsIndex() {
  const [tripIndex, setTripIndex] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/tripIndex.json");
        const json = await res.json();
        setTripIndex(json);
      } catch (err) {
        console.error("❌ Failed to load trip index", err);
        setTripIndex([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { tripIndex, loading };
}
