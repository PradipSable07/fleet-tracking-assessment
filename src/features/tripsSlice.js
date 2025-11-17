import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tripIndex: [],       // static list of available trip files
  selectedTripId: null,
  meta: {},            // dynamic metadata { tripId : { tripId, vehicleId, file } }
};

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    // Load the 5 trip entries: [{ tripId, file }, ...]
    setTripIndex(state, action) {
      state.tripIndex = action.payload;
    },

    // UI-selected trip
    selectTrip(state, action) {
      state.selectedTripId = action.payload;
    },

    // Save metadata extracted from events
    registerTrip(state, action) {
      const t = action.payload;
      state.meta[t.tripId] = {
        ...state.meta[t.tripId],
        ...t
      };
    },

    // Clear metadata when simulation resets
    resetTrips(state) {
      state.meta = {};
      state.selectedTripId = null;
    }
  },
});

export const {
  setTripIndex,
  selectTrip,
  registerTrip,
  resetTrips
} = tripsSlice.actions;

export default tripsSlice.reducer;
