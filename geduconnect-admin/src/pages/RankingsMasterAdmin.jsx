import { useEffect, useState } from "react";
import api from "../api";

export default function RankingsMasterAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const res = await api.get("/admin/rankings");
    setData(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const save = async () => {
    if (!form.name.trim()) return alert("Name required");

    if (editingId) {
      await api.put(`/admin/rankings/${editingId}`, form);
    } else {
      await api.post("/admin/rankings", form);
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
    await api.delete(`/admin/rankings/${id}`);
    fetchData();
  };

  return (
    <div className="highlight-admin">
      <h2>Rankings Master</h2>

      <input
        placeholder="Ranking Name"
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