import bcrypt from 'bcrypt';
import db from '../db.js';
import { registerSchema } from '../middleware/validation.js';
import jwt from 'jsonwebtoken';

const getAllUsers = async (req, res) => {
    try {
        const [result] = await db.execute('SELECT id, userName, opleiding, created_at FROM users');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserBy = async (req, res) => {
    try {
        const { param, value } = req.params; // Get column name and value from URL params
        
        // Validate the column name to prevent SQL injection
        const allowedParams = ['id', 'userName', 'opleiding']; // Define allowed columns
        if (!allowedParams.includes(param)) {
            return res.status(400).json({ error: "Invalid search parameter" });
        }

        // Query database dynamically
        const query = `SELECT id, userName, opleiding, created_at FROM users WHERE ${param} = ?`;
        const [result] = await db.execute(query, [value]);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Haal de oude gebruikersgegevens op (zonder SELECT *)
        const [oldUser] = await db.execute('SELECT id, userName, opleiding FROM users WHERE id = ?', [id]);
        
        // Controleer of de gebruiker bestaat
        if (oldUser.length === 0) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        // Verwijder de gebruiker
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

        // Stuur de verwijderde gebruikersinformatie terug
        res.json({ message: 'Account verwijderd', oldUser: oldUser[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { username, opleiding, password } = req.body;

        // Check of de user al bestaat
        const [existingUser] = await db.execute('SELECT id FROM users WHERE userName = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Gebruiker bestaat al' });
        }

        // Hash het wachtwoord
        const hashedPassword = await bcrypt.hash(password, 10);

        // Voeg gebruiker toe aan database
        const [result] = await db.execute(
            'INSERT INTO users (userName, opleiding, userPassword) VALUES (?, ?, ?)',
            [username, opleiding, hashedPassword]
        );

        res.status(201).json({ message: 'Account aangemaakt', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Zoek de gebruiker
        const [users] = await db.execute('SELECT id, userPassword FROM users WHERE userName = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Ongeldige gebruikersnaam' });
        }

        const user = users[0];

        // Check wachtwoord
        const validPassword = await bcrypt.compare(password, user.userPassword);
        if (!validPassword) return res.status(401).json({ error: 'Ongeldig wachtwoord' });

        // Genereer een token
        const token = jwt.sign(
            { userId: user.id, username }, 
            process.env.JWT_SECRET, // Zorg ervoor dat je een geheime sleutel hebt in je .env bestand (your_secret_key)
            { expiresIn: '24h' } // Token verloopt in 24 uur
        );
        res.json({ message: 'Login succesvol', token, userId: user.id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getAllUsers,
    getUserBy,
    deleteUser,
    registerUser,
    loginUser,
};
