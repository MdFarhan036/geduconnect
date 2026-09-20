import { useEffect, useState } from "react";
import "./MediaGallery.css";
import api from "../api";

const IMAGE_BASE =
    api.defaults.baseURL?.replace(/\/api\/?$/, "") ||
    "";
/* =========================================================
   MEDIA GALLERY
========================================================= */

export default function MediaGallery() {
    /* =========================
       MEDIA
    ========================= */

    const [media, setMedia] = useState([]);

    /* =========================
       FOLDERS
    ========================= */

    const [folders, setFolders] = useState([]);
    const [folder, setFolder] = useState("all");

    /* =========================
       LOADING
    ========================= */

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [creatingFolder, setCreatingFolder] = useState(false);

    /* =========================
       UPLOAD
    ========================= */

    const [selectedFiles, setSelectedFiles] = useState([]);

    const [altText, setAltText] = useState("");
    const [title, setTitle] = useState("");

    /* =========================
       CREATE FOLDER
    ========================= */

    const [showCreateFolder, setShowCreateFolder] =
        useState(false);

    const [newFolder, setNewFolder] = useState("");

    /* =========================================================
       FETCH FOLDERS
    ========================================================= */

    const fetchFolders = async () => {
        try {
            const response = await api.get(
                "/admin/media/folders"
            );

            setFolders(response.data?.folders || []);
        } catch (error) {
            console.error(
                "Failed to load folders:",
                error
            );
        }
    };

    /* =========================================================
       FETCH MEDIA
    ========================================================= */

    const fetchMedia = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                "/admin/media",
                {
                    params: {
                        folder,
                    },
                }
            );

            setMedia(response.data || []);
        } catch (error) {
            console.error(
                "Failed to load media:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to load media"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {
        fetchFolders();
    }, []);

    /* =========================================================
       LOAD MEDIA WHEN FOLDER CHANGES
    ========================================================= */

    useEffect(() => {
        fetchMedia();
    }, [folder]);

    /* =========================================================
       FILE SELECT
    ========================================================= */

    const handleFileChange = (event) => {
        const files = Array.from(
            event.target.files || []
        );

        setSelectedFiles(files);
    };

    /* =========================================================
       CREATE FOLDER
    ========================================================= */

    const handleCreateFolder = async () => {
        const folderName = newFolder.trim();

        if (!folderName) {
            alert("Please enter folder name");
            return;
        }

        /* Basic frontend validation */

        if (
            !/^[a-zA-Z0-9_-]+$/.test(folderName)
        ) {
            alert(
                "Folder name can contain only letters, numbers, hyphen and underscore"
            );
            return;
        }

        try {
            setCreatingFolder(true);

            const response = await api.post(
                "/admin/media/folders",
                {
                    folder: folderName,
                }
            );

            const createdFolder =
                response.data?.folder ||
                folderName.toLowerCase();

            alert(
                response.data?.message ||
                    "Folder created successfully"
            );

            /* Clear form */

            setNewFolder("");
            setShowCreateFolder(false);

            /* Reload folders */

            await fetchFolders();

            /* Automatically select new folder */

            setFolder(
                createdFolder.toLowerCase()
            );
        } catch (error) {
            console.error(
                "Create folder failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to create folder"
            );
        } finally {
            setCreatingFolder(false);
        }
    };

    /* =========================================================
       UPLOAD IMAGES
    ========================================================= */

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select at least one image");
            return;
        }

        const uploadFolder =
            folder === "all" ? "common" : folder;

        try {
            setUploading(true);

            for (const file of selectedFiles) {
                const formData = new FormData();

                formData.append("image", file);

                formData.append(
                    "folder",
                    uploadFolder
                );

                formData.append(
                    "alt_text",
                    altText
                );

                formData.append(
                    "title",
                    title
                );

                await api.post(
                    "/admin/media",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );
            }

            alert(
                "Images uploaded successfully"
            );

            /* Reset */

            setSelectedFiles([]);
            setAltText("");
            setTitle("");

            const input =
                document.getElementById(
                    "media-file-input"
                );

            if (input) {
                input.value = "";
            }

            /* Reload */

            await fetchFolders();
            await fetchMedia();
        } catch (error) {
            console.error(
                "Upload failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to upload image"
            );
        } finally {
            setUploading(false);
        }
    };

    /* =========================================================
       DELETE IMAGE
    ========================================================= */

    const handleDelete = async (filePath) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) return;

        try {
            await api.delete(
                "/admin/media",
                {
                    data: {
                        file_path: filePath,
                    },
                }
            );

            setMedia((previous) =>
                previous.filter(
                    (item) =>
                        item.file_path !==
                        filePath
                )
            );

            await fetchFolders();
        } catch (error) {
            console.error(
                "Delete failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete image"
            );
        }
    };

    /* =========================================================
       COPY IMAGE URL
    ========================================================= */

    const copyUrl = async (filePath) => {
        const url =
            `${IMAGE_BASE}${filePath}`;

        try {
            await navigator.clipboard.writeText(
                url
            );

            alert("Image URL copied");
        } catch (error) {
            console.error(
                "Copy URL failed:",
                error
            );

            /* Fallback */

            try {
                const textarea =
                    document.createElement(
                        "textarea"
                    );

                textarea.value = url;

                document.body.appendChild(
                    textarea
                );

                textarea.select();

                document.execCommand(
                    "copy"
                );

                textarea.remove();

                alert("Image URL copied");
            } catch {
                alert(
                    "Unable to copy image URL"
                );
            }
        }
    };

    /* =========================================================
       FORMAT FILE SIZE
    ========================================================= */

    const formatFileSize = (bytes) => {
        if (!bytes) return "";

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;
        }

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };

    /* =========================================================
       IMAGE URL
    ========================================================= */

    const getImageUrl = (filePath) => {
        if (!filePath) return "";

        if (
            filePath.startsWith("http://") ||
            filePath.startsWith("https://")
        ) {
            return filePath;
        }

        return `${IMAGE_BASE}${filePath}`;
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="media-gallery-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="media-header">
                <div>
                    <h1>Media Gallery</h1>

                    <p>
                        Manage all images uploaded
                        to G Educonnect.
                    </p>
                </div>

                <button
                    type="button"
                    className="create-folder-btn"
                    onClick={() =>
                        setShowCreateFolder(
                            true
                        )
                    }
                >
                    + Create Folder
                </button>
            </div>

            {/* =================================================
                CREATE FOLDER
            ================================================= */}

            {showCreateFolder && (
                <div className="create-folder-card">

                    <div className="create-folder-header">
                        <h2>
                            Create New Folder
                        </h2>

                        <button
                            type="button"
                            onClick={() => {
                                setNewFolder("");
                                setShowCreateFolder(
                                    false
                                );
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div className="create-folder-content">

                        <div className="folder-input-wrapper">
                            <label>
                                Folder Name
                            </label>

                            <input
                                type="text"
                                value={
                                    newFolder
                                }
                                onChange={(event) =>
                                    setNewFolder(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="e.g. programs"
                                maxLength={100}
                                autoFocus
                            />

                            <small>
                                Use only letters,
                                numbers, hyphen
                                (-) and
                                underscore (_).
                            </small>
                        </div>

                        <div className="folder-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setNewFolder(
                                        ""
                                    );

                                    setShowCreateFolder(
                                        false
                                    );
                                }}
                                disabled={
                                    creatingFolder
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="create-btn"
                                onClick={
                                    handleCreateFolder
                                }
                                disabled={
                                    creatingFolder
                                }
                            >
                                {creatingFolder
                                    ? "Creating..."
                                    : "Create Folder"}
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* =================================================
                UPLOAD CARD
            ================================================= */}

            <div className="media-upload-card">

                <h2>Upload Images</h2>

                <div className="media-form-grid">

                    {/* FOLDER */}

                    <div>
                        <label>
                            Folder
                        </label>

                        <select
                            value={
                                folder === "all"
                                    ? "common"
                                    : folder
                            }
                            onChange={(event) =>
                                setFolder(
                                    event.target
                                        .value
                                )
                            }
                        >
                            {folders.length ===
                            0 ? (
                                <option value="common">
                                    common
                                </option>
                            ) : (
                                folders.map(
                                    (item) => (
                                        <option
                                            key={
                                                item
                                            }
                                            value={
                                                item
                                            }
                                        >
                                            {item}
                                        </option>
                                    )
                                )
                            )}
                        </select>
                    </div>

                    {/* TITLE */}

                    <div>
                        <label>
                            Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Image title"
                        />
                    </div>

                    {/* ALT */}

                    <div>
                        <label>
                            Alt Text
                        </label>

                        <input
                            type="text"
                            value={altText}
                            onChange={(event) =>
                                setAltText(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="SEO alt text"
                        />
                    </div>

                    {/* FILE */}

                    <div>
                        <label>
                            Select Images
                        </label>

                        <input
                            id="media-file-input"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={
                                handleFileChange
                            }
                        />
                    </div>

                </div>

                {/* SELECTED FILES */}

                {selectedFiles.length >
                    0 && (
                    <div className="selected-files">

                        <strong>
                            {
                                selectedFiles.length
                            }{" "}
                            image
                            {selectedFiles.length >
                            1
                                ? "s"
                                : ""}{" "}
                            selected
                        </strong>

                        <ul>
                            {selectedFiles.map(
                                (
                                    file,
                                    index
                                ) => (
                                    <li
                                        key={
                                            index
                                        }
                                    >
                                        {
                                            file.name
                                        }

                                        <span>
                                            {" "}
                                            (
                                            {formatFileSize(
                                                file.size
                                            )}
                                            )
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}

                {/* UPLOAD */}

                <button
                    type="button"
                    className="upload-btn"
                    onClick={
                        handleUpload
                    }
                    disabled={
                        uploading ||
                        selectedFiles.length ===
                            0
                    }
                >
                    {uploading
                        ? "Uploading..."
                        : "Upload Images"}
                </button>

            </div>

            {/* =================================================
                FOLDER TABS
            ================================================= */}

            <div className="media-folder-section">

                <div className="media-folder-tabs">

                    <button
                        type="button"
                        className={
                            folder === "all"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFolder(
                                "all"
                            )
                        }
                    >
                        All Images
                    </button>

                    {folders.map(
                        (item) => (
                            <button
                                key={item}
                                type="button"
                                className={
                                    folder ===
                                    item
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setFolder(
                                        item
                                    )
                                }
                            >
                                {item}
                            </button>
                        )
                    )}

                    {/* CREATE FOLDER */}

                    <button
                        type="button"
                        className="folder-add-tab"
                        onClick={() =>
                            setShowCreateFolder(
                                true
                            )
                        }
                    >
                        + Folder
                    </button>

                </div>

            </div>

            {/* =================================================
                MEDIA COUNT
            ================================================= */}

            {!loading &&
                media.length > 0 && (
                    <div className="media-count">
                        Showing{" "}
                        <strong>
                            {media.length}
                        </strong>{" "}
                        image
                        {media.length !==
                        1
                            ? "s"
                            : ""}
                    </div>
                )}

            {/* =================================================
                MEDIA GRID
            ================================================= */}

            <div className="media-grid">

                {/* LOADING */}

                {loading ? (
                    <div className="media-loading">
                        Loading images...
                    </div>
                ) : media.length ===
                  0 ? (
                    /* EMPTY */

                    <div className="media-empty">

                        <div className="empty-icon">
                            🖼️
                        </div>

                        <h3>
                            No images found
                        </h3>

                        <p>
                            There are no
                            images in this
                            folder yet.
                        </p>

                    </div>
                ) : (
                    /* IMAGES */

                    media.map((item) => {

                        const imageUrl =
                            getImageUrl(
                                item.file_path
                            );

                        return (
                            <div
                                className="media-card"
                                key={
                                    item.file_path
                                }
                            >

                                {/* IMAGE */}

                                <div className="media-image">

                                    <img
                                        src={
                                            imageUrl
                                        }
                                        alt={
                                            item.alt_text ||
                                            item.title ||
                                            item.original_name ||
                                            item.file_name
                                        }
                                        loading="lazy"
                                        onError={(
                                            event
                                        ) => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>

                                {/* INFO */}

                                <div className="media-info">

                                    <strong
                                        title={
                                            item.title ||
                                            item.original_name
                                        }
                                    >
                                        {item.title ||
                                            item.original_name ||
                                            item.file_name}
                                    </strong>

                                    <small>
                                        📁{" "}
                                        {
                                            item.folder
                                        }
                                    </small>

                                    <small
                                        title={
                                            item.original_name
                                        }
                                    >
                                        {
                                            item.original_name
                                        }
                                    </small>

                                    {item.file_size && (
                                        <small>
                                            {formatFileSize(
                                                item.file_size
                                            )}
                                        </small>
                                    )}

                                </div>

                                {/* ACTIONS */}

                                <div className="media-actions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyUrl(
                                                item.file_path
                                            )
                                        }
                                    >
                                        Copy URL
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                item.file_path
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        );
                    })
                )}

            </div>
        </div>
    );
}