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
const tradeCards = async (req, res) => {
    try {
        const { senderId, receiverId, senderCardId, receiverCardId } = req.body;

        // Check of beide spelers de kaarten bezitten
        const [senderHasCard] = await db.execute(`
            SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?
        `, [senderId, senderCardId]);

        const [receiverHasCard] = await db.execute(`
            SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?
        `, [receiverId, receiverCardId]);

        if (senderHasCard.length === 0 || receiverHasCard.length === 0) {
            return res.status(400).json({ error: 'Beide spelers moeten de kaart bezitten' });
        }

        // Voer de ruil uit
        await db.execute('UPDATE user_cards SET user_id = ? WHERE user_id = ? AND card_id = ?', 
            [receiverId, senderId, senderCardId]);
        await db.execute('UPDATE user_cards SET user_id = ? WHERE user_id = ? AND card_id = ?', 
            [senderId, receiverId, receiverCardId]);

        res.json({ message: 'Trade succesvol' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const giveStarterPack = async (req, res) => {
    try {
        const { userId } = req.body;

        // Selecteer 3 random kaarten uit de database
        const [cards] = await db.execute('SELECT card_id FROM Cards_dex ORDER BY RAND() LIMIT 3');

        // Voeg de kaarten toe aan de gebruiker
        for (const card of cards) {
            await db.execute('INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, 1)', 
                [userId, card.card_id]);
        }

        res.json({ message: 'Starter pack ontvangen!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check of de user al bestaat
        const [existingUser] = await db.execute('SELECT * FROM users WHERE name = ?', [username]);
        if (existingUser.length > 0) return res.status(400).json({ error: 'Gebruiker bestaat al' });

        // Hash het wachtwoord
        const hashedPassword = await bcrypt.hash(password, 10);

        // Voeg gebruiker toe aan database
        const [result] = await db.execute(
            'INSERT INTO users (name, opleiding, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User aangemaakt', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Zoek de gebruiker
        const [user] = await db.execute('SELECT * FROM users WHERE name = ?', [username]);
        if (user.length === 0) return res.status(401).json({ error: 'Ongeldige login' });

        // Check wachtwoord
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) return res.status(401).json({ error: 'Ongeldige login' });

        // Genereer een token
        const token = jwt.sign({ id: user[0].id }, 'SECRET_KEY', { expiresIn: '24h' });

        res.json({ message: 'Login succesvol', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    tradeCards,
    registerUser,
    loginUser,
    giveStarterPack,
}
