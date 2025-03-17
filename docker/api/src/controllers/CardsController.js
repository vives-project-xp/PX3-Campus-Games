import db from '../db.js';

const addCardToUser = async (req, res) => {
    try {
        const { user_id, card_id} = req.body;

        // Controleer of de kaart al bestaat in het bezit van de speler
        const [existingCard] = await db.execute(
            'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
            [user_id, card_id]
        );

        if (existingCard.length > 0) {
            // Update de hoeveelheid als de kaart al bestaat
            await db.execute(
                'UPDATE user_cards SET quantity = quantity + ? WHERE user_id = ? AND card_id = ?',
                [user_id, card_id, 1]
            );
        } else {
            // Voeg een nieuwe kaart toe aan de speler
            await db.execute(
                'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, ?)',
                [user_id, card_id, 1]
            );
        }

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

export {
    addCardToUser,
    getUserCards,
    tradeCards,
    giveStarterPack,
};