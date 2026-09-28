import { useEffect, useState } from "react";
import api from "../api/api";

export default function UniversityCarouselImages({
  universityId,
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [imageUrl, setImageUrl] =
    useState("");

  const [imageAlt, setImageAlt] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  /* =======================================================
     LOAD
  ======================================================= */

  const loadImages = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/university-images/admin/${universityId}`
      );

      setImages(
        Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );

    } catch (error) {
      console.error(
        "Failed to load images:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (universityId) {
      loadImages();
    }
  }, [universityId]);

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    if (!imageUrl.trim()) {
      alert("Please enter image URL");
      return;
    }

    try {
      if (editingId) {

        await api.put(
          `/university-images/admin/${editingId}`,
          {
            image_url: imageUrl,
            image_alt: imageAlt,
            sort_order:
              images.find(
                (item) =>
                  item.id === editingId
              )?.sort_order || 0,
            is_active: 1,
          }
        );

      } else {

        await api.post(
          `/university-images/admin/${universityId}`,
          {
            image_url: imageUrl,
            image_alt: imageAlt,
            sort_order:
              images.length + 1,
            is_active: 1,
          }
        );
      }

      setImageUrl("");
      setImageAlt("");
      setEditingId(null);

      await loadImages();

    } catch (error) {
      console.error(
        "Failed to save image:",
        error
      );

      alert(
        "Failed to save image"
      );
    }
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (image) => {
    setEditingId(image.id);

    setImageUrl(
      image.image_url || ""
    );

    setImageAlt(
      image.image_alt || ""
    );
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Delete this carousel image?"
      );

    if (!confirmed) return;

    try {

      await api.delete(
        `/university-images/admin/${id}`
      );

      await loadImages();

    } catch (error) {
      console.error(
        "Failed to delete image:",
        error
      );

      alert(
        "Failed to delete image"
      );
    }
  };

  /* =======================================================
     TOGGLE
  ======================================================= */

  const toggleActive = async (image) => {
    try {

      await api.put(
        `/university-images/admin/${image.id}`,
        {
          image_url:
            image.image_url,

          image_alt:
            image.image_alt,

          sort_order:
            image.sort_order,

          is_active:
            image.is_active ? 0 : 1,
        }
      );

      await loadImages();

    } catch (error) {
      console.error(
        "Failed to update image status:",
        error
      );
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const cancelEdit = () => {
    setEditingId(null);
    setImageUrl("");
    setImageAlt("");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="admin-carousel-manager">

      <div className="carousel-manager-header">

        <div>
          <h2>
            University Carousel Images
          </h2>

          <p>
            Add multiple campus,
            university and facility
            images for the university
            profile carousel.
          </p>
        </div>

      </div>


      {/* =================================================
          ADD / EDIT
      ================================================= */}

      <div className="carousel-image-form">

        <div className="form-group">

          <label>
            Image URL
          </label>

          <input
            type="text"
            value={imageUrl}
            onChange={(e) =>
              setImageUrl(
                e.target.value
              )
            }
            placeholder="/uploads/universities/vgu-campus.jpg"
          />

        </div>


        <div className="form-group">

          <label>
            Image Alt Text
          </label>

          <input
            type="text"
            value={imageAlt}
            onChange={(e) =>
              setImageAlt(
                e.target.value
              )
            }
            placeholder="Vivekananda Global University Campus"
          />

        </div>


        <div className="form-actions">

          <button
            type="button"
            onClick={handleSave}
            className="save-image-btn"
          >
            {editingId
              ? "Update Image"
              : "+ Add Image"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="cancel-image-btn"
            >
              Cancel
            </button>
          )}

        </div>

      </div>


      {/* =================================================
          IMAGES
      ================================================= */}

      {loading ? (
        <div className="carousel-loading">
          Loading images...
        </div>
      ) : images.length === 0 ? (

        <div className="carousel-empty">

          <div>
            🖼️
          </div>

          <h3>
            No carousel images
          </h3>

          <p>
            Add the first university
            image above.
          </p>

        </div>

      ) : (

        <div className="admin-carousel-grid">

          {images.map(
            (image, index) => (

              <div
                className={`admin-carousel-card ${
                  !image.is_active
                    ? "inactive"
                    : ""
                }`}
                key={image.id}
              >

                <div className="admin-image-preview">

                  <img
                    src={image.image_url}
                    alt={
                      image.image_alt ||
                      `University Image ${
                        index + 1
                      }`
                    }
                  />

                  <span className="image-order">
                    #{index + 1}
                  </span>

                  {!image.is_active && (
                    <span className="inactive-overlay">
                      INACTIVE
                    </span>
                  )}

                </div>


                <div className="admin-image-info">

                  <strong>
                    Image {index + 1}
                  </strong>

                  <small>
                    {image.image_alt ||
                      "No alt text"}
                  </small>

                </div>


                <div className="admin-image-actions">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        image
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleActive(
                        image
                      )
                    }
                  >
                    {image.is_active
                      ? "Disable"
                      : "Enable"}
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() =>
                      handleDelete(
                        image.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            )
          )}

        </div>
      )}

    </div>
  );
}