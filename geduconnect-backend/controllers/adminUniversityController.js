import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

/* LIST */
export const getUniversitiesAdmin = async(req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM universities ORDER BY university"
    );

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    rows.forEach((u) => {
        if (u.univimg && !u.univimg.startsWith("http")) {
            u.univimg = `${baseUrl}${u.univimg}`;
        }
    });

    res.json(rows);
};


/* CREATE */
export const createUniversity = async(req, res) => {
    const {
        university,
        state,
        city,
        mode,
        address,
        approvals,
        usps,
        regfees,
    } = req.body;

    const univimg = req.file ? `/uploads/${req.file.filename}` : null;

    await db.query(
        `INSERT INTO universities
     (university, state, city, mode, address, approvals, usps, regfees, univimg)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            university,
            state,
            city,
            mode,
            address,
            approvals,
            usps,
            regfees,
            univimg,
        ]
    );

    res.json({ message: "University created" });
};


export const updateUniversity = async(req, res) => {
    try {
        const { id } = req.params;

        const univimg = req.file ? `/uploads/${req.file.filename}` : null;

        const fields = [];
        const values = [];

        const add = (key, value) => {
            if (value !== undefined) {
                fields.push(`${key}=?`);
                values.push(value);
            }
        };

        // 🔹 Normalize university name
        const universityName = req.body.university && req.body.university.trim();

        if (universityName) {
            // 🔴 DUPLICATE CHECK (excluding same ID)
            const [existing] = await db.query(
                `SELECT id FROM universities WHERE university = ? AND id != ?`, [universityName, id]
            );

            if (existing.length > 0) {
                return res.status(409).json({
                    message: "University name already exists",
                });
            }

            add("university", universityName);
        }

        add("state", req.body.state);
        add("city", req.body.city);
        add("mode", req.body.mode);
        add("address", req.body.address);
        add("approvals", req.body.approvals);
        add("usps", req.body.usps);
        add("regfees", req.body.regfees);

        if (univimg) add("univimg", univimg);

        if (!fields.length) {
            return res.status(400).json({ message: "No fields to update" });
        }

        values.push(id);

        await db.query(
            `UPDATE universities SET ${fields.join(", ")} WHERE id=?`,
            values
        );

        res.json({ message: "University updated" });
    } catch (err) {
        console.error("❌ updateUniversity error:", err);

        // Safety net
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "University name already exists",
            });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};


/* DELETE */
export const deleteUniversity = async(req, res) => {
    const { id } = req.params;

    const [
        [uni]
    ] = await db.query(
        "SELECT univimg FROM universities WHERE id=?", [id]
    );

    if (!uni) {
        return res.status(404).json({ message: "University not found" });
    }

    if (uni.univimg) {
        const imgPath = path.join(process.cwd(), uni.univimg);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await db.query("DELETE FROM universities WHERE id=?", [id]);

    res.json({ message: "University deleted" });
};
export const getPublicUniversities = async(req, res) => {
    const [rows] = await db.query(
        `SELECT id, university, state, city, mode, approvals, usps, regfees, univimg
     FROM universities
     ORDER BY university`
    );

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    rows.forEach((u) => {
        if (u.univimg) u.univimg = `${baseUrl}${u.univimg}`;
    });

    res.json(rows);
};