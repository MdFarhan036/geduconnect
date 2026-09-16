import { useEffect, useState } from "react";
import api from "../api";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function JobApplicationsAdmin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/admin/job-applications").then(res => {
      setData(res.data || []);
    });
  }, []);

  return (
    <div className="highlight-admin">
      <h2>Job Applications</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Resume</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map(app => (
            <tr key={app.id}>
              <td>{app.position}</td>
              <td>{app.name}</td>
              <td>{app.email}</td>
              <td>{app.phone}</td>
              <td>
                {app.resume_url && (
                  <a
                    href={`${BASE_URL}${app.resume_url}`}
                    target="_blank"
                  >
                    View
                  </a>
                )}
              </td>
              <td>
                {new Date(app.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
