import { createSlice } from "@reduxjs/toolkit";

/**
 * events history kept in memory (history array).
 * latestByTrip stores the last event per trip for quick map read.
 */

const initialState = {
  latestByTrip: {}, // tripId -> event object
  history: [], // all events processed (append-only)
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    pushEventBatch(state, action) {
      const batch = action.payload;
      for (const e of batch) {
        const normalized = {
          id: e.event_id ?? e.id ?? `${e.trip_id}_${e.timestamp}`,
          tripId: e.trip_id ?? e.tripId,
          ts: new Date(e.timestamp ?? e.ts).getTime(),
          lat: e.location?.lat ?? (e.lat || 0),
          lng: e.location?.lng ?? (e.lng || 0),
          type: e.event_type ?? e.type,
          speed: e.movement?.speed_kmh ?? e.speed,
          fuel: e.telemetry?.fuel_level_percent ?? e.fuel,
          battery: e.device?.battery_level ?? e.battery,
          raw: e,
        };
        state.latestByTrip[normalized.tripId] = normalized;
        state.history.push(normalized);
      }
      // optional cap on history size (avoid unlimited growth)
      if (state.history.length > 50000) {
        state.history.splice(0, state.history.length - 50000);
      }
    },
    resetEvents(state) {
      state.latestByTrip = {};
      state.history = [];
    },
  },
});

export const { pushEventBatch, resetEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
