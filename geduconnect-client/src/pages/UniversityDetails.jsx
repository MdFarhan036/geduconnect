import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

/* ================= BASE URL ================= */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const BASE_URL = API_BASE.replace(/\/api\/?$/, "");

/* ================= IMAGE URL ================= */
const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* ================= CLEAN HTML ================= */
const cleanHtml = (html = "") => {
  if (!html) return "";

  return html
    // Remove completely empty paragraphs
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    // Remove empty divs
    .replace(/<div>(\s|&nbsp;|<br\s*\/?>)*<\/div>/gi, "")
    // Remove excessive consecutive breaks
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br />")
    .trim();
};

export default function UniversityDetails() {
  const { slug, tabSlug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [showAllBadges, setShowAllBadges] = useState(false);

  const [approvalMasters, setApprovalMasters] = useState([]);
  const [affiliationMasters, setAffiliationMasters] = useState([]);
  const [rankingMasters, setRankingMasters] = useState([]);

  const [isCompared, setIsCompared] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= SAFE LOCAL STORAGE ================= */
  const getStoredCompareList = () => {
    try {
      const stored = localStorage.getItem("compareList");

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Invalid compareList:", error);
      return [];
    }
  };

  /* ================= LOAD DATA ================= */
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
          api.get(`/public/clients/${slug}`),
          api.get(`/public/approvals`),
          api.get(`/public/affiliations`),
          api.get(`/public/rankings`),
        ]);

        const row = clientRes.data;

        if (!row) {
          setError("University not found.");
          return;
        }

        /* ================= SAFE JSON PARSE ================= */

        let extra = {};

        try {
          extra =
            typeof row.extra_data === "string"
              ? JSON.parse(row.extra_data)
              : row.extra_data || {};
        } catch (err) {
          console.error("Invalid extra_data JSON:", err);
          extra = {};
        }

        row.extra_data = extra;

        /* ================= SET DATA ================= */

        setData(row);

        setApprovalMasters(
          Array.isArray(approvalsRes.data)
            ? approvalsRes.data
            : []
        );

        setAffiliationMasters(
          Array.isArray(affiliationsRes.data)
            ? affiliationsRes.data
            : []
        );

        setRankingMasters(
          Array.isArray(rankingsRes.data)
            ? rankingsRes.data
            : []
        );

        /* ================= HANDLE TABS ================= */

        if (Array.isArray(extra.tabs) && extra.tabs.length > 0) {
          const found = extra.tabs.find(
            (tab) => tab.slug === tabSlug
          );

          const defaultTab = found || extra.tabs[0];

          setActiveTab(defaultTab);
        } else {
          setActiveTab(null);
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

  /* ================= CHECK COMPARE STATUS ================= */
  useEffect(() => {
    if (!data) return;

    const stored = getStoredCompareList();

    setCompareCount(stored.length);

    setIsCompared(
      stored.some((u) => u.slug === data.slug)
    );
  }, [data]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container py-5">
        Loading university...
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="container py-5 text-danger">
        {error}
      </div>
    );
  }

  /* ================= NO DATA ================= */
  if (!data) {
    return (
      <div className="container py-5">
        University not found.
      </div>
    );
  }

  const extra = data.extra_data || {};

  /* ================= COMPARE ================= */
  const handleCompare = () => {
    const stored = getStoredCompareList();

    let updated;

    if (isCompared) {
      updated = stored.filter(
        (u) => u.slug !== data.slug
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
          logo_url: data.logo_url,
        },
      ];
    }

    localStorage.setItem(
      "compareList",
      JSON.stringify(updated)
    );

    setCompareCount(updated.length);

    setIsCompared(
      updated.some(
        (u) => u.slug === data.slug
      )
    );
  };

  /* ================= MASTER MAPPERS ================= */

  const getApprovalName = (id) => {
    const item = approvalMasters.find(
      (a) => String(a.id) === String(id)
    );

    return item?.name || null;
  };

  const getAffiliationName = (id) => {
    const item = affiliationMasters.find(
      (a) => String(a.id) === String(id)
    );

    return item?.name || null;
  };

  const getRankingName = (id) => {
    const item = rankingMasters.find(
      (r) => String(r.id) === String(id)
    );

    return item?.name || null;
  };

  /* ================= BADGES ================= */

  const approvalNames =
    Array.isArray(extra.approvals)
      ? extra.approvals
          .map(getApprovalName)
          .filter(Boolean)
      : [];

  const affiliationNames =
    Array.isArray(extra.affiliations)
      ? extra.affiliations
          .map(getAffiliationName)
          .filter(Boolean)
      : [];

  const rankingNames =
    Array.isArray(extra.rankings)
      ? extra.rankings
          .map(getRankingName)
          .filter(Boolean)
      : [];

  const allBadges = [
    ...approvalNames.map((name) => ({
      name,
      type: "approval",
    })),

    ...affiliationNames.map((name) => ({
      name,
      type: "affiliation",
    })),

    ...rankingNames.map((name) => ({
      name,
      type: "ranking",
    })),
  ];

  const visibleBadges = showAllBadges
    ? allBadges
    : allBadges.slice(0, 3);

  const remaining = Math.max(
    allBadges.length - 3,
    0
  );

  /* ================= PROGRAMS ================= */

  const programs = Array.isArray(extra.programs)
    ? extra.programs
    : [];

  return (
    <div className="university-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="university-header">

        {/* ================= BREADCRUMB ================= */}

        <div className="breadcrumb">
          <span
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Home
          </span>

          {" › "}

          <span
            onClick={() => navigate("/clients")}
            style={{ cursor: "pointer" }}
          >
            Universities
          </span>

          {" › "}

          <span>{data.name}</span>

          {activeTab?.title && (
            <>
              {" › "}
              <span>{activeTab.title}</span>
            </>
          )}
        </div>

        {/* ================= HEADER MAIN ================= */}

        <div className="header-main">

          {/* ================= HEADER LEFT ================= */}

          <div className="header-left">

            {/* LOGO */}

            {data.logo_url && (
              <div className="logo-box">
                <img
                  src={getImageUrl(data.logo_url)}
                  alt={data.name}
                />
              </div>
            )}

            {/* INFO */}

            <div className="header-info">

              <h1>{data.name}</h1>

              {data.description && (
                <p className="subtitle">
                  "{data.description}"
                </p>
              )}

              {/* META */}

              <div className="meta-row">

                {extra.location && (
                  <span>
                    {extra.location}
                  </span>
                )}

                {extra.established && (
                  <span>
                    Est. {extra.established}
                  </span>
                )}

                {extra.naac_grade && (
                  <span>
                    NAAC {extra.naac_grade}
                  </span>
                )}

                {data.mode && (
                  <span>
                    {data.mode}
                  </span>
                )}

              </div>

              {/* ================= BADGES ================= */}

              {allBadges.length > 0 && (
                <div className="top-badges">

                  {visibleBadges.map(
                    (badge, index) => (
                      <span
                        key={`${badge.type}-${index}`}
                        className={`chip ${badge.type}`}
                      >
                        {badge.name}
                      </span>
                    )
                  )}

                  {!showAllBadges &&
                    remaining > 0 && (
                      <span
                        className="chip more-chip"
                        onClick={() =>
                          setShowAllBadges(true)
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        +{remaining} more
                      </span>
                    )}

                </div>
              )}

            </div>
          </div>

          {/* ================= HEADER RIGHT ================= */}

          <div className="header-right">

            <button
              className="counselling-btn"
              type="button"
            >
              Get Free Counselling →
            </button>

            <button
              type="button"
              className={`compare-btn ${
                isCompared ? "active" : ""
              }`}
              onClick={handleCompare}
            >
              {isCompared
                ? "✔ Added to Compare"
                : "Compare"}
            </button>

          </div>

        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="university-content-wrapper">

        {/* ================= TABS ================= */}

        {Array.isArray(extra.tabs) &&
          extra.tabs.length > 0 && (
            <div className="tab-nav">

              {extra.tabs.map((tab) => (
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
                    navigate(
                      `/university/${slug}/${tab.slug}`
                    )
                  }
                >
                  {tab.title}
                </button>
              ))}

            </div>
          )}

        {/* =================================================
            ACTIVE TAB CONTENT
        ================================================= */}

        {activeTab && (
          <section className="tab-content-section">

            <div className="tab-content-body">

              {activeTab.content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: cleanHtml(
                      activeTab.content
                    ),
                  }}
                />
              ) : (
                <p>
                  No information available for
                  this section.
                </p>
              )}

            </div>

          </section>
        )}

        {/* =================================================
            PROGRAMS
        ================================================= */}

       

      </div>

      {/* =====================================================
          FLOATING COMPARE BAR
      ===================================================== */}

      {compareCount >= 2 && (
        <div className="compare-floating-bar">

          <span>
            {compareCount} Universities Selected
          </span>

          <button
            type="button"
            onClick={() => {
              const stored =
                getStoredCompareList();

              const query = stored
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

    </div>
  );
}