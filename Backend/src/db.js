import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const DB_DTBS = process.env.DB_DATABASE;

// Create a connection pool to the database
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_DTBS,
});

connection.connect(error => {
    if (error) {
        res.status(503).send({ error: 'Unable to connect to database.'});
        return;
    } else {
        console.log("Successfully connected to the database.");
    }
});

export default pool;  // Export the pool for use in other modules

