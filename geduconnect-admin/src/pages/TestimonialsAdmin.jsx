import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const BASE_URL = API_BASE.replace("/api", "");

const getImageUrl = (path) => {
  if (!path) return "";
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* ================= TESTIMONIAL FORM ================= */

const emptyForm = {
  name: "",
  message: "",
  designation: "",
  organization: "",
  sort_order: 1,
  is_active: 1,
  image: null,
  image_url: ""
};

/* ================= PAGE SETTINGS FORM ================= */

const emptyPageForm = {
  hero_title: "",
  hero_subtitle: "",
  hero_image: null,
  hero_image_url: "",
  about_title: "",
  about_description: "",
  about_image: null,
  about_image_url: "",
  is_active: 1
};

export default function TestimonialsAdmin() {
  const [activeTab, setActiveTab] = useState("list");

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pageForm, setPageForm] = useState(emptyPageForm);
  const [pageSaving, setPageSaving] = useState(false);

  /* ================= FETCH ================= */

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/testimonials");
      setData(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageSettings = async () => {
    const res = await api.get("/admin/testimonials-page");
    setPageForm({ ...emptyPageForm, ...(res.data || {}) });
  };

  useEffect(() => {
    fetchTestimonials();
    fetchPageSettings();
  }, []);

  /* ================= TESTIMONIAL CRUD ================= */

  const closeModal = () => {
    setOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      ...row,
      image: null,
      image_url: row.image_url || ""
    });
    setEditingId(row.id);
    setOpen(true);
  };

  const saveTestimonial = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      alert("Name and message are required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("message", form.message);
      formData.append("designation", form.designation || "");
      formData.append("organization", form.organization || "");
      formData.append("sort_order", form.sort_order);
      formData.append("is_active", form.is_active);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await api.put(`/admin/testimonials/${editingId}`, formData);
      } else {
        await api.post("/admin/testimonials", formData);
      }

      closeModal();
      fetchTestimonials();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await api.delete(`/admin/testimonials/${id}`);
    fetchTestimonials();
  };

  /* ================= SAVE PAGE SETTINGS ================= */

  const savePageSettings = async () => {
    try {
      setPageSaving(true);

      const formData = new FormData();
      formData.append("hero_title", pageForm.hero_title || "");
      formData.append("hero_subtitle", pageForm.hero_subtitle || "");
      formData.append("about_title", pageForm.about_title || "");
      formData.append("about_description", pageForm.about_description || "");
      formData.append("is_active", pageForm.is_active);

      if (pageForm.hero_image)
        formData.append("hero_image", pageForm.hero_image);

      if (pageForm.about_image)
        formData.append("about_image", pageForm.about_image);

      await api.put("/admin/testimonials-page", formData);

      fetchPageSettings();
      alert("Page settings updated successfully");
    } finally {
      setPageSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="highlight-admin">
      <h2>Testimonials Management</h2>

      <div style={{ marginBottom: 20 }}>
        <button
          className={activeTab === "list" ? "btn primary" : "btn"}
          onClick={() => setActiveTab("list")}
        >
          Testimonials
        </button>

        <button
          className={activeTab === "settings" ? "btn primary" : "btn"}
          onClick={() => setActiveTab("settings")}
          style={{ marginLeft: 10 }}
        >
          Page Settings
        </button>
      </div>

      {/* ================= TESTIMONIAL LIST ================= */}

      {activeTab === "list" && (
        <>
          <button className="btn primary" onClick={openAdd}>
            + Add Testimonial
          </button>

          <table className="admin-table" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.id}>
                  <td>
                    {t.image_url && (
                      <img
                        src={getImageUrl(t.image_url)}
                        alt=""
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    )}
                  </td>
                  <td>{t.name}</td>
                  <td>{t.designation}</td>
                  <td>{t.sort_order}</td>
                  <td>{t.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <button onClick={() => openEdit(t)}>Edit</button>
                    <button onClick={() => remove(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= PAGE SETTINGS ================= */}

      {activeTab === "settings" && (
        <div style={{ marginTop: 20 }}>
          <h3>Hero Section</h3>

          <input
            placeholder="Hero Title"
            value={pageForm.hero_title}
            onChange={(e) =>
              setPageForm({ ...pageForm, hero_title: e.target.value })
            }
          />

          <textarea
            placeholder="Hero Subtitle"
            value={pageForm.hero_subtitle}
            onChange={(e) =>
              setPageForm({ ...pageForm, hero_subtitle: e.target.value })
            }
          />

          <input
            type="file"
            onChange={(e) =>
              setPageForm({ ...pageForm, hero_image: e.target.files[0] })
            }
          />

          {(pageForm.hero_image || pageForm.hero_image_url) && (
            <img
              src={
                pageForm.hero_image
                  ? URL.createObjectURL(pageForm.hero_image)
                  : getImageUrl(pageForm.hero_image_url)
              }
              style={{ width: 200, marginTop: 10 }}
              alt=""
            />
          )}

          <h3 style={{ marginTop: 30 }}>About Section</h3>

          <input
            placeholder="About Title"
            value={pageForm.about_title}
            onChange={(e) =>
              setPageForm({ ...pageForm, about_title: e.target.value })
            }
          />

          <textarea
            placeholder="About Description"
            value={pageForm.about_description}
            onChange={(e) =>
              setPageForm({
                ...pageForm,
                about_description: e.target.value
              })
            }
          />

          <input
            type="file"
            onChange={(e) =>
              setPageForm({ ...pageForm, about_image: e.target.files[0] })
            }
          />

          {(pageForm.about_image || pageForm.about_image_url) && (
            <img
              src={
                pageForm.about_image
                  ? URL.createObjectURL(pageForm.about_image)
                  : getImageUrl(pageForm.about_image_url)
              }
              style={{ width: 200, marginTop: 10 }}
              alt=""
            />
          )}

          <div style={{ marginTop: 20 }}>
            <label>
              <input
                type="checkbox"
                checked={pageForm.is_active === 1}
                onChange={(e) =>
                  setPageForm({
                    ...pageForm,
                    is_active: e.target.checked ? 1 : 0
                  })
                }
              />
              Active
            </label>
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              className="btn primary"
              onClick={savePageSettings}
              disabled={pageSaving}
            >
              {pageSaving ? "Saving..." : "Save Page Settings"}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}

      <Modal
        open={open}
        title={editingId ? "Edit Testimonial" : "Add Testimonial"}
        onClose={closeModal}
        footer={
          <>
            <button onClick={closeModal}>Cancel</button>
            <button onClick={saveTestimonial} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <input
          type="file"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
        />
      </Modal>
    </div>
  );
}