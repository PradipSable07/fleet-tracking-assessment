import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { makeSelectRecentEvents } from "../../selectors/eventSelectors";

export default function SpeedChart({ tripId }) {
  const selectRecentEvents = useMemo(() => makeSelectRecentEvents(200), []);
  const data = useSelector((state) => selectRecentEvents(state, tripId));

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ts: new Date(d.ts).toLocaleTimeString(),
        speed: d.speed ?? 0,
      })),
    [data]
  );

  return (
    <div className="card">
      <h4 style={{ margin: 0 }}>Speed (recent)</h4>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="ts" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="speed" stroke="#2563EB" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
