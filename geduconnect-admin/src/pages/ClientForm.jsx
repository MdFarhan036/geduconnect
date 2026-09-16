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

        {/* UNIVERSITY SECTION */}

        {form.type === "university" && (
          <>
            <h3 className="section-title">
              University Information
            </h3>

            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({
                  ...form,
                  location: e.target.value,
                })
              }
            />

            <input
              placeholder="Established"
              value={form.established}
              onChange={(e) =>
                setForm({
                  ...form,
                  established: e.target.value,
                })
              }
            />

            <input
              placeholder="NAAC Grade"
              value={form.naac_grade}
              onChange={(e) =>
                setForm({
                  ...form,
                  naac_grade: e.target.value,
                })
              }
            />

            {/* APPROVALS */}

            <h3 className="section-title">Approvals</h3>

            <div className="checkbox-grid">
              {approvalOptions.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="checkbox"
                    checked={form.approvals.includes(
                      opt.id
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({
                          ...form,
                          approvals: [
                            ...form.approvals,
                            opt.id,
                          ],
                        });
                      } else {
                        setForm({
                          ...form,
                          approvals:
                            form.approvals.filter(
                              (id) => id !== opt.id
                            ),
                        });
                      }
                    }}
                  />

                  {opt.name}
                </label>
              ))}
            </div>

            {/* AFFILIATIONS */}

            <h3 className="section-title">
              Affiliations
            </h3>

            <div className="checkbox-grid">
              {affiliationOptions.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="checkbox"
                    checked={form.affiliations.includes(
                      opt.id
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({
                          ...form,
                          affiliations: [
                            ...form.affiliations,
                            opt.id,
                          ],
                        });
                      } else {
                        setForm({
                          ...form,
                          affiliations:
                            form.affiliations.filter(
                              (id) => id !== opt.id
                            ),
                        });
                      }
                    }}
                  />

                  {opt.name}
                </label>
              ))}
            </div>

            {/* PROGRAMS */}

            <h3 className="section-title">Programs</h3>

            <Select
              isMulti
              styles={customSelectStyles}
              options={programSelectOptions}
              placeholder="Select Programs..."
              value={programSelectOptions.filter(
                (opt) =>
                  form.programs.includes(opt.value)
              )}
              onChange={(selected) =>
                setForm({
                  ...form,
                  programs: selected
                    ? selected.map((s) => s.value)
                    : [],
                })
              }
            />

            {/* RANKINGS */}

            <h3 className="section-title">Rankings</h3>

            <div className="checkbox-grid">
              {rankingOptions.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="checkbox"
                    checked={form.rankings.includes(
                      opt.id
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({
                          ...form,
                          rankings: [
                            ...form.rankings,
                            opt.id,
                          ],
                        });
                      } else {
                        setForm({
                          ...form,
                          rankings:
                            form.rankings.filter(
                              (id) => id !== opt.id
                            ),
                        });
                      }
                    }}
                  />

                  {opt.name}
                </label>
              ))}
            </div>

            {/* TABS */}

            <div className="tabs-header">
              <h3 className="section-title">
                University Content Tabs
              </h3>

              <button
                type="button"
                className="btn primary"
                onClick={addTab}
              >
                + Add Tab
              </button>
            </div>

            {form.tabs.map((tab, index) => (
              <div
                key={tab.id}
                className="tab-card"
              >
                <input
                  placeholder="Tab Title"
                  value={tab.title}
                  onChange={(e) =>
                    updateTab(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Tab Slug"
                  value={tab.slug}
                  onChange={(e) =>
                    updateTab(
                      index,
                      "slug",
                      e.target.value
                    )
                  }
                />

                <textarea
                  rows={5}
                  placeholder="Tab Content"
                  value={tab.content}
                  onChange={(e) =>
                    updateTab(
                      index,
                      "content",
                      e.target.value
                    )
                  }
                />

                <button
                  className="btn danger"
                  onClick={() => deleteTab(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
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