import React, { useEffect, useState } from "react";
import api from "../api";

export default function ModeManagement() {
    const [modes, setModes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        is_active: true,
        sort_order: 0
    });

    /* =====================================================
       LOAD MODES
    ===================================================== */
    useEffect(() => {
        fetchModes();
    }, []);

    const fetchModes = async () => {
        try {
            setLoading(true);

            const res = await api.get("/admin/modes");

            setModes(res.data || []);
        } catch (error) {
            console.error("Failed to load modes:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load modes"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       FORM
    ===================================================== */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleNameChange = (e) => {
        const value = e.target.value;

        setForm((prev) => ({
            ...prev,
            name: value,
            slug: editingId ? prev.slug : generateSlug(value)
        }));
    };

    /* =====================================================
       OPEN ADD
    ===================================================== */
    const openAddModal = () => {
        setEditingId(null);

        setForm({
            name: "",
            slug: "",
            description: "",
            is_active: true,
            sort_order: 0
        });

        setShowModal(true);
    };

    /* =====================================================
       OPEN EDIT
    ===================================================== */
    const openEditModal = (mode) => {
        setEditingId(mode.id);

        setForm({
            name: mode.name || "",
            slug: mode.slug || "",
            description: mode.description || "",
            is_active: Boolean(mode.is_active),
            sort_order: mode.sort_order ?? 0
        });

        setShowModal(true);
    };

    /* =====================================================
       SAVE
    ===================================================== */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Mode name is required");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: form.name.trim(),
                slug: form.slug.trim() || generateSlug(form.name),
                description: form.description.trim(),
                is_active: form.is_active ? 1 : 0,
                sort_order: Number(form.sort_order) || 0
            };

            if (editingId) {
                await api.put(
                    `/admin/modes/${editingId}`,
                    payload
                );

                alert("Mode updated successfully");
            } else {
                await api.post(
                    "/admin/modes",
                    payload
                );

                alert("Mode created successfully");
            }

            setShowModal(false);

            setEditingId(null);

            await fetchModes();

        } catch (error) {
            console.error("Save mode error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save mode"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       DELETE
    ===================================================== */
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this mode?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/admin/modes/${id}`);

            alert("Mode deleted successfully");

            fetchModes();

        } catch (error) {
            console.error("Delete mode error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete mode"
            );
        }
    };

    /* =====================================================
       FILTER
    ===================================================== */
    const filteredModes = modes.filter((mode) => {
        const searchText = search.toLowerCase();

        return (
            mode.name?.toLowerCase().includes(searchText) ||
            mode.slug?.toLowerCase().includes(searchText) ||
            mode.description?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="admin-page">

            {/* =================================================
                HEADER
            ================================================= */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >
                <div>
                    <h2 style={{ margin: 0 }}>
                        Mode Management
                    </h2>

                    <p
                        style={{
                            marginTop: "5px",
                            color: "#777"
                        }}
                    >
                        Manage learning modes used across
                        courses and programs.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="btn btn-primary"
                >
                    + Add Mode
                </button>
            </div>

            {/* =================================================
                SEARCH
            ================================================= */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search modes..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        padding: "10px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px"
                    }}
                />
            </div>

            {/* =================================================
                TABLE
            ================================================= */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #eee"
                }}
            >
                {loading ? (
                    <div style={{ padding: "30px" }}>
                        Loading modes...
                    </div>
                ) : filteredModes.length === 0 ? (
                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center",
                            color: "#777"
                        }}
                    >
                        No modes found.
                    </div>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "#f7f7f7",
                                    textAlign: "left"
                                }}
                            >
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Slug</th>
                                <th style={thStyle}>
                                    Description
                                </th>
                                <th style={thStyle}>
                                    Sort Order
                                </th>
                                <th style={thStyle}>
                                    Status
                                </th>
                                <th style={thStyle}>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredModes.map((mode, index) => (
                                <tr key={mode.id}>
                                    <td style={tdStyle}>
                                        {index + 1}
                                    </td>

                                    <td style={tdStyle}>
                                        <strong>
                                            {mode.name}
                                        </strong>
                                    </td>

                                    <td style={tdStyle}>
                                        {mode.slug}
                                    </td>

                                    <td style={tdStyle}>
                                        {mode.description || "-"}
                                    </td>

                                    <td style={tdStyle}>
                                        {mode.sort_order}
                                    </td>

                                    <td style={tdStyle}>
                                        {Number(mode.is_active) === 1 ? (
                                            <span
                                                style={{
                                                    color: "green",
                                                    fontWeight: 600
                                                }}
                                            >
                                                Active
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontWeight: 600
                                                }}
                                            >
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td style={tdStyle}>
                                        <button
                                            onClick={() =>
                                                openEditModal(mode)
                                            }
                                            className="btn btn-sm"
                                            style={{
                                                marginRight: "8px"
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(mode.id)
                                            }
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* =================================================
                MODAL
            ================================================= */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "520px",
                            background: "#fff",
                            borderRadius: "10px",
                            padding: "25px",
                            boxShadow:
                                "0 10px 40px rgba(0,0,0,0.2)"
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>
                            {editingId
                                ? "Edit Mode"
                                : "Add Mode"}
                        </h3>

                        <form onSubmit={handleSubmit}>

                            {/* NAME */}
                            <div style={fieldStyle}>
                                <label>
                                    Mode Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Online"
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* SLUG */}
                            <div style={fieldStyle}>
                                <label>
                                    Slug *
                                </label>

                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="online"
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div style={fieldStyle}>
                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Mode description"
                                    style={inputStyle}
                                />
                            </div>

                            {/* SORT ORDER */}
                            <div style={fieldStyle}>
                                <label>
                                    Sort Order
                                </label>

                                <input
                                    type="number"
                                    name="sort_order"
                                    value={form.sort_order}
                                    onChange={handleChange}
                                    min="0"
                                    style={inputStyle}
                                />
                            </div>

                            {/* ACTIVE */}
                            <div
                                style={{
                                    ...fieldStyle,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleChange}
                                />

                                <label>
                                    Active
                                </label>
                            </div>

                            {/* ACTIONS */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                    marginTop: "20px"
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="btn"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                        ? "Update Mode"
                                        : "Create Mode"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


/* =========================================================
   STYLES
========================================================= */

const thStyle = {
    padding: "12px 15px",
    borderBottom: "1px solid #ddd",
    fontWeight: 600
};

const tdStyle = {
    padding: "12px 15px",
    borderBottom: "1px solid #eee"
};

const fieldStyle = {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
};

const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxSizing: "border-box"
};