import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" }); // 🔥 FORCE LOAD

import mysql from "mysql2/promise";

console.log("DB USER =", process.env.DB_USER); // 🔥 DEBUG
console.log("DB PASS =", process.env.DB_PASSWORD ? "SET" : "NOT SET");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

export default pool;