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
