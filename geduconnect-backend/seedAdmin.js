import bcrypt from "bcrypt";
import pool from "./config/db.js";

const seedAdmin = async() => {
    try {
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        await pool.query(
            "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)", ["Super Admin", "admin@geduconnect.com", hashedPassword, "admin"]
        );

        console.log("✅ Admin seeded");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding admin failed:", err);
        process.exit(1);
    }
};

seedAdmin();