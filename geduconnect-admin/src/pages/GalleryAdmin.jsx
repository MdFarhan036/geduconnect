import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const emptyForm = {
  title: "",
  caption: "",
  location: "",
  date: "",
  category: "General",
  sort_order: 1,
  is_active: 1,
  image: null,
  image_url: null
};

export default function GalleryAdmin() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    const res = await api.get("/admin/gallery");
    setData(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= OPEN ================= */
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      title: row.title || "",
      caption: row.caption || "",
      location: row.location || "",
      date: row.date || "",
      category: row.category || "General",
      sort_order: row.sort_order || 1,
      is_active: row.is_active ?? 1,
      image: null,
      image_url: row.image_url || null
    });
    setEditingId(row.id);
    setOpen(true);
  };

  /* ================= SAVE ================= */
  const save = async () => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("caption", form.caption);
    formData.append("location", form.location);
    formData.append("date", form.date);
    formData.append("category", form.category);
    formData.append("sort_order", form.sort_order);
    formData.append("is_active", form.is_active);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (editingId) {
      await api.put(`/admin/gallery/${editingId}`, formData);
    } else {
      await api.post("/admin/gallery", formData);
    }

    setOpen(false);
    fetchData();
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    await api.delete(`/admin/gallery/${id}`);
    fetchData();
  };

  /* ================= RENDER ================= */
  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>Gallery</h2>
        <button className="btn primary" onClick={openAdd}>
          + Add Image
        </button>
      </div>

      <div className="gallery-admin-grid">
        {data.map((item) => (
          <div key={item.id} className="gallery-admin-card">
            {item.image_url && (
              <img
                src={`${BASE_URL}${item.image_url.startsWith("/") ? "" : "/"
                  }${item.image_url}`}
                alt={item.title}
              />
            )}

            <h4>{item.title}</h4>

            <p><strong>Location:</strong> {item.location || "-"}</p>

            <p>
              <strong>Date:</strong>{" "}
              {item.date
                ? new Date(item.date).toLocaleDateString()
                : "-"}
            </p>

            <p><strong>Category:</strong> {item.category || "-"}</p>

            <p>{item.caption}</p>

            <div className="actions">
              <button onClick={() => openEdit(item)}>Edit</button>
              <button onClick={() => remove(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        title={editingId ? "Edit Image" : "Add Image"}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button onClick={save}>Save</button>
          </>
        }
      >
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Caption / Description"
          value={form.caption}
          onChange={(e) =>
            setForm({ ...form, caption: e.target.value })
          }
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Sort Order"
          value={form.sort_order}
          onChange={(e) =>
            setForm({ ...form, sort_order: e.target.value })
          }
        />

        <select
          value={form.is_active}
          onChange={(e) =>
            setForm({ ...form, is_active: Number(e.target.value) })
          }
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
        />

        {/* Existing Preview */}
        {form.image_url && !form.image && (
          <img
            src={`${BASE_URL}${form.image_url.startsWith("/") ? "" : "/"
              }${form.image_url}`}
            alt="preview"
            style={{ width: 120, marginTop: 10 }}
          />
        )}

        {/* New Preview */}
        {form.image && (
          <img
            src={URL.createObjectURL(form.image)}
            alt="preview"
            style={{ width: 120, marginTop: 10 }}
          />
        )}
      </Modal>
    </div>
  );
}
