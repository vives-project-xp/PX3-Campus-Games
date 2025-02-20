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
        const [result] = await db.execute(
            'INSERT INTO users (name, opleiding, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const tradeCards = async (req, res) => {
    try {
        const { senderId, receiverId, senderCardId, receiverCardId } = req.body;

        // Check of beide spelers de kaarten bezitten
        const [senderHasCard] = await db.execute(
            'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?'
        , [senderId, senderCardId]);

        const [receiverHasCard] = await db.execute(
            'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?'
        , [receiverId, receiverCardId]);

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
    tradeCards,
    registerUser,
    loginUser,
    giveStarterPack,
}
