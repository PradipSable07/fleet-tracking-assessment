import React, { useMemo } from "react";
import { Polyline } from "react-leaflet";
import { useSelector } from "react-redux";
import { makeSelectRecentEvents } from "../../selectors/eventSelectors";

export default function TripPolyline({ tripId }) {
  const selectRecent = useMemo(() => makeSelectRecentEvents(300), []);
  const history = useSelector((state) => selectRecent(state, tripId));

  const positions = useMemo(
    () => history.map((h) => [h.lat, h.lng]),
    [history]
  );

  if (positions.length < 2) return null;

  return (
    <Polyline
      positions={positions}
      pathOptions={{ color: "#2563EB", weight: 3, opacity: 0.75 }}
    />
  );
}
