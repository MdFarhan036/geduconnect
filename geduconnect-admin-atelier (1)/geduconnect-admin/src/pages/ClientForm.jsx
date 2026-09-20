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

  /* =====================================================
     HELPERS
  ===================================================== */

  const generateSlug = (text) =>
    text
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/(^-|-$)+/g, "");

  /* =====================================================
     LOAD MASTER DATA
  ===================================================== */

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/admin/approvals"),
          api.get("/admin/affiliations"),
          api.get("/admin/rankings"),
          api.get("/admin/modes"),
        ]);

        /* APPROVALS */

        if (results[0].status === "fulfilled") {
          setApprovalOptions(
            Array.isArray(results[0].value.data)
              ? results[0].value.data
              : []
          );
        }

        /* AFFILIATIONS */

        if (results[1].status === "fulfilled") {
          setAffiliationOptions(
            Array.isArray(results[1].value.data)
              ? results[1].value.data
              : []
          );
        }

        /* RANKINGS */

        if (results[2].status === "fulfilled") {
          setRankingOptions(
            Array.isArray(results[2].value.data)
              ? results[2].value.data
              : []
          );
        }

        /* MODES */

        if (results[3].status === "fulfilled") {
          const modes = Array.isArray(
            results[3].value.data
          )
            ? results[3].value.data
            : results[3].value.data?.modes || [];

          setModeOptions(modes);
        }

      } catch (err) {
        console.error(
          "Master load failed:",
          err
        );
      }
    };

    loadMasters();
  }, []);

  /* =====================================================
     FETCH COURSES BY MODE
  ===================================================== */

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
        (course) =>
          Number(course.is_active) === 1
      );

      setCourseOptions(activeCourses);

      return activeCourses;

    } catch (error) {
      console.error(
        "Failed to load courses:",
        error
      );

      setCourseOptions([]);

      return [];

    } finally {
      setLoadingCourses(false);
    }
  };

  /* =====================================================
     FETCH PROGRAMS BY MODE + COURSES
  ===================================================== */

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

      const requests = courseIds.map(
        (courseId) =>
          api.get(
            `/admin/programs?mode=${encodeURIComponent(
              mode
            )}&course_id=${courseId}`
          )
      );

      const responses = await Promise.all(
        requests
      );

      const allPrograms = responses.flatMap(
        (response) => {
          if (Array.isArray(response.data)) {
            return response.data;
          }

          return response.data?.programs || [];
        }
      );

      /* REMOVE DUPLICATES */

      const uniquePrograms = Array.from(
        new Map(
          allPrograms.map((program) => [
            program.id,
            program,
          ])
        ).values()
      );

      /* ONLY ACTIVE PROGRAMS */

      const activePrograms =
        uniquePrograms.filter(
          (program) =>
            Number(program.is_active) === 1
        );

      setProgramOptions(activePrograms);

      return activePrograms;

    } catch (error) {
      console.error(
        "Failed to load programs:",
        error
      );

      setProgramOptions([]);

      return [];

    } finally {
      setLoadingPrograms(false);
    }
  };

  /* =====================================================
     LOAD EDIT DATA
  ===================================================== */

  useEffect(() => {
    if (!editing) return;

    const load = async () => {
      try {
        const res = await api.get(
          `/admin/clients/${id}`
        );

        const row = res.data;

        let extra = {};

        try {
          extra =
            typeof row.extra_data === "string"
              ? JSON.parse(
                  row.extra_data || "{}"
                )
              : row.extra_data || {};
        } catch (err) {
          console.error(
            "Invalid extra_data JSON:",
            err
          );
        }

        const existingCourses = (
          extra.courses || []
        ).map(Number);

        const existingPrograms = (
          extra.programs || []
        ).map(Number);

        const existingMode =
          row.mode || "";

        setForm({
          ...emptyForm,

          ...row,

          mode: existingMode,

          location:
            extra.location || "",

          established:
            extra.established || "",

          naac_grade:
            extra.naac_grade || "",

          meta_title:
            extra.meta_title || "",

          meta_description:
            extra.meta_description || "",

          courses: existingCourses,

          programs: existingPrograms,

          approvals: (
            extra.approvals || []
          ).map(Number),

          affiliations: (
            extra.affiliations || []
          ).map(Number),

          rankings: (
            extra.rankings || []
          ).map(Number),

          placement:
            extra.placement ||
            emptyForm.placement,

          tabs:
            extra.tabs || [],
        });

        /* ============================================
           RESTORE MODE → COURSES → PROGRAMS
        ============================================ */

        if (existingMode) {
          const courses =
            await fetchCoursesByMode(
              existingMode
            );

          /*
           * Only use courses that still exist
           * and are active for this mode.
           */

          const validCourseIds =
            courses
              .filter((course) =>
                existingCourses.includes(
                  Number(course.id)
                )
              )
              .map((course) =>
                Number(course.id)
              );

          if (validCourseIds.length) {
            const programs =
              await fetchProgramsByModeAndCourses(
                existingMode,
                validCourseIds
              );

            /*
             * Keep only programs that were
             * previously assigned to university.
             */

            const validProgramIds =
              programs
                .filter((program) =>
                  existingPrograms.includes(
                    Number(program.id)
                  )
                )
                .map((program) =>
                  Number(program.id)
                );

            setForm((prev) => ({
              ...prev,

              courses: validCourseIds,

              programs: validProgramIds,
            }));
          }
        }

      } catch (err) {
        console.error(
          "Failed to load university:",
          err
        );

        alert(
          "Failed to load data"
        );
      }
    };

    load();
  }, [editing, id]);

  /* =====================================================
     SAVE
  ===================================================== */

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

      fd.append(
        "name",
        form.name.trim()
      );

      fd.append(
        "slug",
        form.slug ||
          generateSlug(form.name)
      );

      fd.append(
        "description",
        form.description || ""
      );

      fd.append(
        "type",
        form.type
      );

      fd.append(
        "mode",
        form.mode || ""
      );

      fd.append(
        "sort_order",
        form.sort_order
      );

      fd.append(
        "is_active",
        form.is_active
      );

      /* ============================================
         EXTRA DATA
      ============================================ */

      const extraData = {
        location:
          form.location,

        established:
          form.established,

        naac_grade:
          form.naac_grade,

        meta_title:
          form.meta_title,

        meta_description:
          form.meta_description,

        courses:
          form.courses,

        programs:
          form.programs,

        approvals:
          form.approvals,

        affiliations:
          form.affiliations,

        rankings:
          form.rankings,

        placement:
          form.placement,

        tabs:
          form.tabs,
      };

      fd.append(
        "extra_data",
        JSON.stringify(extraData)
      );

      /* ============================================
         LOGO
      ============================================ */

      if (form.logo) {
        fd.append(
          "logo",
          form.logo
        );
      }

      /* ============================================
         API
      ============================================ */

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

      alert(
        "Saved successfully!"
      );

      navigate("/clients");

    } catch (err) {
      console.error(
        "Save failed:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Save failed"
      );

    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     TABS
  ===================================================== */

  const addTab = () => {
    setForm((prev) => ({
      ...prev,

      tabs: [
        ...prev.tabs,

        {
          id:
            Date.now().toString(),

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
    const updated = [
      ...form.tabs,
    ];

    updated[index][field] =
      value;

    if (
      field === "title"
    ) {
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

  /* =====================================================
     SELECT STYLES
  ===================================================== */

  const customSelectStyles = {
    control: (
      base,
      state
    ) => ({
      ...base,

      minHeight: 45,

      borderRadius: 8,

      borderColor:
        state.isFocused
          ? "#2563eb"
          : "#d1d5db",

      boxShadow:
        state.isFocused
          ? "0 0 0 2px rgba(37,99,235,.2)"
          : "none",

      "&:hover": {
        borderColor:
          "#2563eb",
      },
    }),
  };

  /* =====================================================
     COURSE SELECT OPTIONS
  ===================================================== */

  const courseSelectOptions =
    courseOptions.map(
      (course) => ({
        value: Number(
          course.id
        ),

        label:
          course.name,
      })
    );

  /* =====================================================
     PROGRAM SELECT OPTIONS
  ===================================================== */

  const programSelectOptions =
    programOptions.map(
      (program) => ({
        value: Number(
          program.id
        ),

        label:
          program.name,

        course_id:
          Number(
            program.course_id
          ),
      })
    );

  /* =====================================================
     MODE CHANGE
  ===================================================== */

  const handleModeChange = async (
    mode
  ) => {
    setForm((prev) => ({
      ...prev,

      mode,

      courses: [],

      programs: [],
    }));

    setCourseOptions([]);

    setProgramOptions([]);

    if (mode) {
      await fetchCoursesByMode(
        mode
      );
    }
  };

  /* =====================================================
     COURSE CHANGE
  ===================================================== */

  const handleCourseChange = async (
    selected
  ) => {
    const courseIds = selected
      ? selected.map(
          (item) =>
            Number(item.value)
        )
      : [];

    setForm((prev) => ({
      ...prev,

      courses: courseIds,

      /*
       * Changing courses means
       * previously selected programs
       * are no longer guaranteed to
       * belong to selected courses.
       */

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

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="highlight-admin">

      {/* HEADER */}

      <div className="page-header">

        <h2>
          {editing
            ? "Edit"
            : "Add"}{" "}
          Client / University
        </h2>

        <button
          type="button"
          className="btn"
          onClick={() =>
            navigate(
              "/clients"
            )
          }
        >
          Back
        </button>

      </div>

      {/* FORM */}

      <div className="form-wrapper">

        {/* NAME */}

        <label>
          Name
        </label>

        <input
          value={
            form.name
          }
          onChange={(e) =>
            setForm(
              (prev) => ({
                ...prev,

                name:
                  e.target.value,

                slug:
                  generateSlug(
                    e.target.value
                  ),
              })
            )
          }
        />

        {/* SLUG */}

        <label>
          Slug
        </label>

        <input
          value={
            form.slug
          }
          onChange={(e) =>
            setForm(
              (prev) => ({
                ...prev,

                slug:
                  e.target.value,
              })
            )
          }
        />

        {/* DESCRIPTION */}

        <label>
          Description
        </label>

        <textarea
          rows={6}
          value={
            form.description
          }
          onChange={(e) =>
            setForm(
              (prev) => ({
                ...prev,

                description:
                  e.target.value,
              })
            )
          }
        />

        {/* LOGO */}

        <label>
          Logo
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm(
              (prev) => ({
                ...prev,

                logo:
                  e.target.files?.[0] ||
                  null,
              })
            )
          }
        />

        {/* TYPE */}

        <label>
          Type
        </label>

        <select
          value={
            form.type
          }
          onChange={(e) =>
            setForm(
              (prev) => ({
                ...prev,

                type:
                  e.target.value,

                /*
                 * Reset university-specific
                 * selection when changing
                 * away from university.
                 */

                ...(e.target.value !==
                "university"
                  ? {
                      mode: "",
                      courses: [],
                      programs: [],
                    }
                  : {}),
              })
            )
          }
        >

          <option value="client">
            Client
          </option>

          <option value="partner">
            Partner
          </option>

          <option value="university">
            University
          </option>

        </select>

        {/* =================================================
            MODE
        ================================================= */}

        <label>
          Mode *
        </label>

        <select
          value={
            form.mode || ""
          }
          onChange={(e) =>
            handleModeChange(
              e.target.value
            )
          }
          disabled={
            form.type !==
            "university"
          }
        >

          <option value="">
            Select Mode
          </option>

          {modeOptions
            .filter(
              (mode) =>
                Number(
                  mode.is_active
                ) === 1
            )
            .map(
              (mode) => (
                <option
                  key={
                    mode.id
                  }
                  value={
                    mode.slug
                  }
                >
                  {mode.name}
                </option>
              )
            )}

        </select>

        {/* =================================================
            UNIVERSITY SECTION
        ================================================= */}

        {form.type ===
          "university" && (
          <>

            <h3 className="section-title">
              University Information
            </h3>

            {/* LOCATION */}

            <input
              placeholder="Location"
              value={
                form.location
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    location:
                      e.target.value,
                  })
                )
              }
            />

            {/* ESTABLISHED */}

            <input
              placeholder="Established"
              value={
                form.established
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    established:
                      e.target.value,
                  })
                )
              }
            />

            {/* NAAC */}

            <input
              placeholder="NAAC Grade"
              value={
                form.naac_grade
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    naac_grade:
                      e.target.value,
                  })
                )
              }
            />

            {/* =================================================
                COURSES
            ================================================= */}

            <h3 className="section-title">
              Courses
            </h3>

            <Select
              isMulti
              styles={
                customSelectStyles
              }

              options={
                courseSelectOptions
              }

              isLoading={
                loadingCourses
              }

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

              value={
                courseSelectOptions.filter(
                  (option) =>
                    form.courses.includes(
                      Number(
                        option.value
                      )
                    )
                )
              }

              onChange={
                handleCourseChange
              }
            />

            {/* =================================================
                PROGRAMS
            ================================================= */}

            <h3 className="section-title">
              Programs
            </h3>

            <Select
              isMulti
              styles={
                customSelectStyles
              }

              options={
                programSelectOptions
              }

              isLoading={
                loadingPrograms
              }

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

              value={
                programSelectOptions.filter(
                  (option) =>
                    form.programs.includes(
                      Number(
                        option.value
                      )
                    )
                )
              }

              onChange={(
                selected
              ) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    programs:
                      selected
                        ? selected.map(
                            (
                              item
                            ) =>
                              Number(
                                item.value
                              )
                          )
                        : [],
                  })
                )
              }
            />

            {/* =================================================
                APPROVALS
            ================================================= */}

            <h3 className="section-title">
              Approvals
            </h3>

            <div className="checkbox-grid">

              {approvalOptions.map(
                (opt) => (
                  <label
                    key={
                      opt.id
                    }
                  >

                    <input
                      type="checkbox"

                      checked={
                        form.approvals.includes(
                          Number(
                            opt.id
                          )
                        )
                      }

                      onChange={(
                        e
                      ) => {

                        const optionId =
                          Number(
                            opt.id
                          );

                        if (
                          e.target
                            .checked
                        ) {

                          setForm(
                            (
                              prev
                            ) => ({
                              ...prev,

                              approvals:
                                [
                                  ...prev.approvals,
                                  optionId,
                                ],
                            })
                          );

                        } else {

                          setForm(
                            (
                              prev
                            ) => ({
                              ...prev,

                              approvals:
                                prev.approvals.filter(
                                  (
                                    approvalId
                                  ) =>
                                    approvalId !==
                                    optionId
                                ),
                            })
                          );

                        }
                      }}
                    />

                    {opt.name}

                  </label>
                )
              )}

            </div>

            {/* =================================================
                AFFILIATIONS
            ================================================= */}

            <h3 className="section-title">
              Affiliations
            </h3>

            <div className="checkbox-grid">

              {affiliationOptions.map(
                (opt) => (
                  <label
                    key={
                      opt.id
                    }
                  >

                    <input
                      type="checkbox"

                      checked={
                        form.affiliations.includes(
                          Number(
                            opt.id
                          )
                        )
                      }

                      onChange={(
                        e
                      ) => {

                        const optionId =
                          Number(
                            opt.id
                          );

                        if (
                          e.target
                            .checked
                        ) {

                          setForm(
                            (
                              prev
                            ) => ({
                              ...prev,

                              affiliations:
                                [
                                  ...prev.affiliations,
                                  optionId,
                                ],
                            })
                          );

                        } else {

                          setForm(
                            (
                              prev
                            ) => ({
                              ...prev,

                              affiliations:
                                prev.affiliations.filter(
                                  (
                                    affiliationId
                                  ) =>
                                    affiliationId !==
                                    optionId
                                ),
                            })
                          );

                        }
                      }}
                    />

                    {opt.name}

                  </label>
                )
              )}

            </div>

            {/* =================================================
                RANKINGS
            ================================================= */}

            <h3 className="section-title">
              Rankings
            </h3>

            <div className="checkbox-grid">

              {rankingOptions.map(
                (opt) => (
                  <label
                    key={
                      opt.id
                    }
                  >

                    <input
                      type="checkbox"

                      checked={
                        form.rankings.includes(
                          Number(
                            opt.id
                          )
                        )
                      }

                      onChange={(
                        e
                      ) => {

                        const optionId =
                          Number(
                            opt.id
                          );

                        if (
                          e.target
                            .checked
                        ) {

                          setForm(
                            (
                              prev
                            ) => ({
                              ...prev,

                              rankings:
                                [
                                  ...prev.rankings,
                                  optionId,
                                ],
                            })
                          );

                        } else {

                          setForm(
                            (
                              prev
                            ) => ({
                              ...prev,

                              rankings:
                                prev.rankings.filter(
                                  (
                                    rankingId
                                  ) =>
                                    rankingId !==
                                    optionId
                                ),
                            })
                          );

                        }
                      }}
                    />

                    {opt.name}

                  </label>
                )
              )}

            </div>

            {/* =================================================
                TABS
            ================================================= */}

            <div className="tabs-header">

              <h3 className="section-title">
                University Content Tabs
              </h3>

              <button
                type="button"
                className="btn primary"
                onClick={
                  addTab
                }
              >
                + Add Tab
              </button>

            </div>

            {form.tabs.map(
              (
                tab,
                index
              ) => (
                <div
                  key={
                    tab.id
                  }
                  className="tab-card"
                >

                  <input
                    placeholder="Tab Title"
                    value={
                      tab.title
                    }
                    onChange={(
                      e
                    ) =>
                      updateTab(
                        index,
                        "title",
                        e.target
                          .value
                      )
                    }
                  />

                  <input
                    placeholder="Tab Slug"
                    value={
                      tab.slug
                    }
                    onChange={(
                      e
                    ) =>
                      updateTab(
                        index,
                        "slug",
                        e.target
                          .value
                      )
                    }
                  />

                  <textarea
                    rows={5}
                    placeholder="Tab Content"
                    value={
                      tab.content
                    }
                    onChange={(
                      e
                    ) =>
                      updateTab(
                        index,
                        "content",
                        e.target
                          .value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="btn danger"
                    onClick={() =>
                      deleteTab(
                        index
                      )
                    }
                  >
                    Delete
                  </button>

                </div>
              )
            )}

          </>
        )}

        {/* =================================================
            SORT ORDER
        ================================================= */}

        <label>
          Sort Order
        </label>

        <input
          type="number"
          value={
            form.sort_order
          }
          onChange={(e) =>
            setForm(
              (prev) => ({
                ...prev,

                sort_order:
                  e.target.value,
              })
            )
          }
        />

        {/* =================================================
            ACTIVE
        ================================================= */}

        <label className="checkbox-inline">

          <input
            type="checkbox"
            checked={
              Number(
                form.is_active
              ) === 1
            }
            onChange={(e) =>
              setForm(
                (prev) => ({
                  ...prev,

                  is_active:
                    e.target.checked
                      ? 1
                      : 0,
                })
              )
            }
          />

          Active

        </label>

        {/* =================================================
            SAVE
        ================================================= */}

        <button
          type="button"
          className="btn primary"
          onClick={save}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save"}
        </button>

      </div>
    </div>
  );
}