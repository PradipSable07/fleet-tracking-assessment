import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useEventSimulation } from "../hooks/useEventSimulation";
import {useTripsIndex} from "../apis/useTripIndex";
import {useTripEvents} from "../apis/useTripEvents";
import TripList from "../components/ui/TripList";
import MapView from "../components/map/MapView";
import SpeedChart from "../components/charts/SpeedChart";
import FuelChart from "../components/charts/FuelChart";
import FleetStats from "../components/ui/FleetStats";

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
