import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

export default function Enquiries() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/enquiries/list", {
        params: { page, limit, search, status }
      });

      setData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotalRecords(res.data.pagination.total);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, status]);

  const updateStatus = async (id, newStatus) => {
    await api.put(`/enquiries/${id}/status`, { status: newStatus });
    fetchData();
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    await api.delete(`/enquiries/${id}`);
    fetchData();
  };

  const statusBadge = (status) => {
    const colors = {
      new: "#f59e0b",
      contacted: "#3b82f6",
      closed: "#10b981"
    };

    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: 6,
          background: colors[status] || "#999",
          color: "#fff",
          fontSize: 12,
          textTransform: "capitalize"
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="admin-page">
      <h2>Enquiries</h2>

      {/* ================= SUMMARY ================= */}
      <div style={{ marginBottom: 20 }}>
        <strong>Total Records:</strong> {totalRecords}
      </div>

      {/* ================= FILTERS ================= */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Search name / email / phone"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
                <th width="180">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan="7" align="center">
                    No records found
                  </td>
                </tr>
              )}

              {data.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.phone}</td>
                  <td>{e.service_name || "General"}</td>
                  <td>{statusBadge(e.status)}</td>
                  <td>
                    {new Date(e.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button onClick={() => setSelected(e)}>
                      View
                    </button>

                    <select
                      value={e.status}
                      onChange={(ev) =>
                        updateStatus(e.id, ev.target.value)
                      }
                      style={{ marginLeft: 8 }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>

                    <button
                      style={{ color: "red", marginLeft: 8 }}
                      onClick={() => deleteEnquiry(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= PAGINATION ================= */}
          <div style={{ marginTop: 20 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>

            <span style={{ margin: "0 15px" }}>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ================= VIEW MODAL ================= */}
      {selected && (
        <Modal
          open={true}
          title="Enquiry Details"
          onClose={() => setSelected(null)}
        >
          <p><strong>Name:</strong> {selected.name}</p>
          <p><strong>Email:</strong> {selected.email}</p>
          <p><strong>Phone:</strong> {selected.phone}</p>
          <p><strong>Service:</strong> {selected.service_name || "General"}</p>
          <p><strong>Status:</strong> {selected.status}</p>
          <p><strong>Date:</strong> {new Date(selected.created_at).toLocaleString()}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>{selected.message}</p>
        </Modal>
      )}
    </div>
  );
}
