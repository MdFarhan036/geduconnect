import {
    useEffect,
    useState,
} from "react";

import api from "../api.js";


const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";

const BASE_URL =
    API_BASE.replace("/api", "");

export default function AdminConsultantNetwork() {

    /* =========================================================
       STATES
    ========================================================= */

    const [settings, setSettings] =
        useState({
            hero_badge: "",
            hero_title: "",
            hero_subtitle: "",

            years_experience: 0,
            active_consultants: 0,
            admissions_managed: 0,

            about_title: "",
            about_description_1: "",
            about_description_2: "",

            about_image: "",

            seo_title: "",
            seo_description: "",
            seo_keywords: "",
            seo_og_image: "",
        });
    const [allCities,
        setAllCities] =
        useState([]);

    const [citySearch,
        setCitySearch] =
        useState("");
    const [aboutImageFile,
        setAboutImageFile] =
        useState(null);

    const [features, setFeatures] =
        useState([]);

    const [cities, setCities] =
        useState([]);
    const [featureForm, setFeatureForm] =
        useState({
            icon: "",
            title: "",
            description: "",
            sort_order: 0,
            is_active: 1,
        });

    const [cityForm, setCityForm] =
        useState({
            name: "",
            state_name: "",
            lat: "",
            lng: "",
            consultant_count: 0,
            sort_order: 0,
            is_active: 1,
        });

    const [editingFeatureId,
        setEditingFeatureId] =
        useState(null);

    const [editingCityId,
        setEditingCityId] =
        useState(null);
    /* =========================================================
       FETCH DATA
    ========================================================= */

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData = async () => {

        try {

            /* ADMIN DATA */

            const res = await api.get(
                "/consultant-network/admin"
            );

            /* INDIA CITIES JSON */

            const citiesRes =
                await api.get(
                    "/location/india-cities"
                );

            /* SETTINGS */

            setSettings({
                hero_badge: "",
                hero_title: "",
                hero_subtitle: "",

                years_experience: 0,
                active_consultants: 0,
                admissions_managed: 0,

                about_title: "",
                about_description_1: "",
                about_description_2: "",

                about_image: "",

                seo_title: "",
                seo_description: "",
                seo_keywords: "",
                seo_og_image: "",

                ...(res.data.settings || {}),
            });

            /* FEATURES */

            setFeatures(
                res.data.features || []
            );

            /* CONSULTANT NETWORK CITIES */

            setCities(
                res.data.cities || []
            );

            /* ALL INDIA CITIES JSON */

            setAllCities(
                citiesRes.data || []
            );

        } catch (err) {

            console.error(
                "Fetch failed:",
                err
            );
        }
    };
    /* =========================================================
       SETTINGS
    ========================================================= */

    const handleSettingsChange = (
        e
    ) => {

        setSettings({
            ...settings,
            [e.target.name]:
                e.target.value,
        });
    };

    const saveSettings =
        async () => {

            try {

                const formData =
                    new FormData();

                Object.keys(settings)
                    .forEach((key) => {

                        formData.append(
                            key,
                            settings[key]
                        );
                    });

                if (aboutImageFile) {

                    formData.append(
                        "about_image",
                        aboutImageFile
                    );
                }

                await api.put(
                    "/consultant-network/settings",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                alert(
                    "Settings updated"
                );

                fetchData();

            } catch (err) {

                console.error(err);

                alert(
                    "Failed to update settings"
                );
            }
        };

    /* =========================================================
       FEATURES
    ========================================================= */

    const handleFeatureChange = (
        e
    ) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFeatureForm({
            ...featureForm,
            [name]:
                type === "checkbox"
                    ? checked
                        ? 1
                        : 0
                    : value,
        });
    };

    const saveFeature =
        async () => {

            try {

                if (
                    editingFeatureId
                ) {

                    await api.put(
                        `/consultant-network/features/${editingFeatureId}`,
                        featureForm
                    );

                } else {

                    await api.post(
                        "/consultant-network/features",
                        featureForm
                    );
                }

                resetFeatureForm();

                fetchData();

            } catch (err) {

                console.error(err);
            }
        };

    const editFeature = (
        item
    ) => {

        setEditingFeatureId(
            item.id
        );

        setFeatureForm({
            icon:
                item.icon || "",
            title:
                item.title || "",
            description:
                item.description || "",
            sort_order:
                item.sort_order || 0,
            is_active:
                item.is_active ?? 1,
        });
    };

    const deleteFeature =
        async (id) => {

            if (
                !window.confirm(
                    "Delete feature?"
                )
            ) {
                return;
            }

            try {

                await api.delete(
                    `/consultant-network/features/${id}`
                );

                fetchData();

            } catch (err) {

                console.error(err);
            }
        };

    const resetFeatureForm =
        () => {

            setEditingFeatureId(
                null
            );

            setFeatureForm({
                icon: "",
                title: "",
                description: "",
                sort_order: 0,
                is_active: 1,
            });
        };

    /* =========================================================
       CITIES
    ========================================================= */

    const handleCityChange = async (
        e
    ) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        const updatedValue =
            type === "checkbox"
                ? checked
                    ? 1
                    : 0
                : value;

        setCityForm((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));

        /* AUTO FETCH LAT/LNG */


    };
    const saveCity =
        async () => {

            try {

                if (
                    editingCityId
                ) {

                    await api.put(
                        `/consultant-network/cities/${editingCityId}`,
                        cityForm
                    );

                } else {

                    await api.post(
                        "/consultant-network/cities",
                        cityForm
                    );
                }

                resetCityForm();

                fetchData();

            } catch (err) {

                console.error(err);
            }
        };

    const editCity = (
        item
    ) => {

        setEditingCityId(
            item.id
        );

        setCityForm({
            name:
                item.name || "",
            state_name:
                item.state_name || "",
            lat:
                item.lat || "",
            lng:
                item.lng || "",
            consultant_count:
                item.consultant_count || 0,
            sort_order:
                item.sort_order || 0,
            is_active:
                item.is_active ?? 1,
        });
    };
    const deleteCity =
        async (id) => {

            if (
                !window.confirm(
                    "Delete city?"
                )
            ) {
                return;
            }

            try {

                await api.delete(
                    `/consultant-network/cities/${id}`
                );

                fetchData();

            } catch (err) {

                console.error(err);
            }
        };

    /* =========================================================
       TOGGLE CITY STATUS
    ========================================================= */

    const toggleCityStatus =
        async (item) => {

            try {

                await api.put(
                    `/consultant-network/cities/${item.id}`,
                    {
                        ...item,

                        is_active:
                            item.is_active
                                ? 0
                                : 1,
                    }
                );

                fetchData();

            } catch (err) {

                console.error(
                    "Toggle failed:",
                    err
                );
            }
        };

 
    const resetCityForm =
        () => {

            setEditingCityId(
                null
            );

            setCityForm({
                name: "",
                state_name: "",
                lat: "",
                lng: "",
                consultant_count: 0,
                sort_order: 0,
                is_active: 1,
            });
        };
    return (

        <div className="city-tools">

            <a
                href="/all_india_cities_consultant_network.json"
                download
                className="import-btn"
            >
                Download Sample JSON
            </a>


            {/* =========================================================
          SETTINGS
      ========================================================= */}

            <div className="admin-card">

                <h2>
                    Hero, About & SEO Settings
                </h2>

                <div className="admin-grid">

                    <input
                        name="hero_badge"
                        placeholder="Hero Badge"
                        value={
                            settings.hero_badge
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <input
                        name="hero_title"
                        placeholder="Hero Title"
                        value={
                            settings.hero_title
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <textarea
                        name="hero_subtitle"
                        placeholder="Hero Subtitle"
                        value={
                            settings.hero_subtitle
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <input
                        type="number"
                        name="years_experience"
                        placeholder="Years Experience"
                        value={
                            settings.years_experience
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <input
                        type="number"
                        name="active_consultants"
                        placeholder="Active Consultants"
                        value={
                            settings.active_consultants
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <input
                        type="number"
                        name="admissions_managed"
                        placeholder="Admissions Managed"
                        value={
                            settings.admissions_managed
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <input
                        name="about_title"
                        placeholder="About Title"
                        value={
                            settings.about_title
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <textarea
                        name="about_description_1"
                        placeholder="About Description 1"
                        value={
                            settings.about_description_1
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <textarea
                        name="about_description_2"
                        placeholder="About Description 2"
                        value={
                            settings.about_description_2
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    {/* IMAGE UPLOAD */}

                    <div className="image-upload-field">

                        <label>
                            About Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setAboutImageFile(
                                    e.target.files[0]
                                )
                            }
                        />

                        {settings.about_image && (

                            <img
                                src={`${BASE_URL}${settings.about_image}`}
                                alt="About"
                                className="preview-image"
                            />

                        )}

                    </div>

                    {/* SEO */}

                    <input
                        name="seo_title"
                        placeholder="SEO Title"
                        value={
                            settings.seo_title
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <textarea
                        name="seo_description"
                        placeholder="SEO Description"
                        value={
                            settings.seo_description
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <textarea
                        name="seo_keywords"
                        placeholder="SEO Keywords"
                        value={
                            settings.seo_keywords
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                    <input
                        name="seo_og_image"
                        placeholder="SEO OG Image URL"
                        value={
                            settings.seo_og_image
                        }
                        onChange={
                            handleSettingsChange
                        }
                    />

                </div>

                <button
                    className="save-btn"
                    onClick={saveSettings}
                >
                    Save Settings
                </button>

            </div>

            {/* =========================================================
          FEATURES
      ========================================================= */}


            <div className="admin-card">

                <h2>
                    About Features
                </h2>

                <div className="admin-grid">

                    {/* ICON */}

                    <div className="form-group">

                        <label>
                            Feature Icon
                        </label>

                        <select
                            name="icon"
                            value={
                                featureForm.icon
                            }
                            onChange={
                                handleFeatureChange
                            }
                        >

                            <option value="">
                                Select Icon
                            </option>

                            <option value="Users">
                                Users
                            </option>

                            <option value="GraduationCap">
                                GraduationCap
                            </option>

                            <option value="Building2">
                                Building2
                            </option>

                            <option value="MapPinned">
                                MapPinned
                            </option>

                            <option value="ShieldCheck">
                                ShieldCheck
                            </option>

                            <option value="Briefcase">
                                Briefcase
                            </option>

                            <option value="Globe">
                                Globe
                            </option>

                            <option value="BookOpen">
                                BookOpen
                            </option>

                            <option value="Handshake">
                                Handshake
                            </option>

                            <option value="Target">
                                Target
                            </option>

                            <option value="Award">
                                Award
                            </option>

                            <option value="Network">
                                Network
                            </option>

                            <option value="BadgeCheck">
                                BadgeCheck
                            </option>

                            <option value="ChartNoAxesCombined">
                                ChartNoAxesCombined
                            </option>

                        </select>

                    </div>

                    {/* TITLE */}

                    <div className="form-group">

                        <label>
                            Feature Title
                        </label>

                        <input
                            name="title"
                            placeholder="Feature Title"
                            value={
                                featureForm.title
                            }
                            onChange={
                                handleFeatureChange
                            }
                        />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Feature Description"
                            value={
                                featureForm.description
                            }
                            onChange={
                                handleFeatureChange
                            }
                        />

                    </div>

                    {/* SORT ORDER */}

                    <div className="form-group">

                        <label>
                            Sort Order
                        </label>

                        <input
                            type="number"
                            name="sort_order"
                            placeholder="Sort Order"
                            value={
                                featureForm.sort_order
                            }
                            onChange={
                                handleFeatureChange
                            }
                        />

                    </div>

                    {/* STATUS */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <label className="checkbox-row">

                            <input
                                type="checkbox"
                                name="is_active"
                                checked={
                                    featureForm.is_active === 1
                                }
                                onChange={
                                    handleFeatureChange
                                }
                            />

                            Active

                        </label>

                    </div>

                </div>

                {/* SAVE BUTTON */}

                <button
                    className="save-btn"
                    onClick={saveFeature}
                >
                    {editingFeatureId
                        ? "Update Feature"
                        : "Add Feature"}
                </button>

                {/* FEATURES TABLE */}

                <div className="table-wrapper">

                    <table className="admin-table">

                        <thead>

                            <tr>

                                <th>
                                    Icon
                                </th>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Description
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

                            {features.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="empty-cell"
                                    >
                                        No features found
                                    </td>

                                </tr>

                            ) : (

                                features.map(
                                    (item) => (

                                        <tr key={item.id}>

                                            {/* ICON */}

                                            <td>
                                                {item.icon}
                                            </td>

                                            {/* TITLE */}

                                            <td>
                                                {item.title}
                                            </td>

                                            {/* DESCRIPTION */}

                                            <td className="desc-cell">
                                                {
                                                    item.description
                                                }
                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`status-badge ${item.is_active
                                                        ? "active"
                                                        : "inactive"
                                                        }`}
                                                >
                                                    {item.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            editFeature(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteFeature(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
            {/* =========================================================
    CITIES
========================================================= */}

            <div className="admin-grid">

                {/* CITY SELECT */}

                <div className="form-group">

                    <label>
                        Select City
                    </label>

                    <select
                        value={cityForm.name}
                        onChange={(e) => {

                            const selected =
                                allCities.find(
                                    (city) =>
                                        city.name ===
                                        e.target.value
                                );

                            if (!selected) return;

                            setCityForm({
                                ...cityForm,

                                name:
                                    selected.name,

                                state_name:
                                    selected.state_name,

                                lat:
                                    selected.lat,

                                lng:
                                    selected.lng,
                            });
                        }}
                    >

                        <option value="">
                            Select City
                        </option>

                        {allCities
                            .filter((city) =>
                                city.name
                                    .toLowerCase()
                                    .includes(
                                        citySearch.toLowerCase()
                                    )
                            )
                            .map((city) => (

                                <option
                                    key={`${city.name}-${city.state_name}`}
                                    value={city.name}
                                >

                                    {city.name}
                                    {" - "}
                                    {city.state_name}

                                </option>
                            ))}

                    </select>

                </div>

                {/* STATE */}

                <div className="form-group">

                    <label>
                        State Name
                    </label>

                    <input
                        value={cityForm.state_name}
                        readOnly
                    />

                </div>

                {/* LATITUDE */}

                <div className="form-group">

                    <label>
                        Latitude
                    </label>

                    <input
                        value={cityForm.lat}
                        readOnly
                    />

                </div>

                {/* LONGITUDE */}

                <div className="form-group">

                    <label>
                        Longitude
                    </label>

                    <input
                        value={cityForm.lng}
                        readOnly
                    />

                </div>

                {/* CONSULTANTS */}

                <div className="form-group">

                    <label>
                        Consultant Count
                    </label>

                    <input
                        type="number"
                        name="consultant_count"
                        placeholder="50"
                        value={
                            cityForm.consultant_count
                        }
                        onChange={handleCityChange}
                    />

                </div>

                {/* SORT ORDER */}

                <div className="form-group">

                    <label>
                        Sort Order
                    </label>

                    <input
                        type="number"
                        name="sort_order"
                        placeholder="0"
                        value={
                            cityForm.sort_order
                        }
                        onChange={handleCityChange}
                    />

                </div>

                {/* STATUS */}

                <div className="form-group">

                    <label>
                        Status
                    </label>

                    <label className="checkbox-row">

                        <input
                            type="checkbox"
                            name="is_active"
                            checked={
                                cityForm.is_active === 1
                            }
                            onChange={handleCityChange}
                        />

                        Active

                    </label>

                </div>

            </div>

            {/* ACTIONS */}

            <div className="form-actions">

                <button
                    className="save-btn"
                    onClick={saveCity}
                >
                    {editingCityId
                        ? "Update City"
                        : "Add City"}
                </button>

            </div>

            {/* TABLE */}

            <div className="table-wrapper">

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>
                                City
                            </th>

                            <th>
                                State
                            </th>

                            <th>
                                Coordinates
                            </th>

                            <th>
                                Consultants
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

                        {cities.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-cell"
                                >
                                    No cities added yet
                                </td>

                            </tr>

                        ) : (

                            cities
                                .filter((item) =>
                                    item.name
                                        .toLowerCase()
                                        .includes(
                                            citySearch.toLowerCase()
                                        )
                                )
                                .map((item) => (

                                    <tr key={item.id}>

                                        {/* CITY */}

                                        <td>

                                            <div className="city-name-cell">

                                                <strong>
                                                    {item.name}
                                                </strong>

                                            </div>

                                        </td>

                                        {/* STATE */}

                                        <td>
                                            {item.state_name}
                                        </td>

                                        {/* COORDINATES */}

                                        <td>

                                            <div className="coords-cell">

                                                <span>
                                                    Lat:
                                                    {" "}
                                                    {item.lat}
                                                </span>

                                                <span>
                                                    Lng:
                                                    {" "}
                                                    {item.lng}
                                                </span>

                                            </div>

                                        </td>

                                        {/* CONSULTANTS */}

                                        <td>

                                            <span className="consultant-badge">

                                                {
                                                    item.consultant_count
                                                }

                                            </span>

                                        </td>

                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`status-badge ${item.is_active
                                                    ? "active"
                                                    : "inactive"
                                                    }`}
                                            >
                                                {item.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </td>

                                        {/* ACTIONS */}

                                        <td>
                                            <div className="action-buttons">

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        editCity(item)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className={
                                                        item.is_active
                                                            ? "deactivate-btn"
                                                            : "activate-btn"
                                                    }
                                                    onClick={() =>
                                                        toggleCityStatus(item)
                                                    }
                                                >
                                                    {item.is_active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteCity(item.id)
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