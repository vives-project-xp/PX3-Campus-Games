import bcrypt from 'bcrypt';
import db from '../db.js';
import { registerSchema } from '../middleware/validation.js';

const addUser = async (req, res) => {
    try {
        // ✅ Validate input
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { username, email, password } = req.body;

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert user into DB
        const [result] = await pool.query(
            'INSERT INTO users (name, opleiding, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [result] = await db.execute('SELECT id, name, opleiding, created_at FROM users');
        res.json(result);
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserBy = async (req, res) => {
    try {
        const { param, value } = req.params; // Get column name and value from URL params
        
        // Validate the column name to prevent SQL injection
        const allowedParams = ['id', 'name', 'opleiding']; // Define allowed columns
        if (!allowedParams.includes(param)) {
            return res.status(400).json({ error: "Invalid search parameter" });
        }

        // Query database dynamically
        const query = `SELECT id, name, opleiding, created_at FROM users WHERE ${param} = ?`;
        const [result] = await db.execute(query, [value]);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        let oldUser = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
        // show the deleted oldUser info thats deleted
        res.json({ message: 'User deleted', oldUser: oldUser[0] });
        } catch (error) {
            res.status(500).json({ error: error.message });
            }
};



export {
    addUser,
    getAllUsers,
    getUserBy,
    deleteUser,
}
