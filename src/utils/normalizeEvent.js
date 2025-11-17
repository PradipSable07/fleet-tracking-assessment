export function normalizeEvent(e) {
  return {
    id: e.event_id,
    type: e.event_type,
    ts: new Date(e.timestamp).getTime(),

    tripId: e.trip_id,
    vehicleId: e.vehicle_id,

    lat: e.location?.lat ?? 0,
    lng: e.location?.lng ?? 0,

    speed: e.movement?.speed_kmh ?? null,
    fuel: e.telemetry?.fuel_level_percent ?? null,
    battery: e.device?.battery_level ?? null,

    raw: e
  };
}


export function flattenJson(data) {
  // If data is a single event
  if (!Array.isArray(data)) return [];

  // Case 1: [ [events], [events] ]
  if (Array.isArray(data[0]) && !data[0].event_id) {
    return data.flat();
  }

  // Case 2: [ {meta}, [events] ]
  if (Array.isArray(data[1]) && Array.isArray(data[1])) {
    return data[1];
  }

  // Case 3: correct shape already
  return data;
}
