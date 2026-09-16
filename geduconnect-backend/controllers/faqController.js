import pool from "../config/db.js";

/* ADMIN */
export const getFaqsAdmin = async(req, res) => {
    const [rows] = await pool.query(
        "SELECT * FROM faqs ORDER BY sort_order"
    );
    res.json(rows);
};

export const saveFaq = async(req, res) => {
    const { question, answer, is_active, sort_order } = req.body;

    await pool.query(
        `UPDATE faqs SET
      question=?, answer=?, is_active=?, sort_order=?
     WHERE id=?`, [question, answer, is_active, sort_order, req.params.id]
    );

    res.json({ message: "FAQ updated" });
};

export const addFaq = async(req, res) => {
    const { question, answer, sort_order } = req.body;

    await pool.query(
        `INSERT INTO faqs (question, answer, sort_order)
     VALUES (?, ?, ?)`, [question, answer, sort_order]
    );

    res.json({ message: "FAQ added" });
};

export const deleteFaq = async(req, res) => {
    await pool.query("DELETE FROM faqs WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
};

/* PUBLIC */
export const getFaqsPublic = async(req, res) => {
    const [rows] = await pool.query(
        `SELECT question, answer
     FROM faqs
     WHERE is_active=1
     ORDER BY sort_order`
    );
    res.json(rows);
};