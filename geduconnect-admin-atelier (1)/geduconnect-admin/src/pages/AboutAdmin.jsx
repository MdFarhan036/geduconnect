import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const emptyForm = {
  heading: "",
  subheading: "",
  paragraph1: "",
  founder_message: "",
  founder_name: "",
  mission: "",
  vision: "",
  image: null,
  image_url: null,
  founder_image: null,
  founder_image_url: null,
  home_image: null,
  home_image_url: null,
  is_active: 1
};

export default function AboutAdmin() {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/about");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load About data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= OPEN EDIT ================= */
  const openEdit = () => {
    if (!data) return;

    setForm({
      heading: data.heading || "",
      subheading: data.subheading || "",
      paragraph1: data.paragraph1 || "",
      founder_message: data.founder_message || "",
      founder_name: data.founder_name || "",
      mission: data.mission || "",
      vision: data.vision || "",
      image: null,
      image_url: data.image_url || null,
      founder_image: null,
      founder_image_url: data.founder_image_url || null,
      home_image: null,
      home_image_url: data.home_image_url || null,
      is_active: data.is_active ?? 1
    });

    setOpen(true);
  };

  /* ================= SAVE ================= */
  const save = async () => {
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("heading", form.heading);
      fd.append("subheading", form.subheading);
      fd.append("paragraph1", form.paragraph1);
      fd.append("founder_message", form.founder_message);
      fd.append("founder_name", form.founder_name);
      fd.append("mission", form.mission);
      fd.append("vision", form.vision);
      fd.append("is_active", form.is_active);

      if (form.image) {
        fd.append("image", form.image);
      }

      if (form.founder_image) {
        fd.append("founder_image", form.founder_image);
      }

      if (form.home_image) {
        fd.append("home_image", form.home_image);
      }

      await api.put("/admin/about", fd);

      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  const getImageUrl = (path) =>
    `${BASE_URL}${path?.startsWith("/") ? "" : "/"}${path}`;

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>About Us</h2>
        <button className="btn primary" onClick={openEdit}>
          Edit
        </button>
      </div>

      <div className="admin-card">

        {/* HOME BANNER PREVIEW */}
        {data.home_image_url && (
          <>
            <h4>Home Banner</h4>
            <img
              src={getImageUrl(data.home_image_url)}
              alt="Home Banner"
              style={{ width: "100%", maxWidth: 600, marginBottom: 20 }}
            />
          </>
        )}

        <h3>{data.heading}</h3>
        <h4>{data.subheading}</h4>

        <p>{data.paragraph1}</p>

        <h4>Founder Message</h4>
        <p>{data.founder_message}</p>
        <strong>{data.founder_name}</strong>

        <h4>Mission</h4>
        <p>{data.mission}</p>

        <h4>Vision</h4>
        <p>{data.vision}</p>

        {data.image_url && (
          <img
            src={getImageUrl(data.image_url)}
            alt="About"
            style={{ width: 250, marginTop: 15 }}
          />
        )}

        {data.founder_image_url && (
          <img
            src={getImageUrl(data.founder_image_url)}
            alt="Founder"
            style={{ width: 200, marginTop: 15 }}
          />
        )}

        <p>Status: {data.is_active ? "Active" : "Inactive"}</p>
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        open={open}
        title="Edit About Us"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              className="btn primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        }
      >

        {/* HOME BANNER */}
        <div className="form-group">
          <label>Home Banner Image</label>

          {form.home_image_url && !form.home_image && (
            <img
              src={getImageUrl(form.home_image_url)}
              alt="banner"
              style={{ width: 250, marginBottom: 10 }}
            />
          )}

          {form.home_image && (
            <img
              src={URL.createObjectURL(form.home_image)}
              alt="preview"
              style={{ width: 250, marginBottom: 10 }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, home_image: e.target.files[0] })
            }
          />
        </div>

        {/* REST OF FIELDS (unchanged below) */}

        <div className="form-group">
          <label>Heading</label>
          <input
            value={form.heading}
            onChange={e =>
              setForm({ ...form, heading: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Subheading</label>
          <input
            value={form.subheading}
            onChange={e =>
              setForm({ ...form, subheading: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Main Paragraph</label>
          <textarea
            value={form.paragraph1}
            onChange={e =>
              setForm({ ...form, paragraph1: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Founder Message</label>
          <textarea
            value={form.founder_message}
            onChange={e =>
              setForm({ ...form, founder_message: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Founder Name</label>
          <input
            value={form.founder_name}
            onChange={e =>
              setForm({ ...form, founder_name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Mission</label>
          <textarea
            value={form.mission}
            onChange={e =>
              setForm({ ...form, mission: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Vision</label>
          <textarea
            value={form.vision}
            onChange={e =>
              setForm({ ...form, vision: e.target.value })
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
