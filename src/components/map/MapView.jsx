import React, { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";
import VehicleMarker from "./VehicleMarker";
import TripPolyline from "./TripPolyline";

export default function MapView() {
  const latestByTrip = useSelector((s) => s.events.latestByTrip);
  const trips = useSelector((s) => s.trips.list);

  const tripArr = useMemo(() => Object.values(latestByTrip), [latestByTrip]);

  // center map on first available point or USA center as fallback
  const center = tripArr.length > 0 ? [tripArr[0].lat, tripArr[0].lng] : [39.5, -98.35];

  return (
    <div className="map-panel card">
      <div style={{ height: "100%" }} className="map-container">
        <MapContainer center={center} zoom={4} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* polylines require full path - for demo we build paths from history */}
          {Object.keys(trips).map((tripId) => (
            <TripPolyline key={tripId} tripId={tripId} />
          ))}

          {tripArr.map((ev) => (
            <VehicleMarker key={ev.tripId} event={ev} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
