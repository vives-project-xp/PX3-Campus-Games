import db from '../db.js';
import { updateScoreOnCardChange } from './ScoreUpdateController.js';
const activeTrades = {}; // Store active trade selections

const getCardRarity = async (card_id) => {
    const [card] = await db.execute(
        'SELECT rarity FROM Cards_dex WHERE card_id = ?',
        [card_id]
    );
    return card[0]?.rarity;
};

const addCardToUser = async (req, res) => {
    try {
        const { user_id, card_id } = req.body;

        // Get card rarity first
        const rarity = await getCardRarity(card_id);
        if (!rarity) {
            return res.status(400).json({ error: 'Ongeldige kaart ID' });
        }

        // Check if card already exists for user
        const [existingCard] = await db.execute(
            'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
            [user_id, card_id]
        );

        if (existingCard.length > 0) {
            // Update quantity if card exists
            await db.execute(
                'UPDATE user_cards SET quantity = quantity + 1 WHERE user_id = ? AND card_id = ?',
                [user_id, card_id]
            );
        } else {
            // Add new card if not exists
            await db.execute(
                'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, 1)',
                [user_id, card_id]
            );
        }

        // Update user score
        await updateScoreOnCardChange(user_id, [
            { rarity, quantityChange: 1 }
        ]);

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
            `SELECT c.card_id, c.cardName, c.health, c.attack, c.ability, c.rarity, uc.quantity, c.info, c.artwork_path
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

// // API to update selected card for trading
// const updateTradeSelection = async (req, res) => {
//     try {
//         const { tradeCode, cardId } = req.body;

//         if (!activeTrades[tradeCode]) {
//             activeTrades[tradeCode] = { user1Card: null, user2Card: null };
//         }

//         if (!activeTrades[tradeCode].user1Card) {
//             activeTrades[tradeCode].user1Card = cardId;
//         } else {
//             activeTrades[tradeCode].user2Card = cardId;
//         }

//         res.json({ message: 'Trade selection updated', tradeData: activeTrades[tradeCode] });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // als QR code gescanned is, zorg ervoor om de trade te joinen
// export const joinTrade = (req, res) => {
//     const { tradeCode } = req.body;

//     if (!activeTrades[tradeCode]) {
//         return res.status(400).json({ error: "Invalid trade code" });
//     }

//     if (!activeTrades[tradeCode].user1) {
//         activeTrades[tradeCode].user1 = req.body.userId;
//     } else if (!activeTrades[tradeCode].user2) {
//         activeTrades[tradeCode].user2 = req.body.userId;
//     } else {
//         return res.status(400).json({ error: "Trade is already full" });
//     }

//     res.json({ message: "Joined trade successfully", tradeCode });
// };


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

        // Get user's education
        const [user] = await db.execute(
            'SELECT opleiding FROM users WHERE id = ?',
            [userId]
        );

        if (user.length === 0) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        const opleiding = user[0].opleiding;

        // Get 3 random cards for the education
        const [cards] = await db.execute(
            'SELECT card_id FROM Cards_dex WHERE opleiding = ? ORDER BY RAND() LIMIT 3',
            [opleiding]
        );

        // Prepare score updates
        const scoreUpdates = [];

        // Add cards to user
        for (const card of cards) {
            const [existingCard] = await db.execute(
                'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
                [userId, card.card_id]
            );

            const rarity = await getCardRarity(card.card_id);
            
            if (existingCard.length > 0) {
                await db.execute(
                    'UPDATE user_cards SET quantity = quantity + 1 WHERE user_id = ? AND card_id = ?',
                    [userId, card.card_id]
                );
            } else {
                await db.execute(
                    'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, 1)',
                    [userId, card.card_id]
                );
            }

            scoreUpdates.push({ rarity, quantityChange: 1 });
        }

        // Update user score for all cards
        await updateScoreOnCardChange(userId, scoreUpdates);

        res.json({ 
            message: 'Starter pack ontvangen!',
            cards: cards.map(c => c.card_id)
        });
    } catch (error) {
        console.error('Fout bij geven starter pack:', error);
        res.status(500).json({ error: error.message });
    }
};

const giveGeneralPack = async (req, res) => {
    try {
        const { userId } = req.body;

        // Get 3 random cards
        const [cards] = await db.execute(
            'SELECT card_id FROM Cards_dex ORDER BY RAND() LIMIT 3'
        );

        // Prepare score updates
        const scoreUpdates = [];

        // Add cards to user
        for (const card of cards) {
            const [existingCard] = await db.execute(
                'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
                [userId, card.card_id]
            );

            const rarity = await getCardRarity(card.card_id);
            
            if (existingCard.length > 0) {
                await db.execute(
                    'UPDATE user_cards SET quantity = quantity + 1 WHERE user_id = ? AND card_id = ?',
                    [userId, card.card_id]
                );
            } else {
                await db.execute(
                    'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, 1)',
                    [userId, card.card_id]
                );
            }

            scoreUpdates.push({ rarity, quantityChange: 1 });
        }

        // Update user score for all cards
        await updateScoreOnCardChange(userId, scoreUpdates);

        res.json({ 
            message: 'Algemene pack ontvangen!',
            cards: cards.map(c => c.card_id)
        });
    } catch (error) {
        console.error('Fout bij geven algemene pack:', error);
        res.status(500).json({ error: error.message });
    }
};

const getCard_dex = async (req, res) => {
    try {
        const [cards] = await db.execute('SELECT * FROM Cards_dex');
        res.json(cards);
    } catch (error) {
        console.error('Fout bij ophalen van kaarten:', error);
        res.status(500).json({ error: 'Kan kaarten niet ophalen' });
    }
};


export {
    addCardToUser,
    getUserCards,
    tradeCards,
    giveStarterPack,
    giveGeneralPack,
    getCard_dex,
    
};