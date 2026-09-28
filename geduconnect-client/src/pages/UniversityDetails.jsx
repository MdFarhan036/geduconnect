import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Helmet } from 'react-helmet-async'
import CounsellingModal from "../components/CounsellingModal";
import GlobalCounsellingModal from "../components/GlobalCounsellingModal";

import "./UniversityDetails.css";

/* =========================================================
   IMAGE URL - USE CENTRALIZED api.js CONFIGURATION
========================================================= */

const getImageUrl = (path) => {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const apiBaseUrl = api.defaults?.baseURL || "";

  const assetBaseUrl = apiBaseUrl.replace(
    /\/api\/?$/,
    ""
  );

  return `${assetBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* =========================================================
   CLEAN HTML
========================================================= */

const cleanHtml = (html = "") => {
  if (!html) return "";

  return html
    .replace(
      /<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi,
      ""
    )
    .replace(
      /<div>(\s|&nbsp;|<br\s*\/?>)*<\/div>/gi,
      ""
    )
    .replace(
      /(<br\s*\/?>\s*){3,}/gi,
      "<br />"
    )
    .trim();
};

/* =========================================================
   SAFE VALUE
========================================================= */

const safeValue = (value, fallback = "") => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return value;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function UniversityDetails() {
  const { slug, tabSlug } = useParams();
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const [showAllBadges, setShowAllBadges] =
    useState(false);

  const [approvalMasters, setApprovalMasters] =
    useState([]);

  const [affiliationMasters, setAffiliationMasters] =
    useState([]);

  const [rankingMasters, setRankingMasters] =
    useState([]);

  const [isCompared, setIsCompared] =
    useState(false);

  const [compareCount, setCompareCount] =
    useState(0);

  const [showCounselling, setShowCounselling] =
    useState(false);

  const [showGlobalCounselling, setShowGlobalCounselling] =
    useState(false);

  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /* =======================================================
     UNIVERSITY CAROUSEL
  ======================================================= */

  const [universityImages, setUniversityImages] =
    useState([]);

  const [activeCarouselIndex, setActiveCarouselIndex] =
    useState(0);

  /* =======================================================
     SAFE LOCAL STORAGE
  ======================================================= */

  const getStoredCompareList = () => {
    try {
      const stored =
        localStorage.getItem("compareList");

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Invalid compareList:",
        error
      );

      return [];
    }
  };

  /* =======================================================
     LOAD UNIVERSITY
  ======================================================= */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          clientRes,
          approvalsRes,
          affiliationsRes,
          rankingsRes,
        ] = await Promise.all([
          api.get(
            `/public/clients/${slug}`
          ),

          api.get(
            `/public/approvals`
          ),

          api.get(
            `/public/affiliations`
          ),

          api.get(
            `/public/rankings`
          ),
        ]);

        const row =
          clientRes.data;

        if (!row) {
          setError(
            "University not found."
          );

          return;
        }

        /* =================================================
           UNIVERSITY CAROUSEL IMAGES
        ================================================= */

        try {
          const imagesRes = await api.get(
            `/university-images/public/${row.id}`
          );

          const images = Array.isArray(
            imagesRes.data?.data
          )
            ? imagesRes.data.data.filter(
              (image) =>
                Number(image.is_active) === 1
            )
            : [];

          setUniversityImages(images);
          setActiveCarouselIndex(0);
        } catch (imageError) {
          console.error(
            "Failed to load university carousel images:",
            imageError
          );

          setUniversityImages([]);
          setActiveCarouselIndex(0);
        }

        /* =================================================
           EXTRA DATA
        ================================================= */

        let extra = {};

        try {
          extra =
            typeof row.extra_data ===
              "string"
              ? JSON.parse(
                row.extra_data
              )
              : row.extra_data || {};
        } catch (err) {
          console.error(
            "Invalid extra_data JSON:",
            err
          );

          extra = {};
        }

        row.extra_data = extra;

        /* =================================================
           SET DATA
        ================================================= */

        setData(row);

        setApprovalMasters(
          Array.isArray(
            approvalsRes.data
          )
            ? approvalsRes.data
            : []
        );

        setAffiliationMasters(
          Array.isArray(
            affiliationsRes.data
          )
            ? affiliationsRes.data
            : []
        );

        setRankingMasters(
          Array.isArray(
            rankingsRes.data
          )
            ? rankingsRes.data
            : []
        );

        /* =================================================
           TABS
        ================================================= */

        if (
          Array.isArray(extra.tabs) &&
          extra.tabs.length > 0
        ) {
          const found =
            extra.tabs.find(
              (tab) =>
                tab.slug === tabSlug
            );

          const defaultTab =
            found ||
            extra.tabs[0];

          setActiveTab(
            defaultTab
          );
        } else {
          setActiveTab(null);
        }

        /* =================================================
           DEFAULT COURSE
        ================================================= */

        if (
          Array.isArray(extra.programs) &&
          extra.programs.length > 0
        ) {
          setSelectedCourse(
            extra.programs[0]?.name ||
            extra.programs[0]?.title ||
            ""
          );
        }
      } catch (err) {
        console.error(
          "Failed to load university details:",
          err
        );

        setError(
          "Unable to load university details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      load();
    }
  }, [slug, tabSlug]);

  /* =======================================================
     UNIVERSITY CAROUSEL AUTO ROTATION
  ======================================================= */

  useEffect(() => {
    if (universityImages.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveCarouselIndex(
        (current) =>
          (current + 1) %
          universityImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [universityImages.length]);

  const showPreviousCarouselImage = () => {
    if (!universityImages.length) return;

    setActiveCarouselIndex(
      (current) =>
        (current - 1 + universityImages.length) %
        universityImages.length
    );
  };

  const showNextCarouselImage = () => {
    if (!universityImages.length) return;

    setActiveCarouselIndex(
      (current) =>
        (current + 1) %
        universityImages.length
    );
  };

  /* =======================================================
     COMPARE STATUS
  ======================================================= */

  useEffect(() => {
    if (!data) return;

    const stored =
      getStoredCompareList();

    setCompareCount(
      stored.length
    );

    setIsCompared(
      stored.some(
        (u) =>
          u.slug === data.slug
      )
    );
  }, [data]);

  /* =======================================================
     MASTER MAPPERS
  ======================================================= */

  const getApprovalName = (id) => {
    const item =
      approvalMasters.find(
        (a) =>
          String(a.id) ===
          String(id)
      );

    return item?.name || null;
  };

  const getAffiliationName = (id) => {
    const item =
      affiliationMasters.find(
        (a) =>
          String(a.id) ===
          String(id)
      );

    return item?.name || null;
  };

  const getRankingName = (id) => {
    const item =
      rankingMasters.find(
        (r) =>
          String(r.id) ===
          String(id)
      );

    return item?.name || null;
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="university-loading">
        <div className="loading-spinner"></div>
        <p>
          Loading university...
        </p>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="university-error">
        <div>
          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>

          <button
            onClick={() =>
              navigate("/clients")
            }
          >
            Back to Universities
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO DATA
  ======================================================= */

  if (!data) {
    return (
      <div className="university-error">
        University not found.
      </div>
    );
  }

  /* =======================================================
     EXTRA
  ======================================================= */

  const extra =
    data.extra_data || {};

  /* =======================================================
     BADGES
  ======================================================= */

  const approvalNames =
    Array.isArray(extra.approvals)
      ? extra.approvals
        .map(getApprovalName)
        .filter(Boolean)
      : [];

  const affiliationNames =
    Array.isArray(
      extra.affiliations
    )
      ? extra.affiliations
        .map(
          getAffiliationName
        )
        .filter(Boolean)
      : [];

  const rankingNames =
    Array.isArray(extra.rankings)
      ? extra.rankings
        .map(getRankingName)
        .filter(Boolean)
      : [];

  const allBadges = [
    ...approvalNames.map(
      (name) => ({
        name,
        type: "approval",
      })
    ),

    ...affiliationNames.map(
      (name) => ({
        name,
        type: "affiliation",
      })
    ),

    ...rankingNames.map(
      (name) => ({
        name,
        type: "ranking",
      })
    ),
  ];

  const visibleBadges =
    showAllBadges
      ? allBadges
      : allBadges.slice(0, 5);

  const remaining =
    Math.max(
      allBadges.length - 5,
      0
    );

  /* =======================================================
     PROGRAMS
  ======================================================= */

  const programs =
    Array.isArray(
      extra.programs
    )
      ? extra.programs
      : [];

  /* =======================================================
     HERO IMAGE / CAROUSEL
  ======================================================= */

  const fallbackHeroImage = getImageUrl(
    extra.banner_url ||
    extra.cover_image ||
    extra.cover_image_url ||
    data.banner_url ||
    data.cover_image ||
    data.cover_image_url
  );

  const activeCarouselImage =
    universityImages.length > 0
      ? universityImages[
      Math.min(
        activeCarouselIndex,
        universityImages.length - 1
      )
      ]
      : null;

  const heroImage = activeCarouselImage
    ? getImageUrl(activeCarouselImage.image_url)
    : fallbackHeroImage;

  /* =======================================================
     UNIVERSITY META
  ======================================================= */

  const location =
    extra.location ||
    extra.city ||
    "";

  const established =
    extra.established ||
    extra.established_year ||
    "";

  const universityType =
    extra.university_type ||
    extra.type ||
    "Private";

  const mode =
    data.mode ||
    extra.mode ||
    "Online";

  const rating =
    extra.rating ||
    data.rating ||
    "";

  const reviewCount =
    extra.review_count ||
    extra.reviews ||
    "";
  /* =======================================================
 SEO META
======================================================= */

  const seoTitle =
    data.meta_title ||
    data.metaTitle ||
    extra.meta_title ||
    extra.metaTitle ||
    `${data.name} Online Admission 2026 | Courses, Fees & Eligibility`;

  const seoDescription =
    data.meta_description ||
    data.metaDescription ||
    extra.meta_description ||
    extra.metaDescription ||
    `Explore ${data.name} online admission, courses, fees, eligibility, programs and admission details with G Educonnect.`;

  const seoKeywords =
    data.meta_keywords ||
    data.metaKeywords ||
    extra.meta_keywords ||
    extra.metaKeywords ||
    `${data.name}, ${data.name} online, ${data.name} admission, online admission, distance education`;

  /* =======================================================
     OVERVIEW TAB
  ======================================================= */

  const overviewTab =
    extra.tabs?.find(
      (tab) =>
        tab.slug ===
        "overview" ||
        tab.title
          ?.toLowerCase()
          .includes("overview")
    ) ||
    extra.tabs?.[0];

  /* =======================================================
     APPLY
  ======================================================= */

  const handleApply = () => {
    if (!selectedCourse) {
      setShowCounselling(true);
      return;
    }

    setShowCounselling(true);
  };

  /* =======================================================
     COMPARE
  ======================================================= */

  const handleCompare = () => {
    const stored =
      getStoredCompareList();

    let updated;

    if (isCompared) {
      updated =
        stored.filter(
          (u) =>
            u.slug !==
            data.slug
        );
    } else {
      if (stored.length >= 3) {
        alert(
          "You can compare maximum 3 universities."
        );

        return;
      }

      updated = [
        ...stored,
        {
          id: data.id,
          slug: data.slug,
          name: data.name,
          logo_url:
            data.logo_url,
        },
      ];
    }

    localStorage.setItem(
      "compareList",
      JSON.stringify(updated)
    );

    setCompareCount(
      updated.length
    );

    setIsCompared(
      updated.some(
        (u) =>
          u.slug ===
          data.slug
      )
    );
  };

  /* =======================================================
     WHATSAPP
  ======================================================= */

  const handleWhatsApp = () => {
    const phone =
      extra.whatsapp ||
      extra.whatsapp_number ||
      "919999999999";

    const message =
      `Hello G Educonnect, I am interested in ${selectedCourse || "online programs"} at ${data.name}.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  /* =======================================================
     TAB NAVIGATION
  ======================================================= */

  const handleTabNavigation = (
    tab
  ) => {
    if (!tab?.slug) return;

    navigate(
      `/university/${slug}/${tab.slug}`
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <Helmet>
        <title>
          {data.meta_title ||
            data.metaTitle ||
            extra.meta_title ||
            extra.metaTitle ||
            `${data.name} Online Admission 2026 | Courses, Fees & Eligibility`}
        </title>

        <meta
          name="description"
          content={
            data.meta_description ||
            data.metaDescription ||
            extra.meta_description ||
            extra.metaDescription ||
            `Explore ${data.name} online admission, courses, fees, eligibility, programs and admission details with G Educonnect.`
          }
        />

        <meta
          name="keywords"
          content={
            data.meta_keywords ||
            data.metaKeywords ||
            extra.meta_keywords ||
            extra.metaKeywords ||
            `${data.name}, ${data.name} online, ${data.name} admission, online admission, distance education`
          }
        />

        <link
          rel="canonical"
          href={`https://geduconnect.com/university/${data.slug}`}
        />
      </Helmet>

      <div className="university-page">

        {/* =====================================================
    UNIVERSITY COVER IMAGE
===================================================== */}

        <section
          className="university-cover"
          style={
            heroImage
              ? {
                backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.05),
              rgba(0, 0, 0, 0.72)
            ),
            url("${heroImage}")
          `,
              }
              : undefined
          }
        >
          <div className="university-cover-overlay" />

          {/* =====================================================
      CAROUSEL CONTROLS
  ===================================================== */}

          {universityImages.length > 1 && (
            <>
              <button
                type="button"
                className="university-carousel-arrow university-carousel-prev"
                onClick={showPreviousCarouselImage}
                aria-label="Previous university image"
              >
                ‹
              </button>

              <button
                type="button"
                className="university-carousel-arrow university-carousel-next"
                onClick={showNextCarouselImage}
                aria-label="Next university image"
              >
                ›
              </button>

              <div className="university-carousel-dots">
                {universityImages.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    className={
                      index === activeCarouselIndex
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setActiveCarouselIndex(index)
                    }
                    aria-label={`Go to university image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* =====================================================
      VIEW PHOTOS
  ===================================================== */}

          <div className="university-cover-content">
            <button
              type="button"
              className="photo-button"
              onClick={() => {
                if (universityImages.length > 1) {
                  showNextCarouselImage();
                }
              }}
            >
              ▣ View Photos
              {universityImages.length > 0
                ? ` (${universityImages.length})`
                : ""}
            </button>
          </div>
        </section>


        {/* =====================================================
    UNIVERSITY PROFILE HEADER
===================================================== */}

        <section className="university-profile-header">

          <div className="university-container">

            {/* =====================================================
        BREADCRUMB
    ===================================================== */}

            <div className="university-breadcrumb">

              <span
                onClick={() => navigate("/")}
              >
                Home
              </span>

              <span>/</span>

              <span
                onClick={() => navigate("/clients")}
              >
                Universities
              </span>

              <span>/</span>

              <strong>
                {data.name}
              </strong>

            </div>


            {/* =====================================================
        PROFILE
    ===================================================== */}

            <div className="university-profile-grid">

              {/* =================================================
          LOGO
      ================================================= */}

              <div className="university-profile-logo">

                {data.logo_url ? (
                  <img
                    src={getImageUrl(data.logo_url)}
                    alt={data.name}
                  />
                ) : (
                  <div className="logo-placeholder">
                    {data.name
                      ?.substring(0, 2)
                      .toUpperCase()}
                  </div>
                )}

              </div>


              {/* =================================================
          UNIVERSITY INFORMATION
      ================================================= */}

              <div className="university-profile-info">

                <div className="admission-open">
                  <span></span>
                  Admissions Open
                </div>

                <h1>
                  {data.name}

                  <span>
                    — Programs, Fees,
                    Admissions & Placements
                  </span>
                </h1>

                <div className="university-meta">

                  {location && (
                    <span>
                      📍 {location}
                    </span>
                  )}

                  {established && (
                    <span>
                      ▣ Est. {established}
                    </span>
                  )}

                  <span>
                    🎓 {mode}
                  </span>

                  <span className="type-badge">
                    {universityType}
                  </span>

                  {rating && (
                    <span className="rating-badge">
                      ★ {rating}

                      {reviewCount
                        ? ` (${reviewCount} Reviews)`
                        : ""}
                    </span>
                  )}

                </div>

              </div>


              {/* =================================================
          ACTIONS
      ================================================= */}

              <div className="university-profile-actions">

                <button
                  type="button"
                  className="primary-apply-btn"
                  onClick={handleApply}
                >
                  Apply to University
                  <span>→</span>
                </button>

                <button
                  type="button"
                  className="secondary-advisor-btn"
                  onClick={() =>
                    setShowCounselling(true)
                  }
                >
                  ☎ Talk to Advisor
                </button>

                <div className="header-small-actions">

                  <button
                    type="button"
                    onClick={handleCompare}
                  >
                    {isCompared
                      ? "✓ Compared"
                      : "⚖ Compare"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: data.name,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    ↗ Share
                  </button>

                </div>

              </div>

            </div>


            {/* =====================================================
        APPROVALS
    ===================================================== */}

            {allBadges.length > 0 && (
              <div className="university-approvals">

                <span className="approvals-label">
                  APPROVALS:
                </span>

                {visibleBadges.map(
                  (badge, index) => (
                    <span
                      key={`${badge.type}-${index}`}
                      className={`approval-badge ${badge.type}`}
                    >
                      {badge.type === "approval" &&
                        "✓ "}

                      {badge.name}
                    </span>
                  )
                )}

                {!showAllBadges && remaining > 0 && (
                  <button
                    type="button"
                    className="more-badge"
                    onClick={() =>
                      setShowAllBadges(true)
                    }
                  >
                    +{remaining} more
                  </button>
                )}

              </div>
            )}

          </div>

        </section>

        {/* =====================================================
          TABS
      ===================================================== */}

        {Array.isArray(extra.tabs) &&
          extra.tabs.length > 0 && (
            <nav className="university-tabs">

              <div className="university-container university-tabs-inner">

                {extra.tabs.map((tab, index) => (
                  <button
                    key={
                      tab.id ||
                      tab.slug ||
                      tab.title
                    }
                    type="button"
                    className={
                      activeTab?.slug === tab.slug
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleTabNavigation(tab)
                    }
                  >
                    <span>
                      {tab.title}
                    </span>

                    {tab.count && (
                      <small>
                        {tab.count}
                      </small>
                    )}
                  </button>
                ))}

              </div>

            </nav>
          )}

        {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

        <main className="university-container">

          <div className="university-main-layout">

            {/* =================================================
              LEFT
          ================================================= */}

            <div className="university-main-content">

              {/* PROGRAM OVERVIEW LABEL */}




              {/* ACTIVE TAB CONTENT */}

              <section className="university-content-card">

                <div className="content-heading">

                  <h2>
                    {activeTab?.title ||
                      "About " +
                      data.name}
                  </h2>

                </div>

                {activeTab?.content ? (
                  <div
                    className="dynamic-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        cleanHtml(
                          activeTab.content
                        ),
                    }}
                  />
                ) : overviewTab?.content ? (
                  <div
                    className="dynamic-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        cleanHtml(
                          overviewTab.content
                        ),
                    }}
                  />
                ) : data.description ? (
                  <p className="overview-description">
                    {data.description}
                  </p>
                ) : (
                  <p className="empty-content">
                    No information available
                    for this section.
                  </p>
                )}

              </section>


            </div>


            {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

            <aside className="university-sidebar">

              {/* QUICK APPLY */}

              <div className="quick-apply-card">

                <div className="quick-tabs">

                  <button className="active">
                    ⚡ Quick Apply
                  </button>

                  <button>
                    ▣ Fee Plans
                  </button>

                  <button>
                    ♜ Eligibility
                  </button>

                </div>


                <div className="fee-waiver">

                  <span>
                    🎁 Early Admission
                    Fee Waiver
                  </span>

                  <strong>
                    ACTIVE
                  </strong>

                </div>


                <label>
                  SELECT INTERESTED
                  COURSE:
                </label>


                <select
                  value={
                    selectedCourse
                  }
                  onChange={(e) =>
                    setSelectedCourse(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Course
                  </option>

                  {programs.map(
                    (
                      program,
                      index
                    ) => (
                      <option
                        key={
                          program.id ||
                          index
                        }
                        value={
                          program.name ||
                          program.title ||
                          program.program_name ||
                          ""
                        }
                      >
                        {program.name ||
                          program.title ||
                          program.program_name}
                      </option>
                    )
                  )}

                </select>


                <button
                  type="button"
                  className="quick-apply-main"
                  onClick={
                    handleApply
                  }
                >
                  Apply for{" "}
                  {selectedCourse ||
                    "Program"}
                  <span>
                    →
                  </span>
                </button>


                <button
                  type="button"
                  className="download-syllabus"
                  onClick={() =>
                    setShowCounselling(
                      true
                    )
                  }
                >
                  ↓ Download Syllabus
                </button>


                <div className="quick-actions">

                  <button
                    type="button"
                    className="whatsapp-btn"
                    onClick={
                      handleWhatsApp
                    }
                  >
                    ● WhatsApp
                  </button>

                  <button
                    type="button"
                    className="advisor-btn"
                    onClick={() =>
                      setShowCounselling(
                        true
                      )
                    }
                  >
                    ☎ Talk to Advisor
                  </button>

                </div>


                <div className="verified-text">

                  <span>
                    ✓
                  </span>

                  Verified Partner ·
                  Free Guidance ·
                  Direct Admission

                </div>

              </div>


              {/* WHY GEDUCONNECT */}

              <div className="why-gedu-card">

                <h3>
                  Why Apply Through
                  G Educonnect?
                </h3>

                <ul>

                  <li>
                    <span>✓</span>
                    100% Free Counselling
                  </li>

                  <li>
                    <span>✓</span>
                    Personalised Guidance
                  </li>

                  <li>
                    <span>✓</span>
                    Admission Assistance
                  </li>

                  <li>
                    <span>✓</span>
                    Documentation Support
                  </li>

                  <li>
                    <span>✓</span>
                    Fee & Eligibility
                    Guidance
                  </li>

                </ul>

              </div>


              {/* APPROVAL SUMMARY */}

              {allBadges.length >
                0 && (
                  <div className="sidebar-approval-card">

                    <h3>
                      Approvals &
                      Recognition
                    </h3>

                    <div>

                      {allBadges.map(
                        (
                          badge,
                          index
                        ) => (
                          <span
                            key={
                              `${badge.type}-${index}`
                            }
                          >
                            ✓{" "}
                            {
                              badge.name
                            }
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

            </aside>

          </div>

        </main>


        {/* =====================================================
          COUNSELLING CTA
      ===================================================== */}

        <section className="university-counselling-section">

          <div className="university-container">

            <div className="counselling-content">

              <span>
                NEED HELP CHOOSING?
              </span>

              <h2>
                Get Free Counselling
              </h2>

              <p>
                Confused about
                universities, courses,
                eligibility or
                admissions? Talk to
                our education experts
                and get personalised
                guidance.
              </p>

              <div className="counselling-points">

                <span>
                  ✓ Course Guidance
                </span>

                <span>
                  ✓ Admission Assistance
                </span>

                <span>
                  ✓ Fee Guidance
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowGlobalCounselling(
                    true
                  )
                }
              >
                Get Free Counselling
                →
              </button>

            </div>


            <div className="counselling-visual">

              <div className="counselling-icon">
                🎓
              </div>

              <div className="counselling-floating-card">
                <strong>
                  Talk to an Expert
                </strong>

                <span>
                  Get personalised
                  guidance
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
          FLOATING COMPARE BAR
      ===================================================== */}

        {compareCount >= 2 && (
          <div className="compare-floating-bar">

            <div>
              <strong>
                {compareCount}
              </strong>

              Universities
              Selected
            </div>

            <button
              type="button"
              onClick={() => {

                const stored =
                  getStoredCompareList();

                const query =
                  stored
                    .map(
                      (u) =>
                        `v=${encodeURIComponent(
                          u.slug
                        )}`
                    )
                    .join("&");

                navigate(
                  `/compare?${query}`
                );

              }}
            >
              Compare Now →
            </button>

          </div>
        )}


        {/* =====================================================
          MOBILE CTA
      ===================================================== */}

        <div className="mobile-university-cta">

          <button
            type="button"
            onClick={
              handleApply
            }
          >
            Apply Now
          </button>

          <button
            type="button"
            onClick={
              handleWhatsApp
            }
          >
            WhatsApp
          </button>

        </div>


        {/* =====================================================
          MODALS
      ===================================================== */}

        <CounsellingModal
          show={
            showCounselling
          }
          onClose={() =>
            setShowCounselling(
              false
            )
          }
          university={data}
        />


        <GlobalCounsellingModal
          show={
            showGlobalCounselling
          }
          onClose={() =>
            setShowGlobalCounselling(
              false
            )
          }
        />

      </div>
    </>
  );
}