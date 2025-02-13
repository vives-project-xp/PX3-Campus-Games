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

const ShowAllUsers = async () => {
    try {
        // Fetch all users from the database
        const [users] = await pool.query('SELECT name, opleiding, id, password FROM users');
        return users;
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
};


export {
    addUser,
    ShowAllUsers,
}
