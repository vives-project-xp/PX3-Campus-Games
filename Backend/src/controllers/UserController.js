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

 const addCardToUser = async (req, res) => {
    try {
        const { user_id, card_id, quantity } = req.body;

        // Controleer of de kaart al bestaat in het bezit van de speler
        const [existingCard] = await db.execute(
            'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
            [user_id, card_id]
        );

        if (existingCard.length > 0) {
            // Update de hoeveelheid als de kaart al bestaat
            await db.execute(
                'UPDATE user_cards SET quantity = quantity + ? WHERE user_id = ? AND card_id = ?',
                [quantity, user_id, card_id]
            );
        } else {
            // Voeg een nieuwe kaart toe aan de speler
            await db.execute(
                'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, ?)',
                [user_id, card_id, quantity]
            );
        }

        // Log de transactie
        await db.execute(
            'INSERT INTO card_transactions (user_id, card_id, transaction_type) VALUES (?, ?, ?)',
            [user_id, card_id, 'purchase']
        );

        res.json({ message: 'Kaart toegevoegd aan gebruiker' });
    } catch (error) {
        console.error('Fout bij toevoegen van kaart:', error);
        res.status(500).json({ error: 'Kan kaart niet toevoegen' });
    }
};

// 🔍 Haal alle kaarten van een speler op
 const getUserCards = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [cards] = await db.execute(
            `SELECT c.card_id, c.name, c.health, c.attack, c.defense, c.rarity, uc.quantity
            FROM user_cards uc
            JOIN Cards_dex c ON uc.card_id = c.card_id
            WHERE uc.user_id = ?`,
            [user_id]
        );

        res.json(cards);
    } catch (error) {
        console.error('Fout bij ophalen van kaarten:', error);
        res.status(500).json({ error: 'Kan kaarten niet ophalen' });
    }
};

// 🔄 Ruil een kaart met een andere speler
 const tradeCard = async (req, res) => {
    try {
        const { from_user, to_user, card_id, quantity } = req.body;

        // Controleer of from_user de kaart heeft
        const [userCard] = await db.execute(
            'SELECT quantity FROM user_cards WHERE user_id = ? AND card_id = ?',
            [from_user, card_id]
        );

        if (userCard.length === 0 || userCard[0].quantity < quantity) {
            return res.status(400).json({ error: 'Niet genoeg kaarten om te ruilen' });
        }

        // Verwijder kaart bij from_user
        await db.execute(
            'UPDATE user_cards SET quantity = quantity - ? WHERE user_id = ? AND card_id = ?',
            [quantity, from_user, card_id]
        );

        // Voeg kaart toe bij to_user
        await db.execute(
            'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
            [to_user, card_id, quantity, quantity]
        );

        // Log de transactie
        await db.execute(
            'INSERT INTO card_transactions (user_id, card_id, transaction_type) VALUES (?, ?, ?), (?, ?, ?)',
            [from_user, card_id, 'trade', to_user, card_id, 'trade']
        );

        res.json({ message: 'Kaart succesvol geruild' });
    } catch (error) {
        console.error('Fout bij ruilen van kaarten:', error);
        res.status(500).json({ error: 'Kan kaarten niet ruilen' });
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
    addCardToUser,
    getUserCards,
    tradeCard,
}
