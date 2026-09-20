import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const emptyForm = {
  title: "",
  subtitle: "",
  slug: "",
  description: "",
  html_content: "",
  sort_order: 1,
  meta_title: "",
  meta_description: "",
  is_active: 1,
  icon: null,
  icon_url: null,
  image: null,
  image_url: null,
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const BASE_URL = API_BASE.replace("/api", "");

export default function ServiceForm() {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);

  const [features, setFeatures] = useState([]);

  const [activeTab, setActiveTab] =
    useState("general");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (isEdit) {
      loadAll();
    }
  }, [id]);

  /* ================= LOAD ================= */

  const loadAll = async () => {
    setLoading(true);

    await Promise.all([
      loadService(),
      loadFeatures(),
    ]);

    setLoading(false);
  };

  const loadService = async () => {
    const res = await api.get(
      `/admin/services/${id}`
    );

    setForm({
      ...res.data,
      icon: null,
      image: null,
    });
  };

  const loadFeatures = async () => {
    const res = await api.get(
      `/admin/service-features/${id}`
    );

    setFeatures(res.data || []);
  };

  /* ================= HELPERS ================= */

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  /* ================= IMAGE UPLOAD ================= */

  const uploadContentImage =
    async (file) => {
      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      try {
        const res =
          await api.post(
            "/admin/upload-editor-image",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        return res.data.url;
      } catch (err) {
        console.error(err);

        alert(
          "Image upload failed"
        );

        return null;
      }
    };

  /* ================= SAVE ================= */

/* ================= SAVE ================= */

const saveService =
  async () => {
    if (
      !form.title.trim()
    ) {
      return alert(
        "Title is required"
      );
    }

    const fd =
      new FormData();

    fd.append(
      "title",
      form.title
    );

    fd.append(
      "subtitle",
      form.subtitle || ""
    );

    fd.append(
      "slug",
      form.slug ||
        generateSlug(
          form.title
        )
    );

    fd.append(
      "description",
      form.description ||
        ""
    );

    fd.append(
      "html_content",
      form.html_content ||
        ""
    );

    fd.append(
      "sort_order",
      form.sort_order || 1
    );

    fd.append(
      "meta_title",
      form.meta_title ||
        ""
    );

    fd.append(
      "meta_description",
      form.meta_description ||
        ""
    );

    fd.append(
      "is_active",
      form.is_active
    );

    if (form.icon) {
      fd.append(
        "icon",
        form.icon
      );
    }

    if (form.image) {
      fd.append(
        "image",
        form.image
      );
    }

    try {
      if (isEdit) {
        await api.put(
          `/admin/services/${id}`,
          fd
        );

        alert(
          "Service Updated"
        );
      } else {
        const res =
          await api.post(
            `/admin/services`,
            fd
          );

        alert(
          "Service Created"
        );

        navigate(
          `/admin/services/edit/${res.data.id}`
        );
      }
    } catch (err) {
      console.error(err);

      alert(
        "Error saving service"
      );
    }
  };

/* ================= SAVE FEATURE ================= */

const saveFeature =
  async (f) => {
    const fd =
      new FormData();

    fd.append(
      "title",
      f.title
    );

    fd.append(
      "description",
      f.description
    );

    fd.append(
      "sort_order",
      f.sort_order || 1
    );

    fd.append(
      "is_active",
      f.is_active ?? 1
    );

    if (f.icon) {
      fd.append(
        "icon",
        f.icon
      );
    }

    try {
      await api.put(
        `/admin/service-features/${f.id}`,
        fd
      );

      loadFeatures();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to save feature"
      );
    }
  };
  /* ================= FEATURES ================= */

  const addFeature =
    async () => {
      if (!isEdit) {
        return alert(
          "Save service first"
        );
      }

      await api.post(
        "/admin/service-features",
        {
          service_id: id,
          title: "New Feature",
          description: "",
          sort_order:
            features.length +
            1,
          is_active: 1,
        }
      );

      loadFeatures();
    };

  const deleteFeature =
    async (fid) => {
      if (
        !window.confirm(
          "Delete feature?"
        )
      ) {
        return;
      }

      await api.delete(
        `/admin/service-features/${fid}`
      );

      loadFeatures();
    };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="admin-page">
        Loading...
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* ================= HEADER ================= */}

      <div className="page-header">
        <button
          onClick={() =>
            navigate(
              "/admin/services"
            )
          }
        >
          ← Back
        </button>

        <h2>
          {isEdit
            ? "Edit Service"
            : "Create Service"}
        </h2>

        {isEdit &&
          form.is_active ===
            1 && (
            <button
              className="btn info"
              onClick={() =>
                window.open(
                  `/services/${form.slug}`,
                  "_blank"
                )
              }
            >
              View Page
            </button>
          )}

        <button
          className="btn primary"
          onClick={saveService}
        >
          Save Service
        </button>
      </div>

      {/* ================= TABS ================= */}

      <div className="tab-header">
        <button
          onClick={() =>
            setActiveTab(
              "general"
            )
          }
        >
          General
        </button>

        {isEdit && (
          <button
            onClick={() =>
              setActiveTab(
                "features"
              )
            }
          >
            Features
          </button>
        )}
      </div>

      {/* ================= GENERAL TAB ================= */}

      {activeTab ===
        "general" && (
        <div className="card">
          {/* TITLE */}

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
                  e.target.value,
                slug: isEdit
                  ? form.slug
                  : generateSlug(
                      e.target
                        .value
                    ),
              })
            }
          />

          {/* SUBTITLE */}

          <input
            placeholder="Subtitle"
            value={
              form.subtitle ||
              ""
            }
            onChange={(e) =>
              setForm({
                ...form,
                subtitle:
                  e.target.value,
              })
            }
          />

          {/* SLUG */}

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug:
                  e.target.value,
              })
            }
          />

          {/* DESCRIPTION */}

          <textarea
            placeholder="Short Description For Cards"
            rows={4}
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
          />

          {/* HTML EDITOR */}

          <div
            className="html-editor-wrapper"
            style={{
              marginTop: 20,
            }}
          >
            <label
              style={{
                fontWeight: 600,
                marginBottom: 10,
                display:
                  "block",
              }}
            >
              Full Service
              Page Content
            </label>

            {/* TOOLBAR */}

            <div
              className="editor-toolbar"
              style={{
                display:
                  "flex",
                gap: 10,
                flexWrap:
                  "wrap",
                marginBottom: 15,
              }}
            >
              {/* IMAGE */}

              <input
                type="file"
                accept="image/*"
                onChange={async (
                  e
                ) => {
                  const file =
                    e.target
                      .files[0];

                  if (
                    !file
                  ) {
                    return;
                  }

                  const imageUrl =
                    await uploadContentImage(
                      file
                    );

                  if (
                    !imageUrl
                  ) {
                    return;
                  }

                  setForm({
                    ...form,
                    html_content:
                      form.html_content +
                      `

<div class="content-image">
  <img src="${imageUrl}" alt="${form.title}" />
</div>

`,
                  });
                }}
              />

              {/* H2 */}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    html_content:
                      form.html_content +
                      "\n<h2>Heading</h2>\n",
                  })
                }
              >
                + H2
              </button>

              {/* PARAGRAPH */}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    html_content:
                      form.html_content +
                      "\n<p>Paragraph</p>\n",
                  })
                }
              >
                + Paragraph
              </button>

              {/* LIST */}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    html_content:
                      form.html_content +
                      "\n<ul>\n<li>Item</li>\n</ul>\n",
                  })
                }
              >
                + List
              </button>

              {/* FAQ */}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    html_content:
                      form.html_content +
                      `

<div class="faq-item">
  <h3>Question?</h3>
  <p>Answer here...</p>
</div>

`,
                  })
                }
              >
                + FAQ
              </button>

              {/* TABLE */}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    html_content:
                      form.html_content +
                      `

<table>
  <tr>
    <th>Heading</th>
    <th>Heading</th>
  </tr>

  <tr>
    <td>Content</td>
    <td>Content</td>
  </tr>
</table>

`,
                  })
                }
              >
                + Table
              </button>

              {/* CTA */}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    html_content:
                      form.html_content +
                      `

<section class="service-cta">
  <h2>Need Help?</h2>

  <p>
    Contact our expert team today.
  </p>

  <a href="/contact-us">
    Contact Us
  </a>
</section>

`,
                  })
                }
              >
                + CTA
              </button>
            </div>

            {/* TEXTAREA */}

            <textarea
              rows={25}
              placeholder="Write complete HTML page content..."
              value={
                form.html_content ||
                ""
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  html_content:
                    e.target
                      .value,
                })
              }
              style={{
                width: "100%",
                minHeight:
                  "700px",
                padding:
                  "20px",
                borderRadius:
                  "14px",
                border:
                  "1px solid #d1d5db",
                fontFamily:
                  "monospace",
                fontSize:
                  "14px",
                lineHeight:
                  "1.7",
                background:
                  "#0f172a",
                color:
                  "#f8fafc",
                resize:
                  "vertical",
              }}
            />

            {/* LIVE PREVIEW */}

            <div
              style={{
                marginTop: 30,
                borderTop:
                  "1px solid #e5e7eb",
                paddingTop: 20,
              }}
            >
              <h3>
                Live Preview
              </h3>

              <div
                className="service-preview"
                dangerouslySetInnerHTML={{
                  __html:
                    form.html_content ||
                    "",
                }}
              />
            </div>
          </div>

          {/* META TITLE */}

          <input
            placeholder="Meta Title"
            value={
              form.meta_title
            }
            onChange={(e) =>
              setForm({
                ...form,
                meta_title:
                  e.target.value,
              })
            }
          />

          {/* META DESCRIPTION */}

          <textarea
            placeholder="Meta Description"
            rows={4}
            value={
              form.meta_description
            }
            onChange={(e) =>
              setForm({
                ...form,
                meta_description:
                  e.target.value,
              })
            }
          />

          {/* SORT */}

          <input
            type="number"
            value={
              form.sort_order
            }
            onChange={(e) =>
              setForm({
                ...form,
                sort_order:
                  e.target.value,
              })
            }
          />

          {/* ACTIVE */}

          <label>
            <input
              type="checkbox"
              checked={
                form.is_active ===
                1
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  is_active:
                    e.target
                      .checked
                      ? 1
                      : 0,
                })
              }
            />

            Active
          </label>

          {/* ICON */}

          {form.icon_url && (
            <img
              src={`${BASE_URL}${form.icon_url}`}
              alt=""
              style={{
                width: 80,
                marginTop: 10,
              }}
            />
          )}

          <input
            type="file"
            onChange={(e) =>
              setForm({
                ...form,
                icon:
                  e.target
                    .files[0],
              })
            }
          />

          {/* IMAGE */}

          {form.image_url && (
            <img
              src={`${BASE_URL}${form.image_url}`}
              alt=""
              style={{
                width: 120,
                marginTop: 10,
              }}
            />
          )}

          <input
            type="file"
            onChange={(e) =>
              setForm({
                ...form,
                image:
                  e.target
                    .files[0],
              })
            }
          />
        </div>
      )}

      {/* ================= FEATURES ================= */}

      {activeTab ===
        "features" && (
        <div className="card">
          <button
            onClick={
              addFeature
            }
          >
            + Add Feature
          </button>

          {features.map(
            (f) => (
              <div
                key={f.id}
                className="feature-card"
              >
                <input
                  value={
                    f.title
                  }
                  onChange={(
                    e
                  ) =>
                    setFeatures(
                      features.map(
                        (
                          x
                        ) =>
                          x.id ===
                          f.id
                            ? {
                                ...x,
                                title:
                                  e
                                    .target
                                    .value,
                              }
                            : x
                      )
                    )
                  }
                />

                <textarea
                  value={
                    f.description
                  }
                  onChange={(
                    e
                  ) =>
                    setFeatures(
                      features.map(
                        (
                          x
                        ) =>
                          x.id ===
                          f.id
                            ? {
                                ...x,
                                description:
                                  e
                                    .target
                                    .value,
                              }
                            : x
                      )
                    )
                  }
                />

                {f.icon_url && (
                  <img
                    src={`${BASE_URL}${f.icon_url}`}
                    alt=""
                    style={{
                      width: 60,
                    }}
                  />
                )}

                <input
                  type="file"
                  onChange={(
                    e
                  ) =>
                    setFeatures(
                      features.map(
                        (
                          x
                        ) =>
                          x.id ===
                          f.id
                            ? {
                                ...x,
                                icon:
                                  e
                                    .target
                                    .files[0],
                              }
                            : x
                      )
                    )
                  }
                />

                <button
                  onClick={() =>
                    saveFeature(
                      f
                    )
                  }
                >
                  Save
                </button>

                <button
                  onClick={() =>
                    deleteFeature(
                      f.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}