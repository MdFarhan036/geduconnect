import db from "../config/db.js";

/* ADMIN */

export const getRankingsAdmin = async(req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM rankings ORDER BY id DESC"
    );
    res.json(rows);
};

export const createRanking = async(req, res) => {
    const { name } = req.body;

    await db.query(
        "INSERT INTO rankings (name) VALUES (?)", [name]
    );

    res.json({ message: "Ranking created" });
};

export const updateRanking = async(req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    await db.query(
        "UPDATE rankings SET name=? WHERE id=?", [name, id]
    );

    res.json({ message: "Updated successfully" });
};

export const deleteRanking = async(req, res) => {
    const { id } = req.params;

    await db.query(
        "DELETE FROM rankings WHERE id=?", [id]
    );

    res.json({ message: "Deleted successfully" });
};

/* PUBLIC */

export const getRankingsPublic = async(req, res) => {
    const [rows] = await db.query(
        "SELECT id,name FROM rankings WHERE is_active=1"
    );
    res.json(rows);
};