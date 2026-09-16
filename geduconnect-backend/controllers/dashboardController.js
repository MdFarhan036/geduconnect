import pool from "../config/db.js";

export const getDashboardStats = async(req, res) => {
    try {
        const [
            [total]
        ] = await pool.query(
            "SELECT COUNT(*) AS count FROM enquiries"
        );

        const [
            [today]
        ] = await pool.query(
            "SELECT COUNT(*) AS count FROM enquiries WHERE DATE(created_at)=CURDATE()"
        );

        const [statusCounts] = await pool.query(
            `SELECT status, COUNT(*) AS count
       FROM enquiries
       GROUP BY status`
        );

        const [last7Days] = await pool.query(
            `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM enquiries
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at)`
        );

        res.json({
            total: total.count,
            today: today.count,
            status: statusCounts,
            last7Days
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Dashboard stats failed" });
    }
};