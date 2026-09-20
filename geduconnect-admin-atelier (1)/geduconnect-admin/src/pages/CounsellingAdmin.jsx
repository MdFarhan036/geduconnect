import { useEffect, useState } from "react";
import api from "../api";
import "./CounsellingAdmin.css";

export default function CounsellingAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  /* ================= LOAD REQUESTS ================= */

  const loadRequests = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await api.get(
        "/admin/counselling",
        { params }
      );

      const data = response.data;

      setRequests(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load counselling requests:",
        error
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  /* ================= SEARCH ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRequests();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await api.put(
        `/admin/counselling/${id}/status`,
        { status }
      );

      setRequests((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      );

      if (
        selectedRequest &&
        selectedRequest.id === id
      ) {
        setSelectedRequest((prev) => ({
          ...prev,
          status,
        }));
      }
    } catch (error) {
      console.error(
        "Failed to update status:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= STATUS CLASS ================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "NEW":
        return "status-new";

      case "CONTACTED":
        return "status-contacted";

      case "FOLLOW_UP":
        return "status-followup";

      case "CONVERTED":
        return "status-converted";

      case "CLOSED":
        return "status-closed";

      default:
        return "";
    }
  };

  /* ================= FORMAT DATE ================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* ================= STATS ================= */

  const total = requests.length;

  const newCount = requests.filter(
    (item) => item.status === "NEW"
  ).length;

  const contactedCount = requests.filter(
    (item) => item.status === "CONTACTED"
  ).length;

  const followUpCount = requests.filter(
    (item) => item.status === "FOLLOW_UP"
  ).length;

  const convertedCount = requests.filter(
    (item) => item.status === "CONVERTED"
  ).length;

  /* ================= RENDER ================= */

  return (
    <div className="counselling-admin">

      {/* ================= HEADER ================= */}

      <div className="counselling-admin-header">

        <div>
          <span className="admin-eyebrow">
            LEAD MANAGEMENT
          </span>

          <h1>
            Counselling Requests
          </h1>

          <p>
            Manage and follow up with students
            requesting free counselling.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={loadRequests}
          disabled={loading}
        >
          ↻ Refresh
        </button>

      </div>

      {/* ================= STATS ================= */}

      <div className="counselling-stats">

        <div className="counselling-stat">
          <div className="stat-icon">📋</div>
          <div>
            <span>Total Requests</span>
            <strong>{total}</strong>
          </div>
        </div>

        <div className="counselling-stat">
          <div className="stat-icon">🆕</div>
          <div>
            <span>New</span>
            <strong>{newCount}</strong>
          </div>
        </div>

        <div className="counselling-stat">
          <div className="stat-icon">📞</div>
          <div>
            <span>Contacted</span>
            <strong>{contactedCount}</strong>
          </div>
        </div>

        <div className="counselling-stat">
          <div className="stat-icon">🔄</div>
          <div>
            <span>Follow Up</span>
            <strong>{followUpCount}</strong>
          </div>
        </div>

        <div className="counselling-stat">
          <div className="stat-icon">✓</div>
          <div>
            <span>Converted</span>
            <strong>{convertedCount}</strong>
          </div>
        </div>

      </div>

      {/* ================= FILTERS ================= */}

      <div className="counselling-filters">

        <div className="counselling-search">
          <span>🔎</span>

          <input
            type="text"
            placeholder="Search name, mobile, email, university..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="">
            All Status
          </option>

          <option value="NEW">
            New
          </option>

          <option value="CONTACTED">
            Contacted
          </option>

          <option value="FOLLOW_UP">
            Follow Up
          </option>

          <option value="CONVERTED">
            Converted
          </option>

          <option value="CLOSED">
            Closed
          </option>
        </select>

      </div>

      {/* ================= TABLE ================= */}

      <div className="counselling-table-card">

        {loading ? (
          <div className="counselling-loading">
            <div className="table-spinner" />
            <p>Loading counselling requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="counselling-empty">
            <div className="empty-icon">
              🎓
            </div>

            <h3>
              No counselling requests found
            </h3>

            <p>
              New counselling requests will
              appear here.
            </p>
          </div>
        ) : (
          <div className="counselling-table-wrapper">

            <table className="counselling-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>University</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {requests.map((request) => (
                  <tr key={request.id}>

                    {/* STUDENT */}

                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {request.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>

                        <div>
                          <strong>
                            {request.name}
                          </strong>

                          <small>
                            #{request.id}
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td>
                      <div className="contact-cell">

                        <a
                          href={`tel:${request.mobile}`}
                        >
                          📱 {request.mobile}
                        </a>

                        {request.email && (
                          <a
                            href={`mailto:${request.email}`}
                          >
                            ✉️ {request.email}
                          </a>
                        )}

                      </div>
                    </td>

                    {/* UNIVERSITY */}

                    <td>
                      <div className="university-cell">
                        <span>🏛️</span>

                        <strong>
                          {request.university_name ||
                            "-"}
                        </strong>
                      </div>
                    </td>

                    {/* COURSE */}

                    <td>
                      <span className="course-name">
                        {request.course_name ||
                          "-"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <select
                        className={`status-select ${getStatusClass(
                          request.status
                        )}`}
                        value={
                          request.status || "NEW"
                        }
                        disabled={
                          updatingId ===
                          request.id
                        }
                        onChange={(e) =>
                          updateStatus(
                            request.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="NEW">
                          New
                        </option>

                        <option value="CONTACTED">
                          Contacted
                        </option>

                        <option value="FOLLOW_UP">
                          Follow Up
                        </option>

                        <option value="CONVERTED">
                          Converted
                        </option>

                        <option value="CLOSED">
                          Closed
                        </option>
                      </select>
                    </td>

                    {/* DATE */}

                    <td>
                      <span className="request-date">
                        {formatDate(
                          request.created_at
                        )}
                      </span>
                    </td>

                    {/* ACTION */}

                    <td>
                      <button
                        className="view-btn"
                        type="button"
                        onClick={() =>
                          setSelectedRequest(
                            request
                          )
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ================= DETAILS MODAL ================= */}

      {selectedRequest && (
        <div
          className="request-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              setSelectedRequest(null);
            }
          }}
        >

          <div className="request-modal">

            <button
              className="request-modal-close"
              type="button"
              onClick={() =>
                setSelectedRequest(null)
              }
            >
              ×
            </button>

            <div className="request-modal-header">

              <div className="modal-avatar">
                {selectedRequest.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>
                <span>
                  COUNSELLING REQUEST #
                  {selectedRequest.id}
                </span>

                <h2>
                  {selectedRequest.name}
                </h2>
              </div>

            </div>

            <div className="request-details">

              <div className="detail-item">
                <span>📱 Mobile</span>
                <a
                  href={`tel:${selectedRequest.mobile}`}
                >
                  {selectedRequest.mobile}
                </a>
              </div>

              <div className="detail-item">
                <span>✉️ Email</span>

                {selectedRequest.email ? (
                  <a
                    href={`mailto:${selectedRequest.email}`}
                  >
                    {selectedRequest.email}
                  </a>
                ) : (
                  <strong>-</strong>
                )}
              </div>

              <div className="detail-item">
                <span>🏛️ University</span>
                <strong>
                  {selectedRequest.university_name}
                </strong>
              </div>

              <div className="detail-item">
                <span>📚 Course</span>
                <strong>
                  {selectedRequest.course_name}
                </strong>
              </div>

              <div className="detail-item">
                <span>📅 Received</span>
                <strong>
                  {formatDate(
                    selectedRequest.created_at
                  )}
                </strong>
              </div>

              <div className="detail-item">
                <span>📌 Status</span>

                <select
                  className={`status-select ${getStatusClass(
                    selectedRequest.status
                  )}`}
                  value={
                    selectedRequest.status
                  }
                  disabled={
                    updatingId ===
                    selectedRequest.id
                  }
                  onChange={(e) =>
                    updateStatus(
                      selectedRequest.id,
                      e.target.value
                    )
                  }
                >
                  <option value="NEW">
                    New
                  </option>

                  <option value="CONTACTED">
                    Contacted
                  </option>

                  <option value="FOLLOW_UP">
                    Follow Up
                  </option>

                  <option value="CONVERTED">
                    Converted
                  </option>

                  <option value="CLOSED">
                    Closed
                  </option>
                </select>
              </div>

            </div>

            {selectedRequest.message && (
              <div className="request-message">

                <span>
                  Student Message
                </span>

                <p>
                  {selectedRequest.message}
                </p>

              </div>
            )}

            <div className="request-modal-actions">

              <a
                href={`tel:${selectedRequest.mobile}`}
                className="call-btn"
              >
                📞 Call Student
              </a>

              {selectedRequest.email && (
                <a
                  href={`mailto:${selectedRequest.email}`}
                  className="email-btn"
                >
                  ✉️ Send Email
                </a>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
