import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

/* =========================================================
   EMPTY SLIDE
========================================================= */

const emptySlide = {
  title: "",
  subtitle: "",
  description: "",
  primary_cta_text: "",
  primary_cta_link: "",
  secondary_cta_text: "",
  secondary_cta_link: "",
  image: null,
  preview: null,
  image_url: null,
};

/* =========================================================
   HERO ADMIN
========================================================= */

export default function HeroAdmin() {
  const [slides, setSlides] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/hero");

      const apiSlides = Array.isArray(res.data?.slides)
        ? res.data.slides
        : [];

      const normalizedSlides = apiSlides.map((slide) => ({
        id: slide?.id || null,

        title: slide?.title || "",

        subtitle: slide?.subtitle || "",

        description: slide?.description || "",

        primary_cta_text: slide?.primary_cta_text || "",

        primary_cta_link: slide?.primary_cta_link || "",

        secondary_cta_text:
          slide?.secondary_cta_text || "",

        secondary_cta_link:
          slide?.secondary_cta_link || "",

        image: null,

        image_url: slide?.image_url || null,

        preview:
          slide?.preview ||
          slide?.image_url ||
          null,
      }));

      setSlides(normalizedSlides);
    } catch (err) {
      console.error("Failed to load hero:", err);
      alert("Failed to load hero section");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =======================================================
     ADD SLIDE
  ======================================================= */

  const addSlide = () => {
    setSlides((current) => [
      ...current,
      {
        ...emptySlide,
      },
    ]);

    setOpen(true);
  };

  /* =======================================================
     REMOVE SLIDE
  ======================================================= */

  const removeSlide = (index) => {
    const slide = slides[index];

    const confirmed = window.confirm(
      `Delete Slide ${index + 1}${
        slide?.title ? ` - "${slide.title}"` : ""
      }?`
    );

    if (!confirmed) return;

    setSlides((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  /* =======================================================
     HANDLE CHANGE
  ======================================================= */

  const handleChange = (index, field, value) => {
    setSlides((current) => {
      const updated = [...current];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  /* =======================================================
     HANDLE IMAGE
  ======================================================= */

  const handleImage = (index, file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setSlides((current) => {
      const updated = [...current];

      /*
        Revoke old local preview.
      */
      if (
        updated[index]?.preview &&
        updated[index]?.image
      ) {
        try {
          URL.revokeObjectURL(
            updated[index].preview
          );
        } catch {
          // Ignore revoke errors
        }
      }

      updated[index] = {
        ...updated[index],
        image: file,
        preview: previewUrl,
      };

      return updated;
    });
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const save = async () => {
    try {
      setSaving(true);

      const fd = new FormData();

      slides.forEach((slide, index) => {
        /* ================= TEXT ================= */

        fd.append(
          `subtitle_${index}`,
          slide?.subtitle || ""
        );

        fd.append(
          `title_${index}`,
          slide?.title || ""
        );

        fd.append(
          `description_${index}`,
          slide?.description || ""
        );

        /* ================= CTA 1 ================= */

        fd.append(
          `primary_cta_text_${index}`,
          slide?.primary_cta_text || ""
        );

        fd.append(
          `primary_cta_link_${index}`,
          slide?.primary_cta_link || ""
        );

        /* ================= CTA 2 ================= */

        fd.append(
          `secondary_cta_text_${index}`,
          slide?.secondary_cta_text || ""
        );

        fd.append(
          `secondary_cta_link_${index}`,
          slide?.secondary_cta_link || ""
        );

        /* ================= EXISTING IMAGE ================= */

        if (slide?.id) {
          fd.append(
            `existing_image_id_${index}`,
            slide.id
          );
        }

        if (slide?.image_url) {
          fd.append(
            `existing_image_url_${index}`,
            slide.image_url
          );
        }

        /* ================= NEW IMAGE ================= */

      if (slide?.image) {
  fd.append(
    "images",
    slide.image
  );

  fd.append(
    "image_index",
    String(index)
  );
}
      });

      await api.put(
        "/admin/hero",
        fd
      );

      alert(
        "Hero slides updated successfully!"
      );

      await fetchData();

      setOpen(false);
    } catch (err) {
      console.error(
        "Failed to save hero:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to save slides"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="admin-card">
        Loading hero section...
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="highlight-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">
        <h2>Hero Slides</h2>

        <button
          className="btn primary"
          type="button"
          onClick={addSlide}
        >
          + Add Slide
        </button>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {slides.length === 0 && (
        <div className="admin-card">
          No slides added yet.
        </div>
      )}

      {/* =================================================
          SLIDE PREVIEWS
      ================================================= */}

      {slides.map((slide, index) => (
        <div
          className="admin-card"
          key={
            slide?.id ||
            `slide-${index}`
          }
        >
          <h3>
            {slide?.title ||
              `Slide ${index + 1}`}
          </h3>

          {slide?.subtitle && (
            <p>
              <strong>Subtitle:</strong>{" "}
              {slide.subtitle}
            </p>
          )}

          {slide?.description && (
            <p>
              <strong>Description:</strong>{" "}
              {slide.description}
            </p>
          )}

          {/* IMAGE PREVIEW */}

          {slide?.preview && (
            <img
              src={slide.preview}
              alt={
                slide?.title ||
                `Hero slide ${index + 1}`
              }
              style={{
                width: 220,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
                display: "block",
                marginTop: 10,
              }}
            />
          )}

          {/* CTA PREVIEW */}

          <div
            style={{
              marginTop: 12,
              fontSize: 14,
            }}
          >
            {slide?.primary_cta_text && (
              <div>
                <strong>
                  CTA 1:
                </strong>{" "}
                {slide.primary_cta_text}

                {slide?.primary_cta_link && (
                  <span>
                    {" "}
                    → {slide.primary_cta_link}
                  </span>
                )}
              </div>
            )}

            {slide?.secondary_cta_text && (
              <div>
                <strong>
                  CTA 2:
                </strong>{" "}
                {slide.secondary_cta_text}

                {slide?.secondary_cta_link && (
                  <span>
                    {" "}
                    → {slide.secondary_cta_link}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ACTIONS */}

          <div
            style={{
              marginTop: 12,
            }}
          >
            <button
              className="btn"
              type="button"
              onClick={() =>
                setOpen(true)
              }
            >
              Edit
            </button>

            <button
              className="btn danger"
              type="button"
              style={{
                marginLeft: 10,
              }}
              onClick={() =>
                removeSlide(index)
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      <Modal
        open={open}
        title="Edit Hero Slides"
        onClose={() =>
          !saving &&
          setOpen(false)
        }
        footer={
          <>
            <button
              className="btn"
              type="button"
              disabled={saving}
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </button>

            <button
              className="btn primary"
              type="button"
              disabled={saving}
              onClick={save}
            >
              {saving
                ? "Saving..."
                : "Save All"}
            </button>
          </>
        }
      >

        {/* =================================================
            SLIDES
        ================================================= */}

        {slides.map((slide, index) => (
          <div
            key={
              slide?.id ||
              `modal-slide-${index}`
            }
            className="form-group"
            style={{
              marginBottom: 35,
              paddingBottom: 25,
              borderBottom:
                "1px solid #ddd",
            }}
          >

            <h4>
              Slide {index + 1}
            </h4>

            {/* ================= SUBTITLE ================= */}

            <label>
              Subtitle
            </label>

            <input
              type="text"
              placeholder="Enter hero subtitle"
              value={
                slide?.subtitle || ""
              }
              onChange={(e) =>
                handleChange(
                  index,
                  "subtitle",
                  e.target.value
                )
              }
            />

            {/* ================= TITLE ================= */}

            <label
              style={{
                display: "block",
                marginTop: 12,
              }}
            >
              Title
            </label>

            <input
              type="text"
              placeholder="Enter hero title"
              value={
                slide?.title || ""
              }
              onChange={(e) =>
                handleChange(
                  index,
                  "title",
                  e.target.value
                )
              }
            />

            {/* ================= DESCRIPTION ================= */}

            <label
              style={{
                display: "block",
                marginTop: 12,
              }}
            >
              Description
            </label>

            <textarea
              placeholder="Enter hero description"
              rows={5}
              value={
                slide?.description || ""
              }
              onChange={(e) =>
                handleChange(
                  index,
                  "description",
                  e.target.value
                )
              }
            />

            {/* ================= CTA 1 ================= */}

            <label
              style={{
                display: "block",
                marginTop: 12,
              }}
            >
              Primary CTA Text
            </label>

            <input
              type="text"
              placeholder="Example: Enquire Now"
              value={
                slide?.primary_cta_text ||
                ""
              }
              onChange={(e) =>
                handleChange(
                  index,
                  "primary_cta_text",
                  e.target.value
                )
              }
            />

            <label
              style={{
                display: "block",
                marginTop: 8,
              }}
            >
              Primary CTA Link
            </label>

            <input
              type="text"
              placeholder="Example: /contact"
              value={
                slide?.primary_cta_link ||
                ""
              }
              onChange={(e) =>
                handleChange(
                  index,
                  "primary_cta_link",
                  e.target.value
                )
              }
            />

            {/* ================= CTA 2 ================= */}

            <label
              style={{
                display: "block",
                marginTop: 12,
              }}
            >
              Secondary CTA Text
            </label>

            <input
              type="text"
              placeholder="Example: Learn More"
              value={
                slide?.secondary_cta_text ||
                ""
              }
              onChange={(e) =>
                handleChange(
                  index,
                  "secondary_cta_text",
                  e.target.value
                )
              }
            />

            <label
              style={{
                display: "block",
                marginTop: 8,
              }}
            >
              Secondary CTA Link
            </label>

            <input
              type="text"
              placeholder="Example: /about"
              value={
                slide?.secondary_cta_link ||
                ""
              }
              onChange={(e) =>
                handleChange(
                  index,
                  "secondary_cta_link",
                  e.target.value
                )
              }
            />

            {/* ================= IMAGE ================= */}

            <label
              style={{
                display: "block",
                marginTop: 15,
              }}
            >
              Hero Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImage(
                  index,
                  e.target.files?.[0]
                )
              }
            />

            <small
              style={{
                display: "block",
                marginTop: 5,
                color: "#666",
              }}
            >
              Maximum image size: 2MB
            </small>

            {/* ================= IMAGE PREVIEW ================= */}

            {slide?.preview && (
              <div
                style={{
                  marginTop: 12,
                }}
              >
                <img
                  src={slide.preview}
                  alt={
                    slide?.title ||
                    "Hero preview"
                  }
                  style={{
                    width: 220,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                    display: "block",
                  }}
                />

                {slide?.image && (
                  <small
                    style={{
                      display: "block",
                      marginTop: 5,
                      color: "#198754",
                    }}
                  >
                    New image selected
                  </small>
                )}

                {!slide?.image &&
                  slide?.image_url && (
                    <small
                      style={{
                        display: "block",
                        marginTop: 5,
                        color: "#666",
                      }}
                    >
                      Existing image
                    </small>
                  )}
              </div>
            )}

          </div>
        ))}

        {/* =================================================
            EMPTY MODAL STATE
        ================================================= */}

        {slides.length === 0 && (
          <div
            style={{
              padding: 20,
              textAlign: "center",
            }}
          >
            No hero slides available.
            <br />
            Click{" "}
            <strong>
              + Add Slide
            </strong>{" "}
            to create one.
          </div>
        )}

      </Modal>
    </div>
  );
}