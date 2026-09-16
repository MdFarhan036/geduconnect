import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const emptyForm = {
  label: "",
  value: "",
  is_active: 1
};

export default function HighlightsAdmin() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* FETCH */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/highlights");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load highlights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* OPEN */
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      label: row.label || "",
      value: row.value || "",
      is_active: row.is_active ?? 1
    });
    setEditingId(row.id);
    setOpen(true);
  };

  /* SAVE */
  const save = async () => {
    if (!form.label.trim() || form.value === "") {
      alert("Label and value are required");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/highlights/${editingId}`, form);
      } else {
        await api.post("/admin/highlights", form);
      }

      setOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save highlight");
    }
  };

  /* DELETE */
  const remove = async (id) => {
    if (!window.confirm("Delete this highlight?")) return;

    try {
      await api.delete(`/admin/highlights/${id}`);
      setData(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete highlight");
    }
  };

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>Highlights</h2>
        <button className="btn primary" onClick={openAdd}>
          + Add Highlight
        </button>
      </div>

      {loading && <div>Loading...</div>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Value</th>
            <th>Label</th>
            <th>Status</th>
            <th width="150">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && !loading && (
            <tr>
              <td colSpan="4" align="center">
                No records
              </td>
            </tr>
          )}

          {data.map(item => (
            <tr key={item.id}>
              <td>{item.value}</td>
              <td>{item.label}</td>
              <td>{item.is_active ? "Active" : "Inactive"}</td>
              <td className="actions">
                <button
                  className="btn success"
                  onClick={() => openEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn danger"
                  onClick={() => remove(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={open}
        title={editingId ? "Edit Highlight" : "Add Highlight"}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn primary" onClick={save}>
              Save
            </button>
          </>
        }
      >
        <div className="form-group">
          <label>Value (Number)</label>
          <input
            value={form.value}
            onChange={e =>
              setForm({ ...form, value: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Label (Text below number)</label>
          <input
            value={form.label}
            onChange={e =>
              setForm({ ...form, label: e.target.value })
            }
          />
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.is_active === 1}
            onChange={e =>
              setForm({
                ...form,
                is_active: e.target.checked ? 1 : 0
              })
            }
          />
          Active
        </label>
      </Modal>
    </div>
  );
}
