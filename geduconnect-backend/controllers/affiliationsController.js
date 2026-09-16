import db from "../config/db.js";

/* ADMIN */

export const getAffiliationsAdmin = async(req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM affiliations ORDER BY id DESC"
    );
    res.json(rows);
};

export const createAffiliation = async(req, res) => {
    const { name } = req.body;

    await db.query(
        "INSERT INTO affiliations (name) VALUES (?)", [name]
    );

    res.json({ message: "Affiliation created" });
};

export const updateAffiliation = async(req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    await db.query(
        "UPDATE affiliations SET name=? WHERE id=?", [name, id]
    );

    res.json({ message: "Updated successfully" });
};

export const deleteAffiliation = async(req, res) => {
    const { id } = req.params;

    await db.query(
        "DELETE FROM affiliations WHERE id=?", [id]
    );

    res.json({ message: "Deleted successfully" });
};

/* PUBLIC */

export const getAffiliationsPublic = async(req, res) => {
    const [rows] = await db.query(
        "SELECT id,name FROM affiliations WHERE is_active=1"
    );
    res.json(rows);
};