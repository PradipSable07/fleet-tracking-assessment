import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTripsIndex } from "../../features/trips/useTripsIndex";
import { useTripEvents } from "../../features/trips/useTripEvents";
import { useEventSimulation } from "../../features/events/useEventSimulation";

import FleetStats from "../../modules/fleet/FleetStats";
import TripList from "../../modules/fleet/TripList";
import MapView from "../../modules/map/MapView";
import SpeedChart from "../../modules/charts/SpeedChart";
import FuelChart from "../../modules/charts/FuelChart";

export default function Dashboard() {
  const { tripIndex } = useTripsIndex();
  const [selectedTripId, setSelectedTripId] = useState(null);

  const playback = useSelector(s => s.playback);
  const dispatch = useDispatch();

  const activeTrip = tripIndex.find(t => t.tripId === selectedTripId);
  const events = useTripEvents(activeTrip?.file);

  const sim = useEventSimulation(events, dispatch, playback);

  return (
    <div className="dashboard">
      <TripList
        trips={tripIndex}
        selected={selectedTripId}
        onSelect={setSelectedTripId}
      />

      <FleetStats />

      <MapView />

      {selectedTripId && <SpeedChart tripId={selectedTripId} />}
      {selectedTripId && <FuelChart tripId={selectedTripId} />}
    </div>
  );
}
