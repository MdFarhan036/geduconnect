import { useState } from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

/* =========================================================
   HELPERS
========================================================= */

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const formatDate = (published_at, created_at) => {
  const date = published_at || created_at;
  if (!date) return "";
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

/* =========================================================
   BLOG CARD
   variant="featured"  → large card with image background, title overlay at bottom
   variant="sidebar"   → horizontal thumbnail + date + title
   variant="grid"      → original 3-column grid card (default fallback)
========================================================= */

const BlogCard = ({
  title,
  slug,
  excerpt,
  image_url,
  published_at,
  created_at,
  reading_time,
  category,
  author_name,
  variant = "grid",
}) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getImageUrl(image_url);
  const showFallback = !imageUrl || imgError;
  const displayDate = formatDate(published_at, created_at);

  /* =========================================================
     FEATURED VARIANT — big card, image fills, text at bottom
  ========================================================= */
  if (variant === "featured") {
    return (
      <Link to={`/blog/${slug}`} className="blogcard__featured-link">
        {/* Background image */}
        {!showFallback ? (
          <img
            className="blogcard__featured-img"
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="blogcard__featured-fallback" />
        )}

        {/* Dark gradient overlay */}
        <div className="blogcard__featured-overlay" />

        {/* Category badge */}
        {category && (
          <span className="blogcard__featured-badge">{category}</span>
        )}

        {/* Bottom content */}
        <div className="blogcard__featured-bottom">
          <h2 className="blogcard__featured-title">{title}</h2>
          <div className="blogcard__featured-meta">
            <span className="blogcard__featured-date">{displayDate}</span>
            {reading_time && (
              <span className="blogcard__featured-read">
                {reading_time} min read
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  /* =========================================================
     SIDEBAR VARIANT — horizontal: thumbnail left, text right
  ========================================================= */
  if (variant === "sidebar") {
    return (
      <Link to={`/blog/${slug}`} className="blogcard__sidebar-link">
        {/* Thumbnail */}
        <div className="blogcard__sidebar-thumb">
          {!showFallback ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="blogcard__sidebar-thumb-img"
            />
          ) : (
            <div className="blogcard__sidebar-thumb-fallback" />
          )}
        </div>

        {/* Text */}
        <div className="blogcard__sidebar-text">
          <span className="blogcard__sidebar-date">{displayDate}</span>
          <h3 className="blogcard__sidebar-title">{title}</h3>
        </div>
      </Link>
    );
  }

  /* =========================================================
     GRID VARIANT (default) — standard card with image top + content
  ========================================================= */
  return (
    <div className="blogcard__grid-card">
      <Link to={`/blog/${slug}`} className="blogcard__grid-link">
        {/* Image */}
        <div className="blogcard__grid-image-wrap">
          {!showFallback ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="blogcard__grid-img"
            />
          ) : (
            <div className="blogcard__grid-fallback" />
          )}
          <div className="blogcard__grid-overlay" />
          {category && (
            <span className="blogcard__grid-badge">{category}</span>
          )}
        </div>

        {/* Content */}
        <div className="blogcard__grid-content">
          <div className="blogcard__grid-meta">
            <span>{displayDate}</span>
            <span className="blogcard__grid-meta-dot" />
            <span>{reading_time || "5"} Min Read</span>
          </div>
          <h3 className="blogcard__grid-title">{title}</h3>
          {excerpt && <p className="blogcard__grid-excerpt">{excerpt}</p>}
          <div className="blogcard__grid-btn-wrap">
            <span className="blogcard__grid-btn">
              Read Article <span className="blogcard__grid-arrow">→</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;