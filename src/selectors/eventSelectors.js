import { createSelector } from "@reduxjs/toolkit";

export const selectEventHistory = (state) => state.events.history;

// ------------------------------------------------------------------
// MEMOIZED: history for a specific trip
// ------------------------------------------------------------------
export const makeSelectTripHistory = () =>
  createSelector(
    [selectEventHistory, (_, tripId) => tripId],
    (history, tripId) => history.filter((h) => h.tripId === tripId)
  );

// ------------------------------------------------------------------
// MEMOIZED: last N events
// ------------------------------------------------------------------
export const makeSelectRecentEvents = (N = 200) =>
  createSelector(
    [makeSelectTripHistory(), (_, __, N) => N],
    (tripHistory, N) => tripHistory.slice(-N)
  );

// ------------------------------------------------------------------
// MEMOIZED: only fuel events
// ------------------------------------------------------------------
export const makeSelectFuelEvents = (N = 200) =>
  createSelector(
    [makeSelectTripHistory()],
    (tripHistory) =>
      tripHistory.filter((h) => h.fuel != null).slice(-N)
  );
