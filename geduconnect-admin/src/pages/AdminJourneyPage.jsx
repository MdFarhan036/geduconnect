import {
  useEffect,
  useState,
} from "react";

import api from "../api.js";


export default function AdminJourneyPage() {

  const [items, setItems] =
    useState([]);

  const [form, setForm] =
    useState({
      year: "",
      title: "",
      description: "",
      sort_order: 0,
      is_active: 1,
    });

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        "/journey/admin"
      );

      setItems(res.data || []);

    } catch (err) {

      console.error(
        "Failed to fetch:",
        err
      );

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {

    setForm({
      year: "",
      title: "",
      description: "",
      sort_order: 0,
      is_active: 1,
    });

    setEditingId(null);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await api.put(
          `/journey/admin/${editingId}`,
          form
        );

        alert(
          "Journey item updated"
        );

      } else {

        await api.post(
          "/journey/admin",
          form
        );

        alert(
          "Journey item created"
        );
      }

      resetForm();

      fetchItems();

    } catch (err) {

      console.error(err);

      alert(
        "Something went wrong"
      );
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (item) => {

    setEditingId(item.id);

    setForm({
      year: item.year || "",
      title: item.title || "",
      description:
        item.description || "",
      sort_order:
        item.sort_order || 0,
      is_active:
        item.is_active ?? 1,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/journey/admin/${id}`
      );

      fetchItems();

    } catch (err) {

      console.error(err);

      alert(
        "Delete failed"
      );
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="journey-admin-page">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="journey-admin-header">

        <h2>
          Journey Timeline Admin
        </h2>

        <p>
          Manage journey timeline
          milestones shown on the
          website.
        </p>

      </div>

      {/* =========================================================
          FORM
      ========================================================= */}

      <form
        className="journey-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">

          <div className="form-group">

            <label>
              Year
            </label>

            <input
              type="text"
              name="year"
              value={form.year}
              onChange={
                handleChange
              }
              placeholder="2025"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={
                handleChange
              }
              placeholder="National Expansion"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Sort Order
            </label>

            <input
              type="number"
              name="sort_order"
              value={
                form.sort_order
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="form-group checkbox-group">

            <label>
              Active
            </label>

            <input
              type="checkbox"
              name="is_active"
              checked={
                form.is_active === 1
              }
              onChange={
                handleChange
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Description
          </label>

          <textarea
            name="description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
            rows="4"
            placeholder="Write milestone description..."
          />

        </div>

        <div className="form-actions">

          <button
            type="submit"
            className="save-btn"
          >
            {editingId
              ? "Update Timeline"
              : "Create Timeline"}
          </button>

          {editingId && (

            <button
              type="button"
              className="cancel-btn"
              onClick={
                resetForm
              }
            >
              Cancel
            </button>

          )}

        </div>

      </form>

      {/* =========================================================
          TABLE
      ========================================================= */}

      <div className="journey-table-wrapper">

        <table className="journey-table">

          <thead>

            <tr>

              <th>
                Year
              </th>

              <th>
                Title
              </th>

              <th>
                Description
              </th>

              <th>
                Order
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="6"
                  className="empty-row"
                >
                  Loading...
                </td>

              </tr>

            ) : items.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="empty-row"
                >
                  No journey items found
                </td>

              </tr>

            ) : (

              items.map((item) => (

                <tr key={item.id}>

                  <td>
                    {item.year}
                  </td>

                  <td>
                    {item.title}
                  </td>

                  <td className="desc-cell">
                    {
                      item.description
                    }
                  </td>

                  <td>
                    {
                      item.sort_order
                    }
                  </td>

                  <td>

                    <span
                      className={`status-badge ${
                        item.is_active
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {item.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(
                            item
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}