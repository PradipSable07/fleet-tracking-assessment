import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSpeed, setPlaying } from "../../features/playbackSlice";

/**
 * Playback controls are hooked to global state. Starting/stopping simulation
 * is handled in App.jsx which calls startSimulation/stopSimulation.
 */

export default function PlaybackControls({ onStart, onStop, onReset }) {
  const dispatch = useDispatch();
  const playback = useSelector((s) => s.playback);

  const togglePlay = useCallback(() => {
    const next = !playback.isPlaying;
    dispatch(setPlaying(next));
    if (next) onStart?.();
    else onStop?.();
  }, [dispatch, playback.isPlaying, onStart, onStop]);

  const changeSpeed = (v) => {
    dispatch(setSpeed(Number(v)));
  };

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="controls">
          <button onClick={togglePlay} style={{ padding: "6px 10px" }}>{playback.isPlaying ? "Pause" : "Play"}</button>
          <button onClick={() => { dispatch(setPlaying(false)); onReset?.(); }} style={{ padding: "6px 10px" }}>Reset</button>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontSize: 13 }}>Speed</label>
          <select value={playback.speed} onChange={(e) => changeSpeed(e.target.value)}>
            <option value={1}>1x</option>
            <option value={5}>5x</option>
            <option value={10}>10x</option>
            <option value={50}>50x</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Processed events: {useSelector((s) => s.playback.processedCount)}</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Simulation time: {new Date(useSelector((s) => s.playback.simTime) || Date.now()).toLocaleString()}</div>
      </div>
    </div>
  );
}
