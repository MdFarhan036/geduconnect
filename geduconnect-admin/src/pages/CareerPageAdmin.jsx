import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const emptyForm = {
  hero_title: "",
  join_title: "",
  join_description: "",
  resume_email: "",
  cta_title: "",
  cta_button_text: "",
  cta_button_link: "",
  meta_title: "",
  meta_description: "",
  hero_image: null,
  hero_image_url: null,
  join_image: null,
  join_image_url: null,
  is_active: 1
};

export default function CareerPageAdmin() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get("/careers/admin/page");
      setData(res.data?.page || null);
    } catch (err) {
      console.error("Fetch Career Page Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEdit = () => {
    if (!data) {
      setForm(emptyForm);
    } else {
      setForm({
        hero_title: data.hero_title || "",
        join_title: data.join_title || "",
        join_description: data.join_description || "",
        resume_email: data.resume_email || "",
        cta_title: data.cta_title || "",
        cta_button_text: data.cta_button_text || "",
        cta_button_link: data.cta_button_link || "",
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        hero_image: null,
        hero_image_url: data.hero_image || null,
        join_image: null,
        join_image_url: data.join_image || null,
        is_active: data.is_active ?? 1
      });
    }

    setOpen(true);
  };

  const save = async () => {
    try {
      const fd = new FormData();

      Object.keys(form).forEach(key => {
        if (
          key !== "hero_image" &&
          key !== "hero_image_url" &&
          key !== "join_image" &&
          key !== "join_image_url"
        ) {
          fd.append(key, form[key]);
        }
      });

      if (form.hero_image) {
        fd.append("hero_image", form.hero_image);
      }

      if (form.join_image) {
        fd.append("join_image", form.join_image);
      }

      await api.put("/careers/admin/page", fd);

      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Save Career Page Error:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>Career Page</h2>
        <button className="btn primary" onClick={openEdit}>
          {data ? "Edit" : "Create"}
        </button>
      </div>

      {data ? (
        <div className="admin-card">
          <h3>Hero Title:</h3>
          <p>{data.hero_title}</p>

          {data.hero_image && (
            <>
              <h3>Hero Image:</h3>
              <img
                src={`${BASE_URL}${data.hero_image}`}
                alt="Hero"
                style={{ width: "100%", maxWidth: 400 }}
              />
            </>
          )}

          <h3>Join Title:</h3>
          <p>{data.join_title}</p>

          <h3>Description:</h3>
          <p>{data.join_description}</p>

          {data.join_image && (
            <>
              <h3>Join Image:</h3>
              <img
                src={`${BASE_URL}${data.join_image}`}
                alt="Join"
                style={{ width: 250 }}
              />
            </>
          )}

          <h3>Resume Email:</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <p>{data.resume_email}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.resume_email);
                alert("Email copied!");
              }}
            >
              Copy
            </button>
          </div>

          <h3>CTA:</h3>
          <p>{data.cta_title}</p>
          <p>
            {data.cta_button_text} → {data.cta_button_link}
          </p>

          <h3>SEO:</h3>
          <p><strong>Meta Title:</strong> {data.meta_title}</p>
          <p><strong>Meta Description:</strong> {data.meta_description}</p>

          <h3>Status:</h3>
          <p>{data.is_active ? "Active" : "Inactive"}</p>
        </div>
      ) : (
        <div className="admin-card">
          <p>No career page content found. Click "Create" to add one.</p>
        </div>
      )}

      <Modal
        open={open}
        title="Edit Career Page"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn primary" onClick={save}>
              Save
            </button>
          </>
        }
      >
        <h4>Hero Section</h4>

        <input
          placeholder="Hero Title"
          value={form.hero_title}
          onChange={e => setForm({ ...form, hero_title: e.target.value })}
        />

        {form.hero_image_url && !form.hero_image && (
          <img
            src={`${BASE_URL}${form.hero_image_url}`}
            alt="Hero Preview"
            style={{ width: 200, margin: "10px 0" }}
          />
        )}

        <input
          type="file"
          onChange={e =>
            setForm({ ...form, hero_image: e.target.files[0] })
          }
        />

        <hr />

        <h4>Join Section</h4>

        <input
          placeholder="Join Section Title"
          value={form.join_title}
          onChange={e => setForm({ ...form, join_title: e.target.value })}
        />

        <textarea
          placeholder="Join Description"
          value={form.join_description}
          onChange={e => setForm({ ...form, join_description: e.target.value })}
        />

        {form.join_image_url && !form.join_image && (
          <img
            src={`${BASE_URL}${form.join_image_url}`}
            alt="Join Preview"
            style={{ width: 200, margin: "10px 0" }}
          />
        )}

        <input
          type="file"
          onChange={e =>
            setForm({ ...form, join_image: e.target.files[0] })
          }
        />

        <hr />

        <input
          placeholder="HR Email"
          value={form.resume_email}
          onChange={e => setForm({ ...form, resume_email: e.target.value })}
        />

        <hr />

        <h4>CTA Section</h4>

        <input
          placeholder="CTA Title"
          value={form.cta_title}
          onChange={e => setForm({ ...form, cta_title: e.target.value })}
        />

        <input
          placeholder="CTA Button Text"
          value={form.cta_button_text}
          onChange={e =>
            setForm({ ...form, cta_button_text: e.target.value })
          }
        />

        <input
          placeholder="CTA Button Link"
          value={form.cta_button_link}
          onChange={e =>
            setForm({ ...form, cta_button_link: e.target.value })
          }
        />

        <hr />

        <h4>SEO Settings</h4>

        <input
          placeholder="Meta Title"
          value={form.meta_title}
          onChange={e => setForm({ ...form, meta_title: e.target.value })}
        />

        <textarea
          placeholder="Meta Description"
          maxLength={160}
          value={form.meta_description}
          onChange={e =>
            setForm({ ...form, meta_description: e.target.value })
          }
        />

        <small>{form.meta_description.length}/160 characters</small>

        <hr />

        <label>
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