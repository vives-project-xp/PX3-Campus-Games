import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const DB_DTBS = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

// Create a connection pool to the database
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_DTBS,
    port: DB_PORT,
    waitForConnections: true, 
    connectionLimit: 10 // Limit the number of connections to the database
});

// ✅ Test the database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Successfully connected to the database.");
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error.message);
    }
})();

export default pool;  // Export the pool for use in other modules
