// loadTrips.js
// Make sure your JSON files are inside:  public/data/
// Example: public/data/trip_1_cross_country.json

export const DATA_FILES = [
  "/data/trip_1_cross_country.json",
  "/data/trip_2_urban_dense.json",
  "/data/trip_3_mountain_cancelled.json",
  "/data/trip_4_southern_technical.json",
  "/data/trip_5_regional_logistics.json"
];

/**
 * Load + validate + normalize a JSON file
 */
async function safeFetchJson(path) {
  try {
    const res = await fetch(path);

    if (!res.ok) {
      console.error(`❌ Failed to load ${path} (status ${res.status})`);
      return [];
    }

    const text = await res.text();

    // --- Detect HTML response (common when file is missing) ---
    if (text.trim().startsWith("<")) {
      console.error(`❌ ERROR: ${path} returned HTML instead of JSON.`);
      console.error(`Check that file exists in /public${path}`);
      return [];
    }

    let json = JSON.parse(text);

    // Normalize nested arrays: [[events], [events]] → [events]
    if (Array.isArray(json) && json.length === 1 && Array.isArray(json[0])) {
      json = json[0];
    }

    // Ensure final data is always a flat array
    if (!Array.isArray(json)) {
      console.error(`❌ Expected array in ${path} but got:`, json);
      return [];
    }

    // Normalize each event for backend consistency
    return json.map((ev) => normalizeEvent(ev));
  } catch (err) {
    console.error(`❌ JSON parse error in ${path}`, err);
    return [];
  }
}

/**
 * Normalize event objects so the rest of your app never breaks.
 * Converts your schema into a safe shape used by Redux + UI.
 */
function normalizeEvent(ev) {
  return {
    eventId: ev.event_id,
    eventType: ev.event_type,
    timestamp: ev.timestamp,

    vehicleId: ev.vehicle_id,
    tripId: ev.trip_id,

    location: {
      lat: ev.location?.lat,
      lng: ev.location?.lng,
      accuracy: ev.location?.accuracy_meters ?? null,
      altitude: ev.location?.altitude_meters ?? null,
    },

    movement: {
      speed: ev.movement?.speed_kmh ?? null,
      heading: ev.movement?.heading_degrees ?? null,
      moving: ev.movement?.moving ?? null,
    },

    device: {
      battery: ev.device?.battery_level ?? null,
      charging: ev.device?.charging ?? false,
    },

    overspeed: ev.overspeed ?? false,

    // Keep everything else untouched for future use
    raw: ev,
  };
}

/**
 * Loads every file, merges, sorts by timestamp
 */
export async function loadAllEvents() {
  const lists = await Promise.all(DATA_FILES.map((file) => safeFetchJson(file)));

  const merged = lists.flat();

  merged.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  console.log(
    "✅ Loaded trip files:",
    lists.map((list, i) => `${DATA_FILES[i]} → ${list.length} events`)
  );

  console.log("✅ Total events:", merged.length);

  return merged;
}
