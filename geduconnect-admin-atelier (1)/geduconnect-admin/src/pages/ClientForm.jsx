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

  /* SEO */
  meta_title: "",
  meta_description: "",
  seo_keywords: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image: "",
  robots: "index, follow",

  courses: [],
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

/* ================= API / ASSET HELPERS ================= */

const getAssetUrl = (path) => {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const apiBaseUrl = api?.defaults?.baseURL || "";
  const assetBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");

  return `${assetBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* ================= COMPONENT ================= */

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  /* ================= MASTER DATA ================= */

  const [approvalOptions, setApprovalOptions] = useState([]);
  const [affiliationOptions, setAffiliationOptions] = useState([]);
  const [rankingOptions, setRankingOptions] = useState([]);
  const [modeOptions, setModeOptions] = useState([]);

  /* ================= MODE FILTERED DATA ================= */

  const [courseOptions, setCourseOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

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
          api.get("/admin/modes"),
        ]);

        if (results[0].status === "fulfilled") {
          setApprovalOptions(
            Array.isArray(results[0].value.data)
              ? results[0].value.data
              : []
          );
        }

        if (results[1].status === "fulfilled") {
          setAffiliationOptions(
            Array.isArray(results[1].value.data)
              ? results[1].value.data
              : []
          );
        }

        if (results[2].status === "fulfilled") {
          setRankingOptions(
            Array.isArray(results[2].value.data)
              ? results[2].value.data
              : []
          );
        }

        if (results[3].status === "fulfilled") {
          const modes = Array.isArray(results[3].value.data)
            ? results[3].value.data
            : results[3].value.data?.modes || [];

          setModeOptions(modes);
        }
      } catch (err) {
        console.error("Master load failed:", err);
      }
    };

    loadMasters();
  }, []);

  /* ================= FETCH COURSES BY MODE ================= */

  const fetchCoursesByMode = async (mode) => {
    if (!mode) {
      setCourseOptions([]);
      setProgramOptions([]);
      return [];
    }

    try {
      setLoadingCourses(true);

      const response = await api.get(
        `/admin/courses?mode=${encodeURIComponent(mode)}`
      );

      const courses = Array.isArray(response.data)
        ? response.data
        : response.data?.courses || [];

      const activeCourses = courses.filter(
        (course) => Number(course.is_active) === 1
      );

      setCourseOptions(activeCourses);
      return activeCourses;
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourseOptions([]);
      return [];
    } finally {
      setLoadingCourses(false);
    }
  };

  /* ================= FETCH PROGRAMS BY MODE + COURSES ================= */

  const fetchProgramsByModeAndCourses = async (
    mode,
    courseIds
  ) => {
    if (
      !mode ||
      !Array.isArray(courseIds) ||
      courseIds.length === 0
    ) {
      setProgramOptions([]);
      return [];
    }

    try {
      setLoadingPrograms(true);

      const requests = courseIds.map((courseId) =>
        api.get(
          `/admin/programs?mode=${encodeURIComponent(
            mode
          )}&course_id=${courseId}`
        )
      );

      const responses = await Promise.all(requests);

      const allPrograms = responses.flatMap((response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        }

        return response.data?.programs || [];
      });

      const uniquePrograms = Array.from(
        new Map(
          allPrograms.map((program) => [
            program.id,
            program,
          ])
        ).values()
      );

      const activePrograms = uniquePrograms.filter(
        (program) => Number(program.is_active) === 1
      );

      setProgramOptions(activePrograms);
      return activePrograms;
    } catch (error) {
      console.error("Failed to load programs:", error);
      setProgramOptions([]);
      return [];
    } finally {
      setLoadingPrograms(false);
    }
  };

  /* ================= LOAD EDIT DATA ================= */

  useEffect(() => {
    if (!editing) return;

    const load = async () => {
      try {
        const res = await api.get(`/admin/clients/${id}`);
        const row = res.data;

        /* CAROUSEL */
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
            console.error(
              "Carousel images load failed",
              imageErr
            );
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
          console.error("Invalid extra_data JSON:", err);
        }

        const existingCourses = (
          extra.courses || []
        ).map(Number);

        const existingPrograms = (
          extra.programs || []
        ).map(Number);

        const existingMode = row.mode || "";

        setForm({
          ...emptyForm,
          ...row,

          mode: existingMode,

          location: extra.location || "",
          established: extra.established || "",
          naac_grade: extra.naac_grade || "",

          /* COMPLETE SEO RESTORE */
          meta_title: extra.meta_title || "",
          meta_description: extra.meta_description || "",
          seo_keywords: extra.seo_keywords || "",
          canonical_url: extra.canonical_url || "",
          og_title: extra.og_title || "",
          og_description: extra.og_description || "",
          og_image: extra.og_image || "",
          robots: extra.robots || "index, follow",

          courses: existingCourses,
          programs: existingPrograms,

          approvals: (extra.approvals || []).map(Number),
          affiliations: (extra.affiliations || []).map(Number),
          rankings: (extra.rankings || []).map(Number),

          placement:
            extra.placement || emptyForm.placement,

          tabs: extra.tabs || [],
        });

        /* RESTORE MODE -> COURSES -> PROGRAMS */
        if (existingMode) {
          const courses = await fetchCoursesByMode(
            existingMode
          );

          const validCourseIds = courses
            .filter((course) =>
              existingCourses.includes(Number(course.id))
            )
            .map((course) => Number(course.id));

          if (validCourseIds.length) {
            const programs =
              await fetchProgramsByModeAndCourses(
                existingMode,
                validCourseIds
              );

            const validProgramIds = programs
              .filter((program) =>
                existingPrograms.includes(Number(program.id))
              )
              .map((program) => Number(program.id));

            setForm((prev) => ({
              ...prev,
              courses: validCourseIds,
              programs: validProgramIds,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load university:", err);
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

      for (
        let index = 0;
        index < carouselFiles.length;
        index++
      ) {
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

        await api.post(
          `/university-images/admin/${id}`,
          fd
        );
      }

      const res = await api.get(
        `/university-images/admin/${id}`
      );

      setCarouselImages(
        Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );

      setCarouselFiles([]);

      const input = document.getElementById(
        "university-carousel-upload"
      );

      if (input) input.value = "";

      alert("Carousel images uploaded successfully.");
    } catch (err) {
      console.error("Carousel upload failed:", err);

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
      console.error(
        "Delete carousel image failed",
        err
      );
      alert("Failed to delete carousel image");
    }
  };

  const toggleCarouselImage = async (image) => {
    try {
      const nextStatus =
        Number(image.is_active) === 1 ? 0 : 1;

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
            ? {
                ...item,
                ...updated,
                is_active: nextStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Toggle carousel image failed",
        err
      );
      alert("Failed to update image status");
    }
  };

  const moveCarouselImage = async (
    index,
    direction
  ) => {
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

    const orderedIds = reordered.map(
      (image) => image.id
    );

    try {
      setCarouselImages(reordered);

      await api.put(
        `/university-images/admin/${id}/reorder`,
        { image_ids: orderedIds }
      );
    } catch (err) {
      console.error(
        "Reorder carousel images failed",
        err
      );

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

    if (
      form.type === "university" &&
      !form.mode
    ) {
      alert("Please select university mode");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();

      fd.append("name", form.name.trim());
      fd.append(
        "slug",
        form.slug || generateSlug(form.name)
      );
      fd.append(
        "description",
        form.description || ""
      );
      fd.append("type", form.type);
      fd.append("mode", form.mode || "");
      fd.append("sort_order", form.sort_order);
      fd.append("is_active", form.is_active);

      /* EXTRA DATA */

      const extraData = {
        location: form.location,
        established: form.established,
        naac_grade: form.naac_grade,

        /* COMPLETE SEO */
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        seo_keywords: form.seo_keywords,
        canonical_url: form.canonical_url,
        og_title: form.og_title,
        og_description: form.og_description,
        og_image: form.og_image,
        robots: form.robots,

        courses: form.courses,
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
        await api.put(
          `/admin/clients/${id}`,
          fd
        );
      } else {
        await api.post(
          "/admin/clients",
          fd
        );
      }

      alert("Saved successfully!");
      navigate("/clients");
    } catch (err) {
      console.error("Save failed:", err);

      alert(
        err?.response?.data?.message ||
          "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= TABS ================= */

  const addTab = () => {
    setForm((prev) => ({
      ...prev,
      tabs: [
        ...prev.tabs,
        {
          id: Date.now().toString(),
          title: "",
          slug: "",
          content: "",
        },
      ],
    }));
  };

  const updateTab = (
    index,
    field,
    value
  ) => {
    const updated = [...form.tabs];

    updated[index][field] = value;

    if (field === "title") {
      updated[index].slug =
        generateSlug(value);
    }

    setForm((prev) => ({
      ...prev,
      tabs: updated,
    }));
  };

  const deleteTab = (index) => {
    setForm((prev) => ({
      ...prev,
      tabs: prev.tabs.filter(
        (_, i) => i !== index
      ),
    }));
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

  const courseSelectOptions =
    courseOptions.map((course) => ({
      value: Number(course.id),
      label: course.name,
    }));

  const programSelectOptions =
    programOptions.map((program) => ({
      value: Number(program.id),
      label: program.name,
      course_id: Number(program.course_id),
    }));

  /* ================= MODE CHANGE ================= */

  const handleModeChange = async (mode) => {
    setForm((prev) => ({
      ...prev,
      mode,
      courses: [],
      programs: [],
    }));

    setCourseOptions([]);
    setProgramOptions([]);

    if (mode) {
      await fetchCoursesByMode(mode);
    }
  };

  /* ================= COURSE CHANGE ================= */

  const handleCourseChange = async (selected) => {
    const courseIds = selected
      ? selected.map((item) => Number(item.value))
      : [];

    setForm((prev) => ({
      ...prev,
      courses: courseIds,
      programs: [],
    }));

    setProgramOptions([]);

    if (
      form.mode &&
      courseIds.length
    ) {
      await fetchProgramsByModeAndCourses(
        form.mode,
        courseIds
      );
    }
  };

  /* ================= UI ================= */

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>
          {editing ? "Edit" : "Add"} Client / University
        </h2>

        <button
          type="button"
          className="btn"
          onClick={() => navigate("/clients")}
        >
          Back
        </button>
      </div>

      <div className="form-wrapper">
        {/* NAME */}
        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              name: e.target.value,
              slug: generateSlug(e.target.value),
            }))
          }
        />

        {/* SLUG */}
        <label>Slug</label>
        <input
          value={form.slug}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              slug: e.target.value,
            }))
          }
        />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          rows={6}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />

        {/* SEO */}
        <h3 className="section-title">SEO Settings</h3>

        <label>Meta Title</label>
        <input
          type="text"
          maxLength={60}
          placeholder="SEO title (recommended: 50–60 characters)"
          value={form.meta_title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              meta_title: e.target.value,
            }))
          }
        />

        <label>Meta Description</label>
        <textarea
          rows={4}
          maxLength={160}
          placeholder="SEO description (recommended: 140–160 characters)"
          value={form.meta_description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              meta_description: e.target.value,
            }))
          }
        />

        <label>SEO Keywords</label>
        <input
          type="text"
          placeholder="university, online mba, distance education"
          value={form.seo_keywords}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              seo_keywords: e.target.value,
            }))
          }
        />

        <label>Canonical URL</label>
        <input
          type="url"
          placeholder="https://geduconnect.com/university/example"
          value={form.canonical_url}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              canonical_url: e.target.value,
            }))
          }
        />

        <label>OG Title</label>
        <input
          type="text"
          placeholder="Social sharing title"
          value={form.og_title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              og_title: e.target.value,
            }))
          }
        />

        <label>OG Description</label>
        <textarea
          rows={3}
          placeholder="Social sharing description"
          value={form.og_description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              og_description: e.target.value,
            }))
          }
        />

        <label>OG Image URL</label>
        <input
          type="url"
          placeholder="https://geduconnect.com/uploads/..."
          value={form.og_image}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              og_image: e.target.value,
            }))
          }
        />

        <label>Robots</label>
        <select
          value={form.robots}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              robots: e.target.value,
            }))
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
          accept="image/*"
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              logo: e.target.files?.[0] || null,
            }))
          }
        />

        {/* TYPE */}
        <label>Type</label>
        <select
          value={form.type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              type: e.target.value,
              ...(e.target.value !== "university"
                ? {
                    mode: "",
                    courses: [],
                    programs: [],
                  }
                : {}),
            }))
          }
        >
          <option value="client">Client</option>
          <option value="partner">Partner</option>
          <option value="university">University</option>
        </select>

        {/* MODE */}
        <label>Mode *</label>
        <select
          value={form.mode || ""}
          onChange={(e) =>
            handleModeChange(e.target.value)
          }
          disabled={form.type !== "university"}
        >
          <option value="">Select Mode</option>

          {modeOptions
            .filter(
              (mode) =>
                Number(mode.is_active) === 1
            )
            .map((mode) => (
              <option
                key={mode.id}
                value={mode.slug}
              >
                {mode.name}
              </option>
            ))}
        </select>

        {/* UNIVERSITY INFORMATION */}
        {form.type === "university" && (
          <>
            <h3 className="section-title">
              University Information
            </h3>

            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
            />

            <input
              placeholder="Established"
              value={form.established}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  established: e.target.value,
                }))
              }
            />

            <input
              placeholder="NAAC Grade"
              value={form.naac_grade}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  naac_grade: e.target.value,
                }))
              }
            />

            {/* COURSES */}
            <h3 className="section-title">
              Courses
            </h3>

            <Select
              isMulti
              styles={customSelectStyles}
              options={courseSelectOptions}
              isLoading={loadingCourses}
              isDisabled={
                !form.mode ||
                loadingCourses
              }
              placeholder={
                !form.mode
                  ? "Select Mode First"
                  : loadingCourses
                  ? "Loading Courses..."
                  : "Select Courses..."
              }
              value={courseSelectOptions.filter(
                (option) =>
                  form.courses.includes(
                    Number(option.value)
                  )
              )}
              onChange={handleCourseChange}
            />

            {/* PROGRAMS */}
            <h3 className="section-title">
              Programs
            </h3>

            <Select
              isMulti
              styles={customSelectStyles}
              options={programSelectOptions}
              isLoading={loadingPrograms}
              isDisabled={
                !form.mode ||
                !form.courses.length ||
                loadingPrograms
              }
              placeholder={
                !form.mode
                  ? "Select Mode First"
                  : !form.courses.length
                  ? "Select Course First"
                  : loadingPrograms
                  ? "Loading Programs..."
                  : "Select Programs..."
              }
              value={programSelectOptions.filter(
                (option) =>
                  form.programs.includes(
                    Number(option.value)
                  )
              )}
              onChange={(selected) =>
                setForm((prev) => ({
                  ...prev,
                  programs: selected
                    ? selected.map((item) =>
                        Number(item.value)
                      )
                    : [],
                }))
              }
            />

            {/* APPROVALS */}
            <h3 className="section-title">
              Approvals
            </h3>

            <div className="checkbox-grid">
              {approvalOptions.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="checkbox"
                    checked={form.approvals.includes(
                      Number(opt.id)
                    )}
                    onChange={(e) => {
                      const optionId =
                        Number(opt.id);

                      if (e.target.checked) {
                        setForm((prev) => ({
                          ...prev,
                          approvals: [
                            ...prev.approvals,
                            optionId,
                          ],
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          approvals:
                            prev.approvals.filter(
                              (approvalId) =>
                                approvalId !==
                                optionId
                            ),
                        }));
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
                      Number(opt.id)
                    )}
                    onChange={(e) => {
                      const optionId =
                        Number(opt.id);

                      if (e.target.checked) {
                        setForm((prev) => ({
                          ...prev,
                          affiliations: [
                            ...prev.affiliations,
                            optionId,
                          ],
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          affiliations:
                            prev.affiliations.filter(
                              (affiliationId) =>
                                affiliationId !==
                                optionId
                            ),
                        }));
                      }
                    }}
                  />
                  {opt.name}
                </label>
              ))}
            </div>

            {/* RANKINGS */}
            <h3 className="section-title">
              Rankings
            </h3>

            <div className="checkbox-grid">
              {rankingOptions.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="checkbox"
                    checked={form.rankings.includes(
                      Number(opt.id)
                    )}
                    onChange={(e) => {
                      const optionId =
                        Number(opt.id);

                      if (e.target.checked) {
                        setForm((prev) => ({
                          ...prev,
                          rankings: [
                            ...prev.rankings,
                            optionId,
                          ],
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          rankings:
                            prev.rankings.filter(
                              (rankingId) =>
                                rankingId !==
                                optionId
                            ),
                        }));
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
                  type="button"
                  className="btn danger"
                  onClick={() =>
                    deleteTab(index)
                  }
                >
                  Delete
                </button>
              </div>
            ))}

            {/* UNIVERSITY CAROUSEL */}
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
                      Array.from(
                        e.target.files || []
                      )
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
                        getAssetUrl(
                          image.image_url
                        );

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
                                  border:
                                    "1px solid #d1d5db",
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
                                  border:
                                    "1px solid #d1d5db",
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
          </>
        )}

        {/* SORT ORDER */}
        <label>Sort Order</label>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              sort_order: e.target.value,
            }))
          }
        />

        {/* ACTIVE */}
        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={Number(form.is_active) === 1}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                is_active: e.target.checked
                  ? 1
                  : 0,
              }))
            }
          />
          Active
        </label>

        {/* SAVE */}
        <button
          type="button"
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
