import React from "react";
import { useSelector } from "react-redux";

export default function FleetStats() {
	const meta = useSelector((s) => s.trips.meta);
	console.log("latestByTrip Dta", meta);
	// dynamic trip metadata
	const latestByTrip = useSelector((s) => s.events.latestByTrip);
	console.log("latestByTrip Dta", latestByTrip);

	const totalTrips = Object.keys(meta).length;
	console.log("totalTrips Dta", totalTrips);
	const inProgress = Object.values(latestByTrip).filter(
		(t) => t && t.type !== "trip_completed" && t.type !== "trip_cancelled"
	).length;

	const completed = Object.values(latestByTrip).filter(
		(t) => t && t.type === "trip_completed"
	).length;

	const cancelled = Object.values(latestByTrip).filter(
		(t) => t && t.type === "trip_cancelled"
	).length;

	const overspeed = Object.values(latestByTrip).filter(
		(t) => t?.speed > 100
	).length;

	return (
		<div className='card'>
			<h3 style={{ marginTop: 0 }}>Fleet Summary</h3>

			<div style={{ display: "flex", gap: 12, marginTop: 8 }}>
				<div>
					<div style={{ fontSize: 12 }}>Total</div>
					<div style={{ fontWeight: 700 }}>{totalTrips}</div>
				</div>

				<div>
					<div style={{ fontSize: 12 }}>In Progress</div>
					<div style={{ fontWeight: 700 }}>{inProgress}</div>
				</div>

				<div>
					<div style={{ fontSize: 12 }}>Completed</div>
					<div style={{ fontWeight: 700 }}>{completed}</div>
				</div>

				<div>
					<div style={{ fontSize: 12 }}>Cancelled</div>
					<div style={{ fontWeight: 700 }}>{cancelled}</div>
				</div>

				<div>
					<div style={{ fontSize: 12 }}>Overspeed</div>
					<div style={{ fontWeight: 700 }}>{overspeed}</div>
				</div>
			</div>
		</div>
	);
}
