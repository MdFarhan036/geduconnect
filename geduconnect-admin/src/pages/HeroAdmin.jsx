import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const emptySlide = {
  title: "",
  subtitle: "",
  primary_cta_text: "",
  primary_cta_link: "",
  secondary_cta_text: "",
  secondary_cta_link: "",
  image: null,
  preview: null
};

export default function HeroAdmin() {
  const [slides, setSlides] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/hero");
      setSlides(res.data?.slides || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load hero section");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= ADD SLIDE ================= */
  const addSlide = () => {
    setSlides([...slides, { ...emptySlide }]);
    setOpen(true);
  };

  /* ================= REMOVE SLIDE ================= */
  const removeSlide = (index) => {
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index, field, value) => {
    const updated = [...slides];
    updated[index][field] = value;
    setSlides(updated);
  };

  /* ================= HANDLE IMAGE ================= */
  const handleImage = (index, file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const updated = [...slides];
    updated[index].image = file;
    updated[index].preview = URL.createObjectURL(file);
    setSlides(updated);
  };

  /* ================= SAVE ================= */
 const save = async () => {
  try {
    setSaving(true);

    const fd = new FormData();

    slides.forEach((slide, index) => {
      fd.append(`title_${index}`, slide.title);
      fd.append(`subtitle_${index}`, slide.subtitle);
      fd.append(`primary_cta_text_${index}`, slide.primary_cta_text);
      fd.append(`primary_cta_link_${index}`, slide.primary_cta_link);
      fd.append(`secondary_cta_text_${index}`, slide.secondary_cta_text);
      fd.append(`secondary_cta_link_${index}`, slide.secondary_cta_link);

      if (slide.image) {
        fd.append("images", slide.image);
      }
    });

    await api.put("/admin/hero", fd);

    alert("Hero slides updated!");
    fetchData();
    setOpen(false);
  } catch (err) {
    console.error(err);
    alert("Failed to save slides");
  } finally {
    setSaving(false);
  }
};

  if (loading)
    return <div className="admin-card">Loading hero section...</div>;

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>Hero Slides</h2>
        <button className="btn primary" onClick={addSlide}>
          + Add Slide
        </button>
      </div>

      {/* ================= PREVIEW ================= */}
      {slides.length === 0 && (
        <div className="admin-card">No slides added yet.</div>
      )}

      {slides.map((slide, index) => (
        <div className="admin-card" key={index}>
          <h3>{slide.title || `Slide ${index + 1}`}</h3>
          <p>{slide.subtitle}</p>

          {slide.preview && (
            <img
              src={slide.preview}
              alt="preview"
              style={{
                width: 150,
                height: 90,
                objectFit: "cover",
                borderRadius: 6
              }}
            />
          )}

          <div style={{ marginTop: 10 }}>
            <button
              className="btn"
              onClick={() => setOpen(true)}
            >
              Edit
            </button>

            <button
              className="btn danger"
              style={{ marginLeft: 10 }}
              onClick={() => removeSlide(index)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ================= MODAL ================= */}
      <Modal
        open={open}
        title="Edit Slides"
        onClose={() => !saving && setOpen(false)}
        footer={
          <>
            <button className="btn" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              className="btn primary"
              disabled={saving}
              onClick={save}
            >
              {saving ? "Saving..." : "Save All"}
            </button>
          </>
        }
      >
        {slides.map((slide, index) => (
          <div key={index} className="form-group" style={{ marginBottom: 30 }}>
            <h4>Slide {index + 1}</h4>

            <input
              placeholder="Title"
              value={slide.title}
              onChange={(e) =>
                handleChange(index, "title", e.target.value)
              }
            />

            <textarea
              placeholder="Subtitle"
              value={slide.subtitle}
              onChange={(e) =>
                handleChange(index, "subtitle", e.target.value)
              }
            />

            <input
              placeholder="Primary CTA Text"
              value={slide.primary_cta_text}
              onChange={(e) =>
                handleChange(
                  index,
                  "primary_cta_text",
                  e.target.value
                )
              }
            />

            <input
              placeholder="Primary CTA Link"
              value={slide.primary_cta_link}
              onChange={(e) =>
                handleChange(
                  index,
                  "primary_cta_link",
                  e.target.value
                )
              }
            />

            <input
              placeholder="Secondary CTA Text"
              value={slide.secondary_cta_text}
              onChange={(e) =>
                handleChange(
                  index,
                  "secondary_cta_text",
                  e.target.value
                )
              }
            />

            <input
              placeholder="Secondary CTA Link"
              value={slide.secondary_cta_link}
              onChange={(e) =>
                handleChange(
                  index,
                  "secondary_cta_link",
                  e.target.value
                )
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImage(index, e.target.files[0])
              }
            />

            {slide.preview && (
              <img
                src={slide.preview}
                alt="preview"
                style={{
                  width: 120,
                  marginTop: 10,
                  borderRadius: 6
                }}
              />
            )}
          </div>
        ))}
      </Modal>
    </div>
  );
}