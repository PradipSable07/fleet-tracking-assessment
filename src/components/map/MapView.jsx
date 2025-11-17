import React, { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";

import VehicleMarker from "./VehicleMarker";
import TripPolyline from "./TripPolyline";

export default function MapView() {
  const latestByTrip = useSelector((s) => s.events.latestByTrip);
  const meta = useSelector((s) => s.trips.meta);                // dynamic metadata
  const selectedTripId = useSelector((s) => s.trips.selectedTripId);

  const activeEvents = useMemo(() => Object.values(latestByTrip), [latestByTrip]);

  // Center map on the first available event OR fallback to USA
  const center = activeEvents.length
    ? [activeEvents[0].lat, activeEvents[0].lng]
    : [39.5, -98.35];

  return (
    <div className="map-panel card">
      <div className="map-container" style={{ height: "100%" }}>
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* --- Draw polyline ONLY for selected trip --- */}
          {selectedTripId && (
            <TripPolyline tripId={selectedTripId} />
          )}

          {/* --- Add vehicle markers for all active trips --- */}
          {activeEvents.map((ev) => (
            <VehicleMarker key={ev.tripId} event={ev} />
          ))}

        </MapContainer>
      </div>
    </div>
  );
}
