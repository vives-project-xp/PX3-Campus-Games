import db from '../db.js';

const activeTrades = {}; // Store active trade selections

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

// API to update selected card for trading
const updateTradeSelection = async (req, res) => {
    try {
        const { tradeCode, cardId } = req.body;

        if (!activeTrades[tradeCode]) {
            activeTrades[tradeCode] = { user1Card: null, user2Card: null };
        }

        if (!activeTrades[tradeCode].user1Card) {
            activeTrades[tradeCode].user1Card = cardId;
        } else {
            activeTrades[tradeCode].user2Card = cardId;
        }

        res.json({ message: 'Trade selection updated', tradeData: activeTrades[tradeCode] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// 🔄 Ruil een kaart met een andere speler
const tradeCards = async (req, res) => {
    try {
        const { tradeCode, userId, cardId } = req.body;

        if (!tradeCode) {
            return res.status(400).json({ error: "Trade code is required" });
        }

        // start the trade in case it does not exist
        if (!activeTrades[tradeCode]) {
            activeTrades[tradeCode] = { user1: { id: userId, card: cardId }, user2: null };
        } else if (!activeTrades[tradeCode].user2) {
            activeTrades[tradeCode].user2 = { id: userId, card: cardId };
        } else {
            return res.status(400).json({ error: "Trade already has two participants" });
        }

        // If both players have selected a card, say it's valid
        if (activeTrades[tradeCode].user1 && activeTrades[tradeCode].user2) {
            const { user1, user2 } = activeTrades[tradeCode];

            const [user1HasCard] = await db.execute(
                "SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?", 
                [user1.id, user1.card]
            );
            const [user2HasCard] = await db.execute(
                "SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?", 
                [user2.id, user2.card]
            );

            if (user1HasCard.length === 0 || user2HasCard.length === 0) {
                return res.status(400).json({ error: "One or both users do not own the selected card" });
            }

            // trade happens
            await db.execute("UPDATE user_cards SET user_id = ? WHERE user_id = ? AND card_id = ?", 
                [user2.id, user1.id, user1.card]);
            await db.execute("UPDATE user_cards SET user_id = ? WHERE user_id = ? AND card_id = ?", 
                [user1.id, user2.id, user2.card]);

            delete activeTrades[tradeCode];

            return res.json({ message: "Trade successful" });
        }

        res.json({ message: "Trade updated, waiting for both users" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const giveStarterPack = async (req, res) => {
    try {
        const { userId } = req.body;

        // Haal de opleiding van de gebruiker op
        const [user] = await db.execute(
            'SELECT opleiding FROM users WHERE id = ?',
            [userId]
        );

        if (user.length === 0) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        const opleiding = user[0].opleiding;

        // Selecteer 3 random kaarten uit de database die specifiek zijn voor de opleiding
        const [cards] = await db.execute(
            'SELECT card_id FROM Cards_dex WHERE opleiding = ? ORDER BY RAND() LIMIT 3',
            [opleiding]
        );

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

const giveGeneralPack = async (req, res) => {
    try {
        const { userId } = req.body;

        // Selecteer 3 random kaarten uit de database
        const [cards] = await db.execute('SELECT card_id FROM Cards_dex ORDER BY RAND() LIMIT 3');

        // Voeg de kaarten toe aan de gebruiker
        for (const card of cards) {
            // Controleer of de kaart al bestaat in het bezit van de speler
            const [existingCard] = await db.execute(
                'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
                [userId, card.card_id]
            );

            if (existingCard.length > 0) {
                // Update de hoeveelheid als de kaart al bestaat
                await db.execute(
                    'UPDATE user_cards SET quantity = quantity + ? WHERE user_id = ? AND card_id = ?',
                    [1, userId, card.card_id]
                );
            } else {
                // Voeg een nieuwe kaart toe aan de speler
                await db.execute(
                    'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, ?)',
                    [userId, card.card_id, 1]
                );
            }
        }

        res.json({ message: 'Algemene pack ontvangen!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    addCardToUser,
    getUserCards,
    tradeCards,
    giveStarterPack,
    giveGeneralPack,
};