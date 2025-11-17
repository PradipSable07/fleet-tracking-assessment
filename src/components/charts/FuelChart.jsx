import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { makeSelectFuelEvents } from "../../selectors/eventSelectors";

export default function FuelChart({ tripId }) {
  const selectFuelEvents = useMemo(() => makeSelectFuelEvents(200), []);
  const data = useSelector((state) => selectFuelEvents(state, tripId));

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ts: new Date(d.ts).toLocaleTimeString(),
        fuel: d.fuel,
      })),
    [data]
  );

  if (chartData.length === 0) return null;

  return (
    <div className="card">
      <h4 style={{ margin: 0 }}>Fuel (recent)</h4>
      <div style={{ width: "100%", height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="ts" hide />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="fuel" stroke="#059669" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
