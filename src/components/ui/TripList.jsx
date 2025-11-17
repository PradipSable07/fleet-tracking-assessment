export default function TripList({ trips, selected, onSelect }) {
  return (
    <div className="card">
      <h4>Trips</h4>

      {trips.map(t => (
        <div
          key={t.tripId}
          onClick={() => onSelect(t.tripId)}
          style={{
            padding: 8,
            cursor: "pointer",
            background: selected === t.tripId ? "#e5f0ff" : "white"
          }}
        >
          {t.tripId}
        </div>
      ))}
    </div>
  );
}
