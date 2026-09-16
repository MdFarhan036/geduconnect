import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import api from "../api/api";
import BlogCard from "./BlogCard";
import "./BlogsCarousel.css";

/* ── tiny hook: returns current window width, updates on resize ── */
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handle);

    return () => window.removeEventListener("resize", handle);
  }, []);

  return width;
}

/* =========================================================
   VIEW ALL MODAL
========================================================= */
const ViewAllModal = ({ blogs, onClose }) => {
  const [query, setQuery] = useState("");
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 640;

  /* Lock body scroll, handle Escape */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const filtered = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(query.toLowerCase()) ||
      b.category?.toLowerCase().includes(query.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(query.toLowerCase())
  );

  return createPortal(
    <div
      className="bcm__backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bcm__panel" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="bcm__header">
          <div className="bcm__handle" aria-hidden="true" />

          <div className="bcm__header-row">
            <h2 className="bcm__title">
              All <span>Articles</span>
            </h2>

            <button
              className="bcm__close"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bcm__search-bar">
          <div className="bcm__search-inner">
            <input
              type="text"
              className="bcm__search-input"
              placeholder="Search articles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus={!isMobile}
            />
          </div>

          <span className="bcm__count">
            {filtered.length} result
            {filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Body */}
        <div className="bcm__body">
          {filtered.length === 0 ? (
            <div className="bcm__empty">
              <strong>No articles found</strong>
            </div>
          ) : isMobile ? (
            <div className="bcm__list">
              {filtered.map((blog, i) => (
                <div
                  key={blog.id}
                  className="bcm__list-item"
                  style={{
                    animationDelay: `${Math.min(i * 0.04, 0.3)}s`,
                  }}
                  onClick={onClose}
                >
                  <BlogCard
                    title={blog.title}
                    slug={blog.slug}
                    excerpt={blog.excerpt}
                    image_url={blog.image_url}
                    thumbnail_url={blog.thumbnail_url}
                    category={blog.category}
                    reading_time={blog.reading_time}
                    author_name={blog.author_name}
                    published_at={blog.published_at}
                    created_at={blog.created_at}
                    variant="sidebar"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bcm__grid">
              {filtered.map((blog, i) => (
                <div
                  key={blog.id}
                  className="bcm__grid-item"
                  style={{
                    animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
                  }}
                  onClick={onClose}
                >
                  <BlogCard
                    title={blog.title}
                    slug={blog.slug}
                    excerpt={blog.excerpt}
                    image_url={blog.image_url}
                    thumbnail_url={blog.thumbnail_url}
                    category={blog.category}
                    reading_time={blog.reading_time}
                    author_name={blog.author_name}
                    published_at={blog.published_at}
                    created_at={blog.created_at}
                    variant="grid"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* =========================================================
   BLOGS CAROUSEL
========================================================= */
const BlogsCarousel = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);


const fetchBlogs = async () => {
  try {
    setLoading(true);

    const res = await api.get("/public/blogs");

    console.log("Blogs API:", res.data);

    // Convert MySQL / ISO date safely into a timestamp
    const getBlogTime = (blog) => {
      const dateValue = blog.created_at || blog.published_at;

      if (!dateValue) return 0;

      let dateString = String(dateValue).trim();

      // MySQL format:
      // 2026-07-25 14:30:00
      // Convert to ISO-like format for browser compatibility
      if (dateString.includes(" ") && !dateString.includes("T")) {
        dateString = dateString.replace(" ", "T");
      }

      const timestamp = new Date(dateString).getTime();

      return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const filtered = (res.data || [])
      .filter(
        (b) =>
          Number(b.is_active) === 1 &&
          String(b.status).toLowerCase() === "published"
      )
      .sort((a, b) => {
        const timeA = getBlogTime(a);
        const timeB = getBlogTime(b);

        // Newest created date first
        if (timeB !== timeA) {
          return timeB - timeA;
        }

        // If created_at is exactly the same,
        // higher database ID is considered newer
        return Number(b.id || 0) - Number(a.id || 0);
      });

    console.log(
      "Sorted Blogs:",
      filtered.map((blog) => ({
        id: blog.id,
        title: blog.title,
        created_at: blog.created_at,
        published_at: blog.published_at,
      }))
    );

    setBlogs(filtered);
    setError(null);
  } catch (err) {
    console.error("Error loading blogs:", err);
    setError("Failed to load blogs.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchBlogs();
  }, []);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  const HeroBanner = () => (
    <div className="blogcarousel__hero">
      <div className="blogcarousel__hero-content">
        <h1 className="blogcarousel__hero-title">
          Our Blog & Insights
        </h1>

        <p className="blogcarousel__hero-subtitle">
          Latest updates from G Educonnect
        </p>

        <div className="blogcarousel__search-wrap">
          <input
            type="text"
            className="blogcarousel__search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="blogcarousel__section">
        <div className="blogcarousel__container">
          <HeroBanner />

          <div className="blogcarousel__layout">
            <div className="blogcarousel__skeleton-featured" />

            <div className="blogcarousel__sidebar">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="blogcarousel__skeleton-sidebar"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="blogcarousel__section">
        <div className="blogcarousel__container">
          <HeroBanner />

          <div className="blogcarousel__error">{error}</div>
        </div>
      </section>
    );
  }

  if (!blogs.length) return null;

  /* ===============================
     FIXED SECTION
  =============================== */

  const featured = blogs[0];

// Show only 5 latest blogs in Recent Posts
const sidebarBlogs = blogs.slice(1, 6);

  return (
    <>
      <section className="blogcarousel__section">
        <div className="blogcarousel__container">
          <HeroBanner />

          <div className="blogcarousel__layout">
            {/* Featured Blog */}
            {featured && (
              <div className="blogcarousel__featured">
                <BlogCard
                  title={featured.title}
                  slug={featured.slug}
                  excerpt={featured.excerpt}
                  image_url={featured.image_url}
                  thumbnail_url={featured.thumbnail_url}
                  category={featured.category}
                  reading_time={featured.reading_time}
                  author_name={featured.author_name}
                  published_at={featured.published_at}
                  created_at={featured.created_at}
                  featured={true}
                  variant="featured"
                />
              </div>
            )}

            {/* Sidebar Blogs */}
            <div className="blogcarousel__sidebar">
              <div className="blogcarousel__sidebar-header">
                <span className="blogcarousel__sidebar-label">
                  Recent Posts
                </span>

                <button
                  className="blogcarousel__viewall-btn"
                  onClick={openModal}
                  aria-label={`View all ${blogs.length} articles`}
                >
                  View All ({blogs.length})
                </button>
              </div>

              {sidebarBlogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className="blogcarousel__sidebar-item"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <BlogCard
                    title={blog.title}
                    slug={blog.slug}
                    excerpt={blog.excerpt}
                    image_url={blog.image_url}
                    thumbnail_url={blog.thumbnail_url}
                    category={blog.category}
                    reading_time={blog.reading_time}
                    author_name={blog.author_name}
                    published_at={blog.published_at}
                    created_at={blog.created_at}
                    featured={false}
                    variant="sidebar"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <ViewAllModal
          blogs={blogs}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default BlogsCarousel;