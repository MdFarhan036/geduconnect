import db from "../db.js";
export const addProgramFee = async(req, res) => {
    try {
        const { program_id, specialization_id, semname, semWise } = req.body;

        if (!program_id || !specialization_id || !semname || !semWise) {
            return res.status(400).json({
                message: "program_id, specialization_id, semname and semWise are required",
            });
        }

        // Ensure specialization belongs to program
        const [
            [spec]
        ] = await db.query(
            `SELECT id FROM program_specializations 
       WHERE id = ? AND program_id = ?`, [specialization_id, program_id]
        );

        if (!spec) {
            return res.status(400).json({
                message: "Invalid specialization for selected program",
            });
        }

        await db.query(
            `INSERT INTO program_fee_details 
       (program_id, specialization_id, semname, semWise)
       VALUES (?, ?, ?, ?)`, [program_id, specialization_id, semname, semWise]
        );

        res.json({ message: "Specialization-wise fee added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add fee" });
    }
};
export const getAllProgramFees = async(req, res) => {
    try {
        const [rows] = await db.query(`
  SELECT id, specialization_id, semname, semWise
  FROM program_fee_details
  ORDER BY id DESC
`);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch fees" });
    }
};

/* ======================================================
   GET FEES BY PROGRAM
====================================================== */
export const getProgramFeesByProgram = async(req, res) => {
    try {
        const { programId } = req.params;

        const [rows] = await db.query(
            `SELECT id, program_id, specialization_id, semname, semWise
       FROM program_fee_details
       WHERE program_id = ?
       ORDER BY id`, [programId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch program fees" });
    }
};

/* ======================================================
   GET FEES BY SPECIALIZATION
====================================================== */
export const getFeesBySpecialization = async(req, res) => {
    try {
        const { specializationId } = req.params;

        const [rows] = await db.query(
            `SELECT id, program_id, specialization_id, semname, semWise
       FROM program_fee_details
       WHERE specialization_id = ?
       ORDER BY id`, [specializationId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch specialization fees" });
    }
};

/* ======================================================
   GET SINGLE FEE
====================================================== */
export const getSingleProgramFee = async(req, res) => {
    try {
        const { id } = req.params;

        const [
            [fee]
        ] = await db.query(
            `SELECT id, program_id, specialization_id, semname, semWise
       FROM program_fee_details
       WHERE id = ?`, [id]
        );

        if (!fee) {
            return res.status(404).json({ message: "Fee not found" });
        }

        res.json(fee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch fee" });
    }
};

/* ======================================================
   UPDATE FEE
====================================================== */
export const updateProgramFee = async(req, res) => {
    try {
        const { id } = req.params;
        const { program_id, specialization_id, semname, semWise } = req.body;

        if (!program_id || !specialization_id || !semname || !semWise) {
            return res.status(400).json({
                message: "program_id, specialization_id, semname and semWise are required",
            });
        }

        await db.query(
            `UPDATE program_fee_details
       SET program_id = ?, specialization_id = ?, semname = ?, semWise = ?
       WHERE id = ?`, [program_id, specialization_id, semname, semWise, id]
        );

        res.json({ message: "Fee updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update fee" });
    }
};

/* ======================================================
   DELETE FEE
====================================================== */
export const deleteProgramFee = async(req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM program_fee_details WHERE id = ?`, [id]);

        res.json({ message: "Fee deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete fee" });
    }
};
export const getPublicFees = async(req, res) => {
    const { specializationId } = req.params;

    const [rows] = await db.query(
        `SELECT semname, semWise
     FROM program_fee_details
     WHERE specialization_id = ?
     ORDER BY id`, [specializationId]
    );

    res.json(rows);
};
export const getPublicProgramsWithFees = async(req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT
        p.id AS program_id,
        p.name AS program_name,
        p.university_id,

        MIN(pf.semWise) AS yearly_fee
      FROM programs p
      LEFT JOIN program_specializations ps
        ON ps.program_id = p.id
      LEFT JOIN program_fee_details pf
        ON pf.specialization_id = ps.id
      GROUP BY p.id
    `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch program fees" });
    }
};