import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // meta about known trips
  list: {}, // { tripId: { tripId, vehicleId, planned_distance_km, ... } }
};

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    registerTrip(state, action) {
      const t = action.payload;
      state.list[t.tripId] = { ...t };
    },
    registerTrips(state, action) {
      const arr = action.payload;
      arr.forEach(t => {
        state.list[t.tripId] = { ...t };
      });
    },
  },
});

export const { registerTrip, registerTrips } = tripsSlice.actions;
export default tripsSlice.reducer;
