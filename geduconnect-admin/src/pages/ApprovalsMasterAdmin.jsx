import { useEffect, useState } from "react";
import api from "../api";

export default function ApprovalsMasterAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const res = await api.get("/admin/approvals");
    setData(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const save = async () => {
    if (!form.name.trim()) return alert("Name required");

    if (editingId) {
      await api.put(`/admin/approvals/${editingId}`, form);
    } else {
      await api.post("/admin/approvals", form);
    }

    setForm({ name: "" });
    setEditingId(null);
    fetchData();
  };

  const edit = (row) => {
    setForm(row);
    setEditingId(row.id);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete?")) return;
    await api.delete(`/admin/approvals/${id}`);
    fetchData();
  };

  return (
    <div className="highlight-admin">
      <h2>Approvals Master</h2>

      <input
        placeholder="Approval Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <button onClick={save}>
        {editingId ? "Update" : "Add"}
      </button>

      <table className="admin-table">
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>
                <button onClick={() => edit(row)}>Edit</button>
                <button onClick={() => remove(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}