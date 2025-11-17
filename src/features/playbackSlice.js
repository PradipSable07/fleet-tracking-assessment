import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  speed: 1, // 1x default
  isPlaying: false,
  simTime: 0, // epoch ms in simulation time (updated by simulator)
  processedCount: 0,
};

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    setSpeed(state, action) {
      state.speed = action.payload;
    },
    setPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setSimTime(state, action) {
      state.simTime = action.payload;
    },
    setProcessedCount(state, action) {
      state.processedCount = action.payload;
    },
  },
});

export const { setSpeed, setPlaying, setSimTime, setProcessedCount } = playbackSlice.actions;
export default playbackSlice.reducer;
