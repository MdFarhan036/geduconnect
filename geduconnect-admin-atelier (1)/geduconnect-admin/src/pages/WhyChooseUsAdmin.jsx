import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const BASE_URL = API_BASE.replace("/api", "");

const emptyForm = {
    heading: "",
    description: "",
    offerings_title: "",
    cta_text: "",
    cta_link: "",
    image: null,
    image_url: null,
    is_active: 1
};

export default function WhyChooseUsAdmin() {
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [newPoint, setNewPoint] = useState("");

    const [newIcon, setNewIcon] = useState("");
    const [newImage, setNewImage] = useState(null);

    /* ================= FETCH ================= */
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/why-choose-us");
            setData(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= OPEN EDIT ================= */
    const openEdit = () => {
        if (!data) {
            setForm(emptyForm);
        } else {
            setForm({
                heading: data.heading || "",
                description: data.description || "",
                offerings_title: data.offerings_title || "",
                cta_text: data.cta_text || "",
                cta_link: data.cta_link || "",
                image: null,
                image_url: data.image_url || null,
                is_active: data.is_active ?? 1
            });
        }

        setOpen(true);
    };

    /* ================= SAVE SECTION ================= */
    const save = async () => {
        try {
            const fd = new FormData();

            fd.append("heading", form.heading);
            fd.append("description", form.description);
            fd.append("offerings_title", form.offerings_title);
            fd.append("cta_text", form.cta_text);
            fd.append("cta_link", form.cta_link);
            fd.append("is_active", form.is_active);

            if (form.image) {
                fd.append("image", form.image);
            }

            if (!data) {
                await api.post("/admin/why-choose-us", form);
            } else {
                await api.put("/admin/why-choose-us", fd);
            }

            setOpen(false);
            fetchData();
        } catch (err) {
            console.error("Save error:", err);
            alert("Something went wrong");
        }
    };

    /* ================= ADD POINT ================= */
    const addPoint = async () => {
        if (!newPoint.trim() || !data?.id) return;

        const fd = new FormData();
        fd.append("section_id", data.id);
        fd.append("point", newPoint);
        fd.append("sort_order", data.points?.length + 1 || 1);
        fd.append("icon_class", newIcon);

        if (newImage) {
            fd.append("image", newImage);
        }

        await api.post("/admin/why-choose-us/points", fd);

        setNewPoint("");
        setNewIcon("");
        setNewImage(null);
        fetchData();
    };

    /* ================= DELETE POINT ================= */
    const deletePoint = async (id) => {
        await api.delete(`/admin/why-choose-us/points/${id}`);
        fetchData();
    };

    if (loading) return <div>Loading...</div>;

    const getImageUrl = (path) =>
        `${BASE_URL}${path?.startsWith("/") ? "" : "/"}${path}`;

    return (
        <div className="highlight-admin">
            <div className="page-header">
                <h2>Why Choose Us</h2>
                <button className="btn primary" onClick={openEdit}>
                    {data ? "Edit" : "Create"}
                </button>
            </div>

            {/* ================= PREVIEW CARD ================= */}
            {data && (
                <div className="admin-card">
                    <h3>{data.heading}</h3>
                    <p>{data.description}</p>

                    <h4>{data.offerings_title}</h4>

                    {/* Points List */}
                    <div style={{ marginTop: 10 }}>
                        {data.points?.map((p) => (
                            <div
                                key={p.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 5
                                }}
                            >
                                <span>{p.point}</span>
                                <button
                                    className="btn danger small"
                                    onClick={() => deletePoint(p.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add New Point */}
                    {data && (
                        <div style={{ marginTop: 15 }}>
                            <h4>Add Offering Point</h4>

                            <input
                                value={newPoint}
                                onChange={(e) => setNewPoint(e.target.value)}
                                placeholder="Point text"
                            />

                            <input
                                value={newIcon}
                                onChange={(e) => setNewIcon(e.target.value)}
                                placeholder="Icon class (e.g. fa-solid fa-check)"
                                style={{ marginTop: 5 }}
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewImage(e.target.files[0])}
                                style={{ marginTop: 5 }}
                            />

                            <button
                                className="btn primary"
                                onClick={addPoint}
                                style={{ marginTop: 10 }}
                            >
                                Add Point
                            </button>
                        </div>

                    )}

                    {data.image_url && (
                        <img
                            src={getImageUrl(data.image_url)}
                            alt="Why Choose Us"
                            style={{ width: 250, marginTop: 15 }}
                        />
                    )}

                    <p>Status: {data.is_active ? "Active" : "Inactive"}</p>
                </div>
            )}

            {/* ================= MODAL ================= */}
            <Modal
                open={open}
                title="Edit Why Choose Us"
                onClose={() => setOpen(false)}
                footer={
                    <>
                        <button className="btn" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                        <button className="btn primary" onClick={save}>
                            Save
                        </button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Heading</label>
                    <input
                        value={form.heading}
                        onChange={(e) =>
                            setForm({ ...form, heading: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Offerings Title</label>
                    <input
                        value={form.offerings_title}
                        onChange={(e) =>
                            setForm({ ...form, offerings_title: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>CTA Text</label>
                    <input
                        value={form.cta_text}
                        onChange={(e) =>
                            setForm({ ...form, cta_text: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>CTA Link</label>
                    <input
                        value={form.cta_link}
                        onChange={(e) =>
                            setForm({ ...form, cta_link: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Image</label>

                    {form.image_url && !form.image && (
                        <img
                            src={getImageUrl(form.image_url)}
                            alt="preview"
                            style={{ width: 150, marginBottom: 10 }}
                        />
                    )}

                    {form.image && (
                        <img
                            src={URL.createObjectURL(form.image)}
                            alt="preview"
                            style={{ width: 150, marginBottom: 10 }}
                        />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setForm({ ...form, image: e.target.files[0] })
                        }
                    />
                </div>

                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={form.is_active === 1}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                is_active: e.target.checked ? 1 : 0
                            })
                        }
                    />
                    Active
                </label>
            </Modal>
        </div>
    );
}
