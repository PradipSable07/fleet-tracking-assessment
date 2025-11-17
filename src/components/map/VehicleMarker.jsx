import React, { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

/**
 * Simple moving marker: we avoid re-creating the icon each render.
 * Position update occurs via Leaflet marker ref setLatLng for smoother updates.
 */

function createDivIcon(color = "blue") {
  return L.divIcon({
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white"></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function VehicleMarker({ event }) {
  const markerRef = useRef(null);
  const map = useMap();

  const color = event.type === "trip_cancelled" ? "gray" : (event.speed && event.speed > 100 ? "red" : "dodgerblue");
  const icon = createDivIcon(color);

  useEffect(() => {
    if (!markerRef.current) return;
    const marker = markerRef.current;
    const latlng = L.latLng(event.lat, event.lng);
    marker.setLatLng(latlng);
  }, [event.lat, event.lng]);

  // if user clicks marker, pan map a bit
  const onOpen = () => {
    map.panTo([event.lat, event.lng]);
  };

  return (
    <Marker
      position={[event.lat, event.lng]}
      icon={icon}
      ref={(m) => {
        markerRef.current = m;
      }}
      eventHandlers={{ popupopen: onOpen }}
    >
      <Popup>
        <div style={{ fontSize: 13 }}>
          <div><b>Trip:</b> {event.tripId}</div>
          <div><b>Event:</b> {event.type}</div>
          {event.speed != null && <div><b>Speed:</b> {event.speed} km/h</div>}
          {event.fuel != null && <div><b>Fuel:</b> {event.fuel}%</div>}
          {event.battery != null && <div><b>Battery:</b> {event.battery}%</div>}
        </div>
      </Popup>
    </Marker>
  );
}
