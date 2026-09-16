import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./ClientsAdmin.css";

/* =========================================================
   BASE URL
   ========================================================= */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.geduconnect.com/api";

const getImageUrl = (path) => {
  if (!path) return "";

  // If API already returns complete URL
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = API_BASE.replace(/\/api\/?$/, "");

  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function ClientsAdmin() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  /* =======================================================
     FETCH CLIENTS
     ======================================================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/clients");

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load clients:", err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  useEffect(() => {
    fetchData();
  }, []);

  /* =======================================================
     DELETE
     ======================================================= */

  const remove = async (id) => {
    if (!window.confirm("Delete this record?")) {
      return;
    }

    try {
      setDeleting(id);

      await api.delete(`/admin/clients/${id}`);

      await fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete record");
    } finally {
      setDeleting(null);
    }
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <div className="clients-admin-page">
        <div className="clients-loading-box">
          <div className="clients-loading-spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="clients-admin-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="clients-page-header">

        <div>
          <h2>Clients &amp; Universities</h2>

          <p className="clients-page-subtitle">
            Manage clients, partners and universities
          </p>
        </div>

        <button
          type="button"
          className="clients-btn clients-btn-primary"
          onClick={() => navigate("/clients/new")}
        >
          + Add New
        </button>

      </div>

      {/* ===================================================
          TABLE
          =================================================== */}

      <div className="clients-table-card">

        <div className="clients-table-responsive">

          <table className="clients-admin-table">

            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Type</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Order</th>
                <th className="clients-actions-column">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {/* =========================================
                  EMPTY
                  ========================================= */}

              {data.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="clients-empty-state"
                  >
                    <div className="clients-empty-icon">
                      📋
                    </div>

                    <div className="clients-empty-title">
                      No records found
                    </div>

                    <div className="clients-empty-text">
                      Add a new client or university to get
                      started.
                    </div>
                  </td>
                </tr>

              ) : (

                /* =========================================
                   DATA
                   ========================================= */

                data.map((c) => (

                  <tr key={c.id}>

                    {/* ===================================
                        LOGO
                        =================================== */}

                    <td className="clients-logo-cell">

                      {c.logo_url ? (

                        <img
                          src={getImageUrl(c.logo_url)}
                          className="client-logo"
                          alt={c.name || "Client logo"}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";

                            const placeholder =
                              e.currentTarget
                                .nextElementSibling;

                            if (placeholder) {
                              placeholder.style.display =
                                "flex";
                            }
                          }}
                        />

                      ) : null}

                      <div
                        className="client-logo-placeholder"
                        style={{
                          display: c.logo_url
                            ? "none"
                            : "flex",
                        }}
                      >
                        {c.name
                          ? c.name
                              .charAt(0)
                              .toUpperCase()
                          : "?"}
                      </div>

                    </td>

                    {/* ===================================
                        NAME
                        =================================== */}

                    <td className="clients-name-cell">

                      <div className="client-name">
                        {c.name || "—"}
                      </div>

                    </td>

                    {/* ===================================
                        TYPE
                        =================================== */}

                    <td>

                      <span className="client-type-badge">
                        {c.type || "—"}
                      </span>

                    </td>

                    {/* ===================================
                        MODE
                        =================================== */}

                    <td>

                      <span className="client-mode-badge">
                        {c.mode || "—"}
                      </span>

                    </td>

                    {/* ===================================
                        STATUS
                        =================================== */}

                    <td>

                      {Number(c.is_active) === 1 ? (

                        <span className="client-status-badge active">

                          <span className="client-status-dot"></span>

                          Active

                        </span>

                      ) : (

                        <span className="client-status-badge inactive">

                          <span className="client-status-dot"></span>

                          Inactive

                        </span>

                      )}

                    </td>

                    {/* ===================================
                        ORDER
                        =================================== */}

                    <td className="clients-order-cell">
                      {c.sort_order ?? "—"}
                    </td>

                    {/* ===================================
                        ACTIONS
                        =================================== */}

                    <td className="clients-actions-cell">

                      <button
                        type="button"
                        className="clients-btn clients-btn-success"
                        onClick={() =>
                          navigate(
                            `/clients/edit/${c.id}`
                          )
                        }
                        disabled={deleting === c.id}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="clients-btn clients-btn-danger"
                        onClick={() =>
                          remove(c.id)
                        }
                        disabled={deleting === c.id}
                      >
                        {deleting === c.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}