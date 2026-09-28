import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Select from "react-select";

/* ================= EMPTY FORM ================= */

const emptyForm = {
  name: "",
  slug: "",
  description: "",

  type: "partner",
  mode: "",

  sort_order: 1,
  is_active: 1,

  logo: null,
  logo_url: null,

  /* UNIVERSITY INFO */
  location: "",
  established: "",
  naac_grade: "",

  meta_title: "",
  meta_description: "",
  seo_keywords: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image: "",
  robots: "index, follow",

  programs: [],
  approvals: [],
  affiliations: [],
  rankings: [],

  placement: {
    highest_package: "",
    average_package: "",
    placement_rate: "",
  },

  tabs: [],
};

/* ================= COMPONENT ================= */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_BASE_URL ||
  API_BASE_URL.replace(/\/api\/?$/, "");
export default function ClientForm() {
  const { id } = useParams();

  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  const [approvalOptions, setApprovalOptions] = useState([]);
  const [affiliationOptions, setAffiliationOptions] = useState([]);
  const [rankingOptions, setRankingOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  /* ================= UNIVERSITY CAROUSEL ================= */

  const [carouselImages, setCarouselImages] = useState([]);
  const [carouselFiles, setCarouselFiles] = useState([]);
  const [carouselUploading, setCarouselUploading] = useState(false);

  /* ================= HELPERS ================= */

  const generateSlug = (text) =>
    text
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/(^-|-$)+/g, "");

  /* ================= LOAD MASTER DATA ================= */

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/admin/approvals"),
          api.get("/admin/affiliations"),
          api.get("/admin/rankings"),
          api.get("/admin/programs"),
        ]);

        /* APPROVALS */
        if (results[0].status === "fulfilled") {
          setApprovalOptions(results[0].value.data || []);
        }

        /* AFFILIATIONS */
        if (results[1].status === "fulfilled") {
          setAffiliationOptions(results[1].value.data || []);
        }

        /* RANKINGS */
        if (results[2].status === "fulfilled") {
          setRankingOptions(results[2].value.data || []);
        }

        /* PROGRAMS */
        if (results[3].status === "fulfilled") {
          setProgramOptions(results[3].value.data || []);
        }
      } catch (err) {
        console.error("Master load failed", err);
      }
    };

    loadMasters();
  }, []);

  /* ================= LOAD EDIT DATA ================= */

  useEffect(() => {
    if (!editing) return;

    const load = async () => {
      try {
        const res = await api.get(`/admin/clients/${id}`);

        const row = res.data;

        /* LOAD UNIVERSITY CAROUSEL IMAGES */
        if (row.type === "university") {
          try {
            const imageRes = await api.get(
              `/university-images/admin/${id}`
            );

            setCarouselImages(
              Array.isArray(imageRes.data?.data)
                ? imageRes.data.data
                : []
            );
          } catch (imageErr) {
            console.error("Carousel images load failed", imageErr);
            setCarouselImages([]);
          }
        }

        let extra = {};

        try {
          extra =
            typeof row.extra_data === "string"
              ? JSON.parse(row.extra_data || "{}")
              : row.extra_data || {};
        } catch (err) {
          console.error("Invalid extra_data JSON");
        }

        setForm({
          ...emptyForm,

          ...row,

          location: extra.location || "",
          established: extra.established || "",
          naac_grade: extra.naac_grade || "",

          meta_title: extra.meta_title || "",
          meta_description: extra.meta_description || "",

          programs: extra.programs || [],
          approvals: (extra.approvals || []).map(Number),
          affiliations: (extra.affiliations || []).map(Number),
          rankings: (extra.rankings || []).map(Number),

          placement:
            extra.placement || emptyForm.placement,

          tabs: extra.tabs || [],
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      }
    };

    load();
  }, [editing, id]);

  /* ================= CAROUSEL FUNCTIONS ================= */

  const uploadCarouselImages = async () => {
    if (!editing || !id) {
      alert("Please save the university first.");
      return;
    }

    if (!carouselFiles.length) {
      alert("Please select images.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    // ================= VALIDATION =================

    for (const file of carouselFiles) {
      if (file.size > MAX_SIZE) {
        alert(`${file.name} is larger than 5 MB.`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(
          `${file.name} is not supported. Only JPG, JPEG, PNG and WEBP are allowed.`
        );
        return;
      }
    }

    try {
      setCarouselUploading(true);

      // ================= UPLOAD EACH IMAGE =================

      for (let index = 0; index < carouselFiles.length; index++) {
        const file = carouselFiles[index];

        const fd = new FormData();

        fd.append("image", file);

        fd.append(
          "image_alt",
          `${form.name || "University"} university image`
        );

        fd.append(
          "sort_order",
          String(carouselImages.length + index)
        );

        fd.append("is_active", "1");

        /*
         * IMPORTANT:
         * Do NOT manually set Content-Type here.
         * Axios/browser will automatically add:
         *
         * multipart/form-data; boundary=....
         */
        await api.post(
          `/university-images/admin/${id}`,
          fd
        );
      }

      // ================= REFRESH IMAGES =================

      const res = await api.get(
        `/university-images/admin/${id}`
      );

      setCarouselImages(
        Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );

      setCarouselFiles([]);

      // reset file input
      const input =
        document.getElementById(
          "university-carousel-upload"
        );

      if (input) {
        input.value = "";
      }

      alert("Carousel images uploaded successfully.");
    } catch (err) {
      console.error(
        "Carousel upload failed:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to upload carousel images."
      );
    } finally {
      setCarouselUploading(false);
    }
  };

  const deleteCarouselImage = async (imageId) => {
    if (!window.confirm("Delete this carousel image?")) return;

    try {
      await api.delete(
        `/university-images/admin/${imageId}`
      );

      setCarouselImages((prev) =>
        prev.filter((image) => image.id !== imageId)
      );
    } catch (err) {
      console.error("Delete carousel image failed", err);
      alert("Failed to delete carousel image");
    }
  };

  const toggleCarouselImage = async (image) => {
    try {
      const nextStatus = Number(image.is_active) === 1 ? 0 : 1;

      const res = await api.put(
        `/university-images/admin/${image.id}`,
        {
          is_active: nextStatus,
        }
      );

      const updated = res.data?.data || res.data;

      setCarouselImages((prev) =>
        prev.map((item) =>
          item.id === image.id
            ? { ...item, ...updated, is_active: nextStatus }
            : item
        )
      );
    } catch (err) {
      console.error("Toggle carousel image failed", err);
      alert("Failed to update image status");
    }
  };

  const moveCarouselImage = async (index, direction) => {
    const newIndex = index + direction;

    if (
      newIndex < 0 ||
      newIndex >= carouselImages.length
    ) {
      return;
    }

    const reordered = [...carouselImages];
    [reordered[index], reordered[newIndex]] = [
      reordered[newIndex],
      reordered[index],
    ];

    const orderedIds = reordered.map((image) => image.id);

    try {
      setCarouselImages(reordered);

      await api.put(
        `/university-images/admin/${id}/reorder`,
        { image_ids: orderedIds }
      );
    } catch (err) {
      console.error("Reorder carousel images failed", err);
      alert("Failed to reorder carousel images");

      const imageRes = await api.get(
        `/university-images/admin/${id}`
      );

      setCarouselImages(
        Array.isArray(imageRes.data?.data)
          ? imageRes.data.data
          : []
      );
    }
  };

  /* ================= SAVE ================= */

  const save = async () => {
    if (!form.name.trim()) {
      alert("Name required");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();

      fd.append("name", form.name);

      fd.append(
        "slug",
        form.slug || generateSlug(form.name)
      );

      fd.append("description", form.description || "");

      fd.append("type", form.type);

      fd.append("mode", form.mode);

      fd.append("sort_order", form.sort_order);

      fd.append("is_active", form.is_active);

      /* EXTRA DATA */

      const extraData = {
        location: form.location,
        established: form.established,
        naac_grade: form.naac_grade,

        meta_title: form.meta_title,
        meta_description: form.meta_description,
        seo_keywords: form.seo_keywords,
        canonical_url: form.canonical_url,
        og_title: form.og_title,
        og_description: form.og_description,
        og_image: form.og_image,
        robots: form.robots,

        programs: form.programs,
        approvals: form.approvals,
        affiliations: form.affiliations,
        rankings: form.rankings,

        placement: form.placement,

        tabs: form.tabs,
      };

      fd.append(
        "extra_data",
        JSON.stringify(extraData)
      );

      if (form.logo) {
        fd.append("logo", form.logo);
      }

      if (editing) {
        await api.put(`/admin/clients/${id}`, fd);
      } else {
        await api.post("/admin/clients", fd);
      }

      alert("Saved successfully!");

      navigate("/clients");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= TABS ================= */

  const addTab = () => {
    setForm({
      ...form,

      tabs: [
        ...form.tabs,

        {
          id: Date.now().toString(),
          title: "",
          slug: "",
          content: "",
        },
      ],
    });
  };

  const updateTab = (index, field, value) => {
    const updated = [...form.tabs];

    updated[index][field] = value;

    if (field === "title") {
      updated[index].slug = generateSlug(value);
    }

    setForm({
      ...form,
      tabs: updated,
    });
  };

  const deleteTab = (index) => {
    setForm({
      ...form,
      tabs: form.tabs.filter((_, i) => i !== index),
    });
  };

  /* ================= SELECT STYLES ================= */

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 45,
      borderRadius: 8,
      borderColor: state.isFocused
        ? "#2563eb"
        : "#d1d5db",

      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(37,99,235,.2)"
        : "none",

      "&:hover": {
        borderColor: "#2563eb",
      },
    }),
  };

  const programSelectOptions = programOptions.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  /* ================= UI ================= */

  return (
    <div className="highlight-admin">
      {/* HEADER */}

      <div className="page-header">
        <h2>
          {editing ? "Edit" : "Add"} Client / University
        </h2>

        <button
          className="btn"
          onClick={() => navigate("/clients")}
        >
          Back
        </button>
      </div>

      {/* FORM */}

      <div className="form-wrapper">
        {/* NAME */}

        <label>Name</label>

        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
              slug: generateSlug(e.target.value),
            })
          }
        />

        {/* SLUG */}

        <label>Slug</label>

        <input
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        {/* DESCRIPTION */}

        <label>Description</label>

        <textarea
          rows={6}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        {/* SEO SECTION */}

        <h3 className="section-title">SEO Settings</h3>

        <label>Meta Title</label>
        <input
          type="text"
          maxLength={60}
          placeholder="SEO title (recommended: 50–60 characters)"
          value={form.meta_title}
          onChange={(e) =>
            setForm({
              ...form,
              meta_title: e.target.value,
            })
          }
        />

        <label>Meta Description</label>
        <textarea
          rows={4}
          maxLength={160}
          placeholder="SEO description (recommended: 140–160 characters)"
          value={form.meta_description}
          onChange={(e) =>
            setForm({
              ...form,
              meta_description: e.target.value,
            })
          }
        />

        <label>SEO Keywords</label>
        <input
          type="text"
          placeholder="university, online mba, distance education"
          value={form.seo_keywords}
          onChange={(e) =>
            setForm({
              ...form,
              seo_keywords: e.target.value,
            })
          }
        />

        <label>Canonical URL</label>
        <input
          type="url"
          placeholder="https://geduconnect.com/university/example"
          value={form.canonical_url}
          onChange={(e) =>
            setForm({
              ...form,
              canonical_url: e.target.value,
            })
          }
        />

        <label>OG Title</label>
        <input
          type="text"
          placeholder="Social sharing title"
          value={form.og_title}
          onChange={(e) =>
            setForm({
              ...form,
              og_title: e.target.value,
            })
          }
        />

        <label>OG Description</label>
        <textarea
          rows={3}
          placeholder="Social sharing description"
          value={form.og_description}
          onChange={(e) =>
            setForm({
              ...form,
              og_description: e.target.value,
            })
          }
        />

        <label>OG Image URL</label>
        <input
          type="url"
          placeholder="https://geduconnect.com/uploads/..."
          value={form.og_image}
          onChange={(e) =>
            setForm({
              ...form,
              og_image: e.target.value,
            })
          }
        />

        <label>Robots</label>
        <select
          value={form.robots}
          onChange={(e) =>
            setForm({
              ...form,
              robots: e.target.value,
            })
          }
        >
          <option value="index, follow">Index, Follow</option>
          <option value="noindex, follow">Noindex, Follow</option>
          <option value="index, nofollow">Index, Nofollow</option>
          <option value="noindex, nofollow">Noindex, Nofollow</option>
        </select>

        {/* LOGO */}

        <label>Logo</label>

        <input
          type="file"
          onChange={(e) =>
            setForm({
              ...form,
              logo: e.target.files[0],
            })
          }
        />

        {/* TYPE */}

        <label>Type</label>

        <select
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
        >
          <option value="client">Client</option>
          <option value="partner">Partner</option>
          <option value="university">University</option>
        </select>

        {/* MODE */}

        <label>Mode</label>

        <select
          value={form.mode}
          onChange={(e) =>
            setForm({
              ...form,
              mode: e.target.value,
            })
          }
        >
          <option value="online">Online</option>
          <option value="regular">Regular</option>
          <option value="distance">Distance</option>
        </select>

       {/* =====================================================
    UNIVERSITY CAROUSEL IMAGES
===================================================== */}

{form.type === "university" && (
  <section
    style={{
      marginTop: "30px",
      padding: "24px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      background: "#ffffff",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px",
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          University Carousel Images
        </h3>

        <p
          style={{
            margin: "6px 0 0",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Upload and manage images displayed in the
          university hero carousel.
        </p>
      </div>
    </div>

    {/* ================= UPLOAD ================= */}

    <div
      style={{
        padding: "18px",
        background: "#f9fafb",
        borderRadius: "10px",
        border: "1px dashed #d1d5db",
        marginBottom: "24px",
      }}
    >
      <input
        id="university-carousel-upload"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={(e) => {
          setCarouselFiles(
            Array.from(e.target.files || [])
          );
        }}
        style={{ display: "none" }}
      />

      <label
        htmlFor="university-carousel-upload"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 18px",
          borderRadius: "8px",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Select Images
      </label>

      <button
        type="button"
        onClick={uploadCarouselImages}
        disabled={
          carouselUploading ||
          !carouselFiles.length
        }
        style={{
          marginLeft: "10px",
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          background:
            carouselUploading ||
            !carouselFiles.length
              ? "#9ca3af"
              : "#16a34a",
          color: "#fff",
          cursor:
            carouselUploading ||
            !carouselFiles.length
              ? "not-allowed"
              : "pointer",
          fontWeight: "600",
        }}
      >
        {carouselUploading
          ? "Uploading..."
          : `Upload ${
              carouselFiles.length
                ? `(${carouselFiles.length})`
                : ""
            }`}
      </button>

      {/* Selected files */}

      {carouselFiles.length > 0 && (
        <div
          style={{
            marginTop: "15px",
            fontSize: "14px",
            color: "#374151",
          }}
        >
          <strong>
            Selected Images:
          </strong>

          <ul
            style={{
              marginTop: "8px",
              paddingLeft: "20px",
            }}
          >
            {carouselFiles.map(
              (file, index) => (
                <li key={index}>
                  {file.name}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>

    {/* ================= EXISTING IMAGES ================= */}

    {carouselImages.length === 0 ? (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          color: "#6b7280",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
        }}
      >
        No carousel images uploaded yet.
      </div>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {carouselImages.map(
          (image, index) => {
       const imageSrc =
  image.image_url?.startsWith("http")
    ? image.image_url
    : `${ASSET_BASE_URL}${image.image_url}`;

            const isActive =
              Number(image.is_active) === 1;

            return (
              <div
                key={image.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                {/* IMAGE */}

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "170px",
                    background: "#f3f4f6",
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={
                      image.image_alt ||
                      "University carousel"
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: isActive
                        ? 1
                        : 0.45,
                    }}
                    onError={(e) => {
                      console.error(
                        "Carousel image failed:",
                        imageSrc
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "5px 9px",
                      borderRadius: "20px",
                      background: isActive
                        ? "#16a34a"
                        : "#6b7280",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* DETAILS */}

                <div
                  style={{
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    Image #{index + 1}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginBottom: "14px",
                      wordBreak: "break-word",
                    }}
                  >
                    Order: {index + 1}
                  </div>

                  {/* ORDER */}

                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveCarouselImage(
                          index,
                          -1
                        )
                      }
                      style={{
                        flex: 1,
                        padding: "7px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        background:
                          index === 0
                            ? "#f3f4f6"
                            : "#fff",
                        cursor:
                          index === 0
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        carouselImages.length - 1
                      }
                      onClick={() =>
                        moveCarouselImage(
                          index,
                          1
                        )
                      }
                      style={{
                        flex: 1,
                        padding: "7px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        background:
                          index ===
                          carouselImages.length - 1
                            ? "#f3f4f6"
                            : "#fff",
                        cursor:
                          index ===
                          carouselImages.length - 1
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      ↓
                    </button>
                  </div>

                  {/* STATUS */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleCarouselImage(
                        image
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "none",
                      borderRadius: "6px",
                      background: isActive
                        ? "#f59e0b"
                        : "#16a34a",
                      color: "#fff",
                      cursor: "pointer",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    {isActive
                      ? "Disable Image"
                      : "Enable Image"}
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      deleteCarouselImage(
                        image.id
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#dc2626",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Delete Image
                  </button>
                </div>
              </div>
            );
          }
        )}
      </div>
    )}
  </section>
)}
        {/* SORT ORDER */}

        <label>Sort Order</label>

        <input
          type="number"
          value={form.sort_order}
          onChange={(e) =>
            setForm({
              ...form,
              sort_order: e.target.value,
            })
          }
        />

        {/* ACTIVE */}

        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={Number(form.is_active) === 1}
            onChange={(e) =>
              setForm({
                ...form,
                is_active: e.target.checked ? 1 : 0,
              })
            }
          />

          Active
        </label>

        {/* SAVE */}

        <button
          className="btn primary"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}