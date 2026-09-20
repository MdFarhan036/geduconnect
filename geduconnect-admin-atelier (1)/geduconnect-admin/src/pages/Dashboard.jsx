import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const statusMap = {};
  stats.status.forEach(s => (statusMap[s.status] = s.count));

  return (
    <div className="premium-dashboard">
      <h2>Dashboard</h2>

      {/* Summary cards */}
      <div className="dashboard-cards" style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <Card title="Total Enquiries" value={stats.total} />
        <Card title="Today" value={stats.today} />
        <Card title="New" value={statusMap.new || 0} />
        <Card title="Contacted" value={statusMap.contacted || 0} />
        <Card title="Closed" value={statusMap.closed || 0} />
      </div>

      {/* 7-day list (chart-ready) */}
      <h3>Last 7 Days</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Enquiries</th>
          </tr>
        </thead>
        <tbody>
          {stats.last7Days.map(d => (
            <tr key={d.date}>
              <td>{d.date}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="dashboard-card"
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 8,
        minWidth: 150,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      <h4 style={{ marginBottom: 10 }}>{title}</h4>
      <strong style={{ fontSize: 22 }}>{value}</strong>
    </div>
  );
}
