import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || '',  // Zorg ervoor dat een lege string wordt gebruikt als er geen wachtwoord is
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

export default pool;

