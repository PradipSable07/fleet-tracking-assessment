import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./index.css";
import { loadAllEvents } from "./apis/loadTrips";
import { registerTrips } from "./features/tripsSlice";
import { setPlaying, setProcessedCount } from "./features/playbackSlice";
import { startSimulation } from "./apis/eventSimulator";

import SpeedChart from "./components/charts/SpeedChart";
import FuelChart from "./components/charts/FuelChart";
import FleetStats from "./components/ui/FleetStats";
import PlaybackControls from "./components/ui/PlaybackControls";
import MapView from "./components/map/MapView";
import TripList from "./components/ui/TripList";

export default function App() {
  const dispatch = useDispatch();
  const playback = useSelector((s) => s.playback);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const simRef = useRef(null);

  // ---------------------------------------------------------------------------
  // LOAD EVENTS + HANDLE ERRORS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const all = await loadAllEvents(); // can throw JSON / Network errors

        if (!Array.isArray(all)) {
          throw new Error("Invalid events format: Expected an array.");
        }

        setEvents(all);

        // derive trip metadata
        const tripMeta = {};
        for (const e of all) {
          const tid = e.trip_id ?? e.tripId;
          const vid = e.vehicle_id ?? e.vehicleId;

          if (!tid || !vid) continue;

          if (!tripMeta[tid]) {
            tripMeta[tid] = { tripId: tid, vehicleId: vid };
          }
        }
        console.log(tripMeta,"")
        dispatch(registerTrips(Object.values(tripMeta)));
        dispatch(setProcessedCount(0));
      } catch (err) {
        console.error("❌ EVENT LOAD ERROR:", err);
        setErrorMessage(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // SIMULATION HANDLERS
  // ---------------------------------------------------------------------------
  const getPlaybackState = () => {
    return {
      speed: playback.speed || 1,
      isPlaying: playback.isPlaying,
    };
  };

  const handleStart = () => {
    try {
      if (simRef.current) return;

      if (!events.length) {
        setErrorMessage("No events available to simulate.");
        return;
      }

      dispatch(setPlaying(true));

      simRef.current = startSimulation(events, dispatch, getPlaybackState, {
        batchSize: 400,
        tickMs: 500,
      });
    } catch (err) {
      console.error("❌ SIMULATION START ERROR:", err);
      setErrorMessage("Failed to start simulation.");
    }
  };

  const handleStop = () => {
    try {
      if (simRef.current?.stop) {
        simRef.current.stop();
      }
      simRef.current = null;
    } catch (err) {
      console.error("❌ SIMULATION STOP ERROR:", err);
      setErrorMessage("Failed to stop simulation.");
    }

    dispatch(setPlaying(false));
  };

  const handleReset = () => {
    try {
      handleStop();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setErrorMessage("Reset failed.");
    }
  };

  useEffect(() => {
    if (playback.isPlaying) {
      handleStart();
    } else {
      handleStop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback.isPlaying]);

  // first trip for charts
const trips = useSelector((s) => s.trips.list);
const latest = useSelector((s) => s.events.latestByTrip);

const firstTripId = Object.keys(trips)[0] || Object.keys(latest)[0];


  // ---------------------------------------------------------------------------
  // UI STATES: loading, error, normal
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div style={{ padding: 40, fontSize: 20 }}>
        ⏳ Loading fleet events... please wait...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ padding: 40 }}>
        <h2 style={{ color: "red" }}>⚠ Error</h2>
        <p>{errorMessage}</p>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 14px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // NORMAL UI
  // ---------------------------------------------------------------------------

  return (
    <div className="app-wrapper">
      <div className="header">
        <div>
          <h1 style={{ margin: 0 }}>Fleet Tracking Dashboard</h1>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Simulated real-time playback — Leaflet + Redux + Recharts
          </div>
        </div>

        <PlaybackControls
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
        />
      </div>

      <div className="dashboard">
        <div>
          <FleetStats />
          <MapView />
        </div>

        <div className="side-panel">
          <TripList />

          {firstTripId && <SpeedChart tripId={firstTripId} />}
          {firstTripId && <FuelChart tripId={firstTripId} />}
        </div>
      </div>
    </div>
  );
}
