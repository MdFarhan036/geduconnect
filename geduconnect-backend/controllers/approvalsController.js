import db from "../config/db.js";

/* ================= ADMIN ================= */

export const getApprovalsAdmin = async(req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM approvals ORDER BY id DESC"
    );
    res.json(rows);
};

export const createApproval = async(req, res) => {
    const { name } = req.body;

    await db.query(
        "INSERT INTO approvals (name) VALUES (?)", [name]
    );

    res.json({ message: "Approval created" });
};

export const updateApproval = async(req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    await db.query(
        "UPDATE approvals SET name=? WHERE id=?", [name, id]
    );

    res.json({ message: "Updated successfully" });
};

export const deleteApproval = async(req, res) => {
    const { id } = req.params;

    await db.query(
        "DELETE FROM approvals WHERE id=?", [id]
    );

    res.json({ message: "Deleted successfully" });
};

/* ================= PUBLIC ================= */

export const getApprovalsPublic = async(req, res) => {
    const [rows] = await db.query(
        "SELECT id,name FROM approvals WHERE is_active=1"
    );
    res.json(rows);
};