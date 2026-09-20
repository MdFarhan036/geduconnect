import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const BASE_URL = API_BASE.replace("/api", "");

export default function ServicesAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTERS */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/services");

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= DELETE ================= */

  const remove = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await api.delete(`/admin/services/${id}`);

      setData((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  /* ================= FILTERED DATA ================= */

  const filteredData = useMemo(() => {
    return data.filter((s) => {
      const matchesSearch =
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.slug?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : Number(s.is_active) === Number(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  /* ================= HELPERS ================= */

  const getImageUrl = (path) => {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    return `${BASE_URL}${path}`;
  };

  /* ================= UI ================= */

  return (
    <div className="highlight-admin">
      {/* ================= HEADER ================= */}

      <div className="page-header">
        <div>
          <h2>Services</h2>
          <p className="page-subtitle">
            Manage all services and banners
          </p>
        </div>

        <button
          className="btn primary"
          onClick={() => navigate("/admin/services/new")}
        >
          + Add Service
        </button>
      </div>

      {/* ================= FILTERS ================= */}

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Card Icon</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Order</th>
              <th>Banners</th>
              <th>Status</th>
              <th width="360">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No services found
                </td>
              </tr>
            ) : (
              filteredData.map((s, index) => {
                const bannerCount = Number(s.banner_count || 0);

                return (
                  <tr key={s.id}>
                    <td>{index + 1}</td>

                    {/* ICON */}
                    <td>
                      {s.icon_url ? (
                        <img
                          src={getImageUrl(s.icon_url)}
                          alt={s.title}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "contain",
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            padding: 5,
                            background: "#fff",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#999" }}>
                          No Icon
                        </span>
                      )}
                    </td>

                    {/* TITLE */}
                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {s.title}
                      </div>
                    </td>

                    {/* SLUG */}
                    <td>
                      <code>{s.slug}</code>
                    </td>

                    {/* ORDER */}
                    <td>{s.sort_order || 0}</td>

                    {/* BANNERS */}
                    <td>
                      <span
                        style={{
                          background:
                            bannerCount > 0
                              ? "#e6f4ea"
                              : "#fdecea",

                          color:
                            bannerCount > 0
                              ? "#137333"
                              : "#c5221f",

                          padding: "5px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          display: "inline-block",
                          minWidth: 90,
                          textAlign: "center",
                        }}
                      >
                        {bannerCount} Banner
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={
                          Number(s.is_active) === 1
                            ? "status active"
                            : "status inactive"
                        }
                      >
                        {Number(s.is_active) === 1
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="actions">
                      <button
                        className="btn info"
                        disabled={Number(s.is_active) !== 1}
                        style={{
                          opacity:
                            Number(s.is_active) !== 1 ? 0.5 : 1,
                        }}
                        onClick={() =>
                          window.open(
                            `/services/${s.slug}`,
                            "_blank"
                          )
                        }
                      >
                        View
                      </button>

                      <button
                        className="btn success"
                        onClick={() =>
                          navigate(`/services/edit/${s.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn warning"
                        onClick={() =>
                          navigate(`/services/${s.id}/banners`)
                        }
                      >
                        Banners
                      </button>

                      <button
                        className="btn danger"
                        onClick={() => remove(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}