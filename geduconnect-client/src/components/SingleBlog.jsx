import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import BlogCard from "./BlogCard";
import "./SingleBlog.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* =========================================================
   SANITIZE CMS HTML
   Removes all injected CTA blocks before render:
   - "Related Article:" banners
   - "Also Read:" banners
   - "CHECK OUT:" banners
   - Large gradient application form CTAs
   - "Explore More" link grids
   - Any <div> whose ONLY content is a styled <a> button
   Keeps: all article sections, TOC, FAQs, code blocks, lists
========================================================= */
const sanitizeBlogHtml = (html) => {
  if (!html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  // ── 1. Remove the top-level <h2> title injected by CMS
  //       (we already render blog.title in the hero)
  const firstH2 = body.querySelector("h2");
  if (firstH2 && !firstH2.closest("[id]")) {
    // Only remove if it's not inside a section (i.e. it's the standalone title)
    const parentDiv = firstH2.parentElement;
    if (parentDiv === body || (parentDiv && !parentDiv.id)) {
      // Check it looks like a standalone title (no siblings that are content)
      if (parentDiv !== body && parentDiv.children.length === 1) {
        parentDiv.remove();
      } else if (parentDiv === body) {
        firstH2.remove();
      }
    }
  }

  // ── 2. CTA trigger phrases (case-insensitive)
  const CTA_PHRASES = [
    "related article",
    "also read",
    "check out",
    "explore more",
    "common application form",
    "fill the common application form",
    "stop stressing. start applying",
    "one form · multiple colleges",
    "one form. multiple colleges",
  ];

  const isCTAText = (text) => {
    const lower = text.toLowerCase().trim();
    return CTA_PHRASES.some((phrase) => lower.includes(phrase));
  };

  // ── 3. Walk ALL direct children of body and remove CTA containers
  //       Use Array.from so removals don't break iteration
  const allDivs = Array.from(body.querySelectorAll("body > div, body > p"));

  allDivs.forEach((el) => {
    const text = el.textContent || "";

    // Remove if text matches any CTA phrase
    if (isCTAText(text)) {
      el.remove();
      return;
    }

    // Remove if element has a gradient background (application form CTA)
    const style = el.getAttribute("style") || "";
    if (
      style.includes("linear-gradient") &&
      (style.includes("#3730a3") || style.includes("#4f46e5") || style.includes("#6366f1"))
    ) {
      el.remove();
      return;
    }
  });

  // ── 4. Deep scan: remove any remaining element whose sole visible
  //       content is a coloured <a> button linking off-site as a CTA
  const allAnchors = Array.from(body.querySelectorAll("a"));
  allAnchors.forEach((a) => {
    const aStyle = a.getAttribute("style") || "";
    // Purple/indigo CTA buttons have inline background colour
    if (
      aStyle.includes("background:#3730a3") ||
      aStyle.includes("background: #3730a3") ||
      aStyle.includes("background:linear-gradient") ||
      aStyle.includes("background: linear-gradient")
    ) {
      // Walk up to nearest block-level ancestor that is only this CTA
      let target = a;
      while (
        target.parentElement &&
        target.parentElement !== body &&
        target.parentElement.textContent.trim().replace(/\s+/g, " ") ===
        target.textContent.trim().replace(/\s+/g, " ")
      ) {
        target = target.parentElement;
      }
      // Also grab the sibling <p><strong>Related Article:</strong>…</p>
      const prev = target.previousElementSibling;
      if (prev && isCTAText(prev.textContent)) prev.remove();
      target.remove();
    }
  });

  // ── 5. Remove the standalone top title <h2> with inline style
  //       (some CMS editors wrap it in an <h2 style="...">)
  Array.from(body.querySelectorAll("h2[style]")).forEach((h2) => {
    // If it has no parent with an id (not inside a section), it's the page title
    if (!h2.closest("[id]")) {
      h2.remove();
    }
  });

  // ── 6. Fix code blocks: restore < > that CMS HTML-encodes as &lt; &gt;
  //       (already decoded by DOMParser, so textContent is correct — keep as-is)

  return body.innerHTML;
};

const SingleBlog = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ── helpers ── */
  const getImageUrl = (url) => {
    if (!url) return "/default-blog.jpg";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const getDisplayDate = (b) => {
    const date = b.published_at || b.created_at;
    if (!date) return "";
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatReadTime = (reading_time) => {
    if (!reading_time) return null;
    const cleaned = String(reading_time).replace(/\s*min\s*read/gi, "").trim();
    return `${cleaned} min read`;
  };

  /* ── fetch main blog ── */
  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/public/blogs/${slug}`);
      const blogData = res.data.blog || res.data;
      if (blogData.status !== "published" || blogData.is_active !== 1) {
        setNotFound(true);
        return;
      }
      setBlog(blogData);
      setNotFound(false);
    } catch (err) {
      console.error("Error loading blog:", err);
      if (err.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  /* ── fetch recent blogs for sidebar ── */
  const fetchRecentBlogs = async () => {
    try {
      const res = await api.get("/public/blogs");
      const filtered = (res.data || [])
        .filter(
          (b) =>
            b.slug !== slug &&
            b.is_active === 1 &&
            b.status === "published"
        )
        .sort((a, b) => {
          if (b.featured !== a.featured) return b.featured - a.featured;
          return (a.sort_order || 0) - (b.sort_order || 0);
        });
      setRecentBlogs(filtered.slice(0, 4));
    } catch (err) {
      console.error("Error loading recent blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchRecentBlogs();
  }, [slug]);

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <section className="singleblog__section">
        <div className="singleblog__container">
          <div className="singleblog__layout">
            <div className="singleblog__content">
              <div className="singleblog__skeleton-hero" />
              <div className="singleblog__skeleton-body">
                <div className="singleblog__skeleton-line" style={{ width: "60%" }} />
                <div className="singleblog__skeleton-line" />
                <div className="singleblog__skeleton-line" />
                <div className="singleblog__skeleton-line" style={{ width: "80%" }} />
              </div>
            </div>
            <aside className="singleblog__sidebar">
              <div className="singleblog__sidebar-header">
                <span className="singleblog__sidebar-label">Recent Posts</span>
              </div>
              {[1, 2, 3].map((n) => (
                <div key={n} className="singleblog__skeleton-sidebar" />
              ))}
            </aside>
          </div>
        </div>
      </section>
    );
  }

  /* ── not found ── */
  if (notFound || !blog) {
    return (
      <section className="singleblog__section">
        <div className="singleblog__container">
          <div className="singleblog__notfound">
            <div className="singleblog__notfound-icon">📄</div>
            <h2 className="singleblog__notfound-title">Blog Not Found</h2>
            <p className="singleblog__notfound-text">
              This article may have been moved or is no longer available.
            </p>
            <Link to="/blog" className="singleblog__back-btn">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const displayReadTime = formatReadTime(blog.reading_time);
  const cleanContent = sanitizeBlogHtml(blog.content);

  return (
    <section className="singleblog__section">
      <div className="singleblog__container">
        <div className="singleblog__layout">

          {/* ════ LEFT: Article Content ════ */}
          <article className="singleblog__content">

            {/* Hero Image */}
            <div className="singleblog__hero">
              <img
                src={getImageUrl(blog.hero_image_url)}
                alt={blog.title}
                className="singleblog__hero-img"
              />
              <div className="singleblog__hero-overlay" />
              {blog.category && (
                <span className="singleblog__category-badge">{blog.category}</span>
              )}
              <div className="singleblog__hero-bottom">
                <h1 className="singleblog__title">{blog.title}</h1>
              </div>
            </div>

            {/* Meta row */}
            <div className="singleblog__meta-row">
              <div className="singleblog__meta-left">
                {getDisplayDate(blog) && (
                  <span className="singleblog__meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {getDisplayDate(blog)}
                  </span>
                )}
                {displayReadTime && (
                  <span className="singleblog__meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12 7 12 12 15 15" />
                    </svg>
                    {displayReadTime}
                  </span>
                )}
                {blog.author_name && (
                  <span className="singleblog__meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {blog.author_name}
                  </span>
                )}
              </div>
              {blog.tags && (
                <div className="singleblog__tags">
                  {blog.tags.split(",").map((tag, i) => (
                    <span key={i} className="singleblog__tag">{tag.trim()}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Body — sanitized, CTA-free HTML */}
            <div
              className="singleblog__body"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            {/* Back nav */}
            <div className="singleblog__nav">
              <Link to="/blog" className="singleblog__back-btn">← Back to Blog</Link>
            </div>

          </article>

          {/* ════ RIGHT: Sidebar ════ */}
          <aside className="singleblog__sidebar">
            <div className="singleblog__sidebar-header">
              <span className="singleblog__sidebar-label">Recent Posts</span>
            </div>
            {recentBlogs.length > 0 ? (
              <div className="singleblog__sidebar-list">
                {recentBlogs.map((item, i) => (
                  <div
                    key={item.id}
                    className="singleblog__sidebar-item"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <BlogCard
                      title={item.title}
                      slug={item.slug}
                      excerpt={item.excerpt}
                      image_url={item.image_url}
                      thumbnail_url={item.thumbnail_url}
                      category={item.category}
                      reading_time={item.reading_time}
                      author_name={item.author_name}
                      published_at={item.published_at}
                      created_at={item.created_at}
                      variant="sidebar"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="singleblog__sidebar-empty">No recent posts.</p>
            )}
            <div className="singleblog__sidebar-footer">
              <Link to="/blog" className="singleblog__viewall-btn">
                View All Articles
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
};

export default SingleBlog;