import db from "../db.js";
/* ---------------- GET BY PROGRAM ---------------- */
export const getSpecializationsByProgram = async(req, res) => {
    try {
        const { programId } = req.params;

        const [rows] = await db.query(
            `SELECT id, specialization 
       FROM program_specializations 
       WHERE program_id = ?
       ORDER BY specialization`, [programId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch specializations" });
    }
};

/* ---------------- GET SINGLE ---------------- */
export const getSingleSpecialization = async(req, res) => {
    try {
        const { id } = req.params;

        const [
            [row]
        ] = await db.query(
            `SELECT id, program_id, specialization
       FROM program_specializations
       WHERE id = ?`, [id]
        );

        if (!row) {
            return res.status(404).json({ message: "Specialization not found" });
        }

        res.json(row);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch specialization" });
    }
};

/* ---------------- CREATE ---------------- */
export const createSpecialization = async(req, res) => {
    try {
        const { program_id, specialization } = req.body;

        if (!program_id || !specialization) {
            return res.status(400).json({
                message: "Program and specialization are required",
            });
        }

        /* Ensure program exists */
        const [
            [program]
        ] = await db.query(
            "SELECT id FROM university_programs WHERE id = ?", [program_id]
        );

        if (!program) {
            return res.status(400).json({
                message: "Program does not exist. Create program first.",
            });
        }

        await db.query(
            `INSERT INTO program_specializations (program_id, specialization)
       VALUES (?, ?)`, [program_id, specialization]
        );

        res.json({ message: "Specialization added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add specialization" });
    }
};

/* ---------------- UPDATE ---------------- */
export const updateSpecialization = async(req, res) => {
    try {
        const { id } = req.params;
        const { program_id, specialization } = req.body;

        if (!program_id || !specialization) {
            return res.status(400).json({
                message: "Program and specialization are required",
            });
        }

        await db.query(
            `UPDATE program_specializations
       SET program_id = ?, specialization = ?
       WHERE id = ?`, [program_id, specialization, id]
        );

        res.json({ message: "Specialization updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update specialization" });
    }
};

/* ---------------- DELETE ---------------- */
export const deleteSpecialization = async(req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "DELETE FROM program_specializations WHERE id = ?", [id]
        );

        res.json({ message: "Specialization deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete specialization" });
    }
};

export const getAllSpecializations = async(req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT 
        ps.id,
        ps.program_id,
        ps.specialization
      FROM program_specializations ps
      ORDER BY ps.specialization
    `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch specializations",
        });
    }
};
export const getPublicSpecializations = async(req, res) => {
    const { programId } = req.params;

    const [rows] = await db.query(
        `SELECT id, specialization
     FROM program_specializations
     WHERE program_id = ?
     ORDER BY specialization`, [programId]
    );

    res.json(rows);
};