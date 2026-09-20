import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  author_name: "",
  reading_time: "",
  meta_title: "",
  meta_description: "",
  sort_order: 1,
  is_active: 1,
  featured: 0,
  status: "draft",
  published_at: "",

  // Thumbnail
  thumbnail_image: null,
  image_url: null,

  // Hero
  hero_image: null,
  hero_image_url: null
};


export default function BlogAdmin() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/blogs");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SLUG GENERATOR ================= */
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  /* ================= OPEN MODAL ================= */
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

const openEdit = (row) => {
  setForm({
    title: row.title || "",
    slug: row.slug || "",
    excerpt: row.excerpt || "",
    content: row.content || "",
    category: row.category || "",
    tags: row.tags || "",
    author_name: row.author_name || "",
    reading_time: row.reading_time || "",
    meta_title: row.meta_title || "",
    meta_description: row.meta_description || "",
    sort_order: row.sort_order || 1,
    is_active: row.is_active ?? 1,
    featured: row.featured ?? 0,
    status: row.status || "draft",
    published_at: row.published_at
      ? row.published_at.split("T")[0]
      : "",

    thumbnail_image: null,
    image_url: row.image_url || null,

    hero_image: null,
    hero_image_url: row.hero_image_url || null
  });

  setEditingId(row.id);
  setOpen(true);
};
  const save = async () => {
    if (!form.title.trim()) {
      alert("Title required");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("slug", form.slug || generateSlug(form.title));
    formData.append("excerpt", form.excerpt || "");
    formData.append("content", form.content || "");
    formData.append("category", form.category || "");
    formData.append("tags", form.tags || "");
    formData.append("author_name", form.author_name || "");
    formData.append("reading_time", form.reading_time || "");
    formData.append("meta_title", form.meta_title || "");
    formData.append("meta_description", form.meta_description || "");
    formData.append("sort_order", Number(form.sort_order) || 1);
    formData.append("is_active", form.is_active);
    formData.append("featured", form.featured);
    formData.append("status", form.status);
    formData.append("published_at", form.published_at || "");

if (form.thumbnail_image) {
  formData.append("thumbnail_image", form.thumbnail_image);
}

if (form.hero_image) {
  formData.append("hero_image", form.hero_image);
}
    try {
      if (editingId) {
        await api.put(`/admin/blogs/${editingId}`, formData);
      } else {
        await api.post("/admin/blogs", formData);
      }

      setOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save blog");
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await api.delete(`/admin/blogs/${id}`);
      setData((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  /* ================= IMAGE HELPER ================= */
  const getImageUrl = (url) => {
    if (!url) return "";
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (loading) return <div className="loading">Loading blogs...</div>;

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>Blog Management</h2>
        <button className="btn primary" onClick={openAdd}>
          + Add Blog
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="admin-table">
        <thead>
          <tr>
          <th>Thumbnail</th>
            <th>Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Date</th>
            <th width="220">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="6" align="center">
                No blogs found
              </td>
            </tr>
          )}

          {data.map((blog) => (
            <tr key={blog.id}>
              <td>
                {blog.image_url && (
                  <img
                    src={getImageUrl(blog.image_url)}
                    alt="blog"
                    style={{ width: 60 }}
                  />
                )}
              </td>

              <td>{blog.title}</td>

              <td>{blog.category || "-"}</td>

              <td>{blog.author_name || "-"}</td>

              <td>
                <span className={`status ${blog.status}`}>
                  {blog.status}
                </span>
              </td>

              <td>{blog.featured ? "Yes" : "No"}</td>

              <td>
                {blog.published_at
                  ? new Date(blog.published_at).toLocaleDateString()
                  : "-"}
              </td>

              <td className="actions">
                {blog.status === "published" && (
                  <button
                    className="btn info"
                    onClick={() =>
                      window.open(`/blogs/${blog.slug}`, "_blank")
                    }
                  >
                    View
                  </button>
                )}

                <button
                  className="btn success"
                  onClick={() => openEdit(blog)}
                >
                  Edit
                </button>

                <button
                  className="btn danger"
                  onClick={() => remove(blog.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      <Modal
        open={open}
        title={editingId ? "Edit Blog" : "Add Blog"}
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
        {/* Title */}
        {/* ================= BASIC INFO ================= */}

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
              slug: generateSlug(e.target.value)
            })
          }
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />

        <textarea
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={(e) =>
            setForm({ ...form, excerpt: e.target.value })
          }
        />

        <textarea
          placeholder="Content (HTML allowed)"
          rows={8}
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
        />

        {/* ================= BLOG DETAILS ================= */}

        <input
          placeholder="Category (e.g. Admission, Technology)"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value })
          }
        />

        <input
          placeholder="Author Name"
          value={form.author_name}
          onChange={(e) =>
            setForm({ ...form, author_name: e.target.value })
          }
        />

        <input
          placeholder="Reading Time (e.g. 5 min read)"
          value={form.reading_time}
          onChange={(e) =>
            setForm({ ...form, reading_time: e.target.value })
          }
        />

        <label>Publish Date</label>
        <input
          type="date"
          value={form.published_at}
          onChange={(e) =>
            setForm({ ...form, published_at: e.target.value })
          }
        />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={form.featured === 1}
            onChange={(e) =>
              setForm({
                ...form,
                featured: e.target.checked ? 1 : 0
              })
            }
          />
          Featured on Homepage
        </label>

        {/* ================= SEO ================= */}

        <input
          placeholder="Meta Title"
          value={form.meta_title}
          onChange={(e) =>
            setForm({ ...form, meta_title: e.target.value })
          }
        />

        <textarea
          placeholder="Meta Description"
          value={form.meta_description}
          onChange={(e) =>
            setForm({ ...form, meta_description: e.target.value })
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

        <label>
          <input
            type="checkbox"
            checked={form.is_active === 1}
            onChange={(e) =>
              setForm({
                ...form,
                is_active: e.target.checked ? 1 : 0
              })
            }
          />
          Active
        </label>

        {/* ================= IMAGE ================= */}

   {/* ================= IMAGES ================= */}

{/* ===== THUMBNAIL IMAGE ===== */}
<div style={{ marginTop: 15 }}>
  <label>Thumbnail Image</label>

  {form.image_url && !form.thumbnail_image && (
    <div>
      <img
        src={getImageUrl(form.image_url)}
        alt="Current thumbnail"
        style={{
          width: 180,
          height: 110,
          objectFit: "cover",
          display: "block",
          marginTop: 10,
          borderRadius: 6
        }}
      />
      <small>Current thumbnail</small>
    </div>
  )}

  {form.thumbnail_image && (
    <img
      src={URL.createObjectURL(form.thumbnail_image)}
      alt="New thumbnail"
      style={{
        width: 180,
        height: 110,
        objectFit: "cover",
        display: "block",
        marginTop: 10,
        borderRadius: 6
      }}
    />
  )}

</div>


{/* ===== HERO IMAGE ===== */}
<div style={{ marginTop: 20 }}>
  <label>Hero Image</label>

  {form.hero_image_url && !form.hero_image && (
    <div>
      <img
        src={getImageUrl(form.hero_image_url)}
        alt="Current hero"
        style={{
          width: 320,
          height: 180,
          objectFit: "cover",
          display: "block",
          marginTop: 10,
          borderRadius: 6
        }}
      />
      <small>Current hero image</small>
    </div>
  )}

  {form.hero_image && (
    <img
      src={URL.createObjectURL(form.hero_image)}
      alt="New hero"
      style={{
        width: 320,
        height: 180,
        objectFit: "cover",
        display: "block",
        marginTop: 10,
        borderRadius: 6
      }}
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setForm({
        ...form,
        hero_image: e.target.files[0] || null
      })
    }
  />
</div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
        />

      </Modal>
    </div>
  );
}
