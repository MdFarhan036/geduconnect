import pool from "../config/db.js";

/* ADMIN */
export const getSettingsAdmin = async(req, res) => {
    const [rows] = await pool.query("SELECT * FROM site_settings");
    res.json(rows);
};

export const updateSetting = async(req, res) => {
    const { setting_value } = req.body;

    await pool.query(
        "UPDATE site_settings SET setting_value=? WHERE setting_key=?", [setting_value, req.params.key]
    );

    res.json({ message: "Updated" });
};

/* PUBLIC */
export const getSettingsPublic = async(req, res) => {
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM site_settings");

    const obj = {};
    rows.forEach(r => (obj[r.setting_key] = r.setting_value));

    res.json(obj);
};