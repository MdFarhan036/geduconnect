import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginAdmin = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const [rows] = await pool.query(
            "SELECT * FROM admins WHERE email = ?", [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin.id, role: admin.role },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        /* 🔐 SET HTTP-ONLY COOKIE */
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax", // ✅ works on localhost
            secure: false, // ✅ must be false for http
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.json({
            message: "Login successful",
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const me = async(req, res) => {
    res.json({
        user: req.user, // set by protect middleware
    });
};