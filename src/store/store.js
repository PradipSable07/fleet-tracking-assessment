import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../features/eventsSlice";
import tripsReducer from "../features/tripsSlice";
import playbackReducer from "../features/playbackSlice";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    trips: tripsReducer,
    playback: playbackReducer,
  },
});
