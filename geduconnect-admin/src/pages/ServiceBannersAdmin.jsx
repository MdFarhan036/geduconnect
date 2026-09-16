import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function ServiceBannersAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await api.get(`/admin/services/${id}/banners`);
      setBanners(res.data || []);
    } catch (err) {
      console.error("Error loading banners", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("sort_order", sortOrder);
    formData.append("is_active", isActive);

    try {
      setLoading(true);
      await api.post(`/admin/services/${id}/banners`, formData);
      setImage(null);
      setSortOrder(1);
      setIsActive(1);
      fetchBanners();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (bannerId) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await api.delete(`/admin/service-banners/${bannerId}`);
      fetchBanners();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const toggleStatus = async (banner) => {
    try {
      await api.put(`/admin/service-banners/${banner.id}`, {
        is_active: banner.is_active ? 0 : 1,
      });
      fetchBanners();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>Service Carousel Images</h2>
        <button
          className="btn secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* Upload Form */}
      <form className="admin-form" onSubmit={handleUpload}>
        <div>
          <label>Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div>
          <label>Sort Order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <button className="btn primary" disabled={loading}>
          {loading ? "Uploading..." : "Upload Banner"}
        </button>
      </form>

      {/* Banner List */}
      <div className="banner-grid">
        {banners.map((b) => (
          <div key={b.id} className="banner-card">
            <img
              src={`${api.defaults.baseURL}${b.image_url}`}
              alt=""
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />

            <div className="banner-info">
              <p>Order: {b.sort_order}</p>
              <p>
                Status:{" "}
                <span
                  style={{
                    color: b.is_active ? "green" : "red",
                    fontWeight: 600,
                  }}
                >
                  {b.is_active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>

            <div className="actions">
              <button
                className="btn info"
                onClick={() => toggleStatus(b)}
              >
                Toggle
              </button>

              <button
                className="btn danger"
                onClick={() => remove(b.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
