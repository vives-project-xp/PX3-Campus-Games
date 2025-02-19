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



// 🏆 Top 10 spelers van deze week
 const getWeeklyLeaderboard = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.name, s.score, s.week_number, s.year
            FROM scores_weekly s
            JOIN users u ON s.user_id = u.id
            WHERE s.year = YEAR(CURDATE()) AND s.week_number = WEEK(CURDATE())
            ORDER BY s.score DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (error) {
        console.error("Fout bij ophalen van de weekly leaderboard:", error);
        res.status(500).json({ error: "Kan leaderboard niet ophalen" });
    }
};

// 🏅 Top 10 spelers aller tijden
 const getTotalLeaderboard = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.name, s.total_score
            FROM scores_total s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.total_score DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (error) {
        console.error("Fout bij ophalen van de total leaderboard:", error);
        res.status(500).json({ error: "Kan leaderboard niet ophalen" });
    }
};

// 🎓 Top opleidingen op basis van score
 const getStudyLeaderboard = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT opleiding, total_score
            FROM scores_study
            ORDER BY total_score DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (error) {
        console.error("Fout bij ophalen van de study leaderboard:", error);
        res.status(500).json({ error: "Kan leaderboard niet ophalen" });
    }
};

// 🔍 Persoonlijke ranking van een speler
 const getUserRanking = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT id, name, total_score,
                (SELECT COUNT(*) + 1 
                 FROM scores_total 
                 WHERE total_score > (SELECT total_score FROM scores_total WHERE user_id = ?) 
                ) AS ranking
            FROM users
            WHERE id = ?
        `, [userId, userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Gebruiker niet gevonden" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Fout bij ophalen van user ranking:", error);
        res.status(500).json({ error: "Kan ranking niet ophalen" });
    }
};


export {
    addUser,
    getAllUsers,
    getUserBy,
    deleteUser,
    getWeeklyLeaderboard,
    getStudyLeaderboard,
    getTotalLeaderboard,
    getUserRanking,
}
