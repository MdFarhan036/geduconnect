import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const emptyForm = {
  question: "",
  answer: "",
  sort_order: 1,
  is_active: 1
};

export default function FaqsAdmin() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    const res = await api.get("/admin/faqs");
    setData(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= OPEN ADD ================= */
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = (row) => {
    setForm({
      question: row.question || "",
      answer: row.answer || "",
      sort_order: row.sort_order || 1,
      is_active: row.is_active ?? 1
    });
    setEditingId(row.id);
    setOpen(true);
  };

  /* ================= SAVE ================= */
  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      alert("Question and Answer are required");
      return;
    }

    if (editingId) {
      await api.put(`/admin/faqs/${editingId}`, form);
    } else {
      await api.post("/admin/faqs", form);
    }

    setOpen(false);
    fetchData();
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;

    await api.delete(`/admin/faqs/${id}`);
    setData(prev => prev.filter(f => f.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>FAQs</h2>
        <button className="btn primary" onClick={openAdd}>
          + Add FAQ
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Order</th>
            <th>Status</th>
            <th width="150">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(faq => (
            <tr key={faq.id}>
              <td>{faq.question}</td>
              <td style={{ maxWidth: 300 }}>
                {faq.answer.length > 80
                  ? faq.answer.substring(0, 80) + "..."
                  : faq.answer}
              </td>
              <td>{faq.sort_order}</td>
              <td>{faq.is_active ? "Active" : "Inactive"}</td>
              <td className="actions">
                <button className="btn success" onClick={() => openEdit(faq)}>
                  Edit
                </button>
                <button className="btn danger" onClick={() => remove(faq.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="5" align="center">
                No records
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      <Modal
        open={open}
        title={editingId ? "Edit FAQ" : "Add FAQ"}
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
          <label>Question</label>
          <input
            value={form.question}
            onChange={e => setForm({ ...form, question: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Answer</label>
          <textarea
            value={form.answer}
            onChange={e => setForm({ ...form, answer: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Sort Order</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={e =>
              setForm({ ...form, sort_order: e.target.value })
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
