import bcrypt from 'bcrypt';
import db from '../db.js';
import { registerSchema } from '../middleware/validation.js';

export const addUser = async (req, res) => {
    try {
        // ✅ Validate input
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { username, email, password } = req.body;

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert user into DB
        const [result] = await db.execute(
            'INSERT INTO users (name, opleiding, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
