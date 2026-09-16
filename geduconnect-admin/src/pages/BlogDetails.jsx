import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      const res = await api.get(`/public/blogs/${slug}`);
      setBlog(res.data.blog);
      setRelated(res.data.related || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <section className="row-section blog-section">
      <div className="container">
        <div className="blog-layout">

          {/* LEFT CONTENT */}
          <div className="blog-content">

            {/* HERO */}
            <div className="blog-hero">
              <img src={getImageUrl(blog.image_url)} alt={blog.title} />
              <div className="blog-hero-text">
                <h1>{blog.title}</h1>
              </div>
            </div>

            {/* ARTICLE */}
            <div className="blog-article">

              {blog.excerpt && <p>{blog.excerpt}</p>}

              {/* Render HTML Content */}
              <div
                dangerouslySetInnerHTML={{
                  __html: blog.content
                }}
              />

              {/* Navigation */}
              <div className="blog-nav">
                <a href="/blog" className="prev-post">
                  ← Back to Blog
                </a>
              </div>

            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="blog-sidebar">
            {related.map((item) => (
              <div key={item.id} className="sidebar-card">
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                />
                <h4>{item.title}</h4>
                <a href={`/blog/${item.slug}`}>
                  Read More →
                </a>
              </div>
            ))}
          </aside>

        </div>
      </div>
    </section>
  );
}
