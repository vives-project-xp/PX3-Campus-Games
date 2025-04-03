import db from '../db.js';
import { updateScoreOnCardChange, recalculateUserScore } from './ScoreUpdateController.js';

const activeTrades = {}; // Store active trade sessions

// Helper function to get card rarity and details
const getCardDetails = async (card_id) => {
    const [card] = await db.execute(
        'SELECT card_id, rarity FROM Cards_dex WHERE card_id = ?',
        [card_id]
    );
    return card[0];
};

// Add card to user collection with score update
const addCardToUser = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { user_id, card_id } = req.body;
        
        await connection.beginTransaction();

        // 1. Get card details
        const card = await getCardDetails(card_id);
        if (!card) {
            await connection.rollback();
            return res.status(404).json({ error: 'Kaart niet gevonden' });
        }

        // 2. Add/update card in collection
        const [existing] = await connection.execute(
            'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
            [user_id, card_id]
        );

        if (existing.length > 0) {
            await connection.execute(
                'UPDATE user_cards SET quantity = quantity + 1 WHERE user_id = ? AND card_id = ?',
                [user_id, card_id]
            );
        } else {
            await connection.execute(
                'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, 1)',
                [user_id, card_id]
            );
        }

        // 3. Update user score
        await updateScoreOnCardChange(connection, user_id, [
            { rarity: card.rarity, quantityChange: 1 }
        ]);

        await connection.commit();
        res.json({ 
            success: true,
            message: 'Kaart toegevoegd',
            card_id
        });
    } catch (error) {
        await connection.rollback();
        console.error('Card add error:', error);
        res.status(500).json({ error: 'Kon kaart niet toevoegen' });
    } finally {
        connection.release();
    }
};

// Get user's card collection
const getUserCards = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [cards] = await db.execute(
            `SELECT c.card_id, c.cardName, c.health, c.attack, c.ability, 
             c.rarity, uc.quantity, c.info, c.artwork_path
             FROM user_cards uc
             JOIN Cards_dex c ON uc.card_id = c.card_id
             WHERE uc.user_id = ?`,
            [user_id]
        );

        res.json(cards);
    } catch (error) {
        console.error('Get cards error:', error);
        res.status(500).json({ error: 'Kon kaarten niet ophalen' });
    }
};


// Handle card trading between users
const tradeCards = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { tradeCode, userId, cardId } = req.body;

        await connection.beginTransaction();

        // 1. Start or join trade
        if (!activeTrades[tradeCode]) {
            activeTrades[tradeCode] = { 
                user1: { id: userId, card: cardId }, 
                user2: null 
            };
            await connection.commit();
            return res.json({ message: "Trade gestart, wacht op tweede speler" });
        }

        // 2. Join existing trade
        if (!activeTrades[tradeCode].user2) {
            activeTrades[tradeCode].user2 = { id: userId, card: cardId };
        } else {
            await connection.rollback();
            return res.status(400).json({ error: "Trade is al vol" });
        }

        // 3. Verify both players and cards
        const { user1, user2 } = activeTrades[tradeCode];
        
        // Check if users own their cards
        const [user1Card] = await connection.execute(
            'SELECT 1 FROM user_cards WHERE user_id = ? AND card_id = ?',
            [user1.id, user1.card]
        );
        const [user2Card] = await connection.execute(
            'SELECT 1 FROM user_cards WHERE user_id = ? AND card_id = ?',
            [user2.id, user2.card]
        );

        if (!user1Card.length || !user2Card.length) {
            await connection.rollback();
            return res.status(400).json({ error: "Een of beide spelers hebben de kaart niet" });
        }

        // 4. Execute the trade
        await connection.execute(
            'UPDATE user_cards SET user_id = ? WHERE user_id = ? AND card_id = ?',
            [user2.id, user1.id, user1.card]
        );
        await connection.execute(
            'UPDATE user_cards SET user_id = ? WHERE user_id = ? AND card_id = ?',
            [user1.id, user2.id, user2.card]
        );

        // 5. Update scores for both users
        await recalculateUserScore(connection, user1.id);
        await recalculateUserScore(connection, user2.id);

        // 6. Get updated scores for response
        const [user1Data] = await connection.execute(
            'SELECT user_score FROM users WHERE id = ?',
            [user1.id]
        );
        const [user2Data] = await connection.execute(
            'SELECT user_score FROM users WHERE id = ?',
            [user2.id]
        );

        delete activeTrades[tradeCode];
        await connection.commit();

        res.json({ 
            message: "Trade succesvol",
            scores: {
                user1: { id: user1.id, newScore: user1Data[0].user_score },
                user2: { id: user2.id, newScore: user2Data[0].user_score }
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Trade error:', error);
        res.status(500).json({ 
            error: 'Trade mislukt',
            details: error.message 
        });
    } finally {
        connection.release();
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

// Give starter pack based on user's education
const giveStarterPack = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await connection.beginTransaction();

        // 1. Get user's education
        const [user] = await connection.execute(
            'SELECT opleiding FROM users WHERE id = ?',
            [userId]
        );

        if (user.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'User not found' });
        }

        const opleiding = user[0].opleiding;

        // 2. Get 3 random cards for education with their rarities
        const [cards] = await connection.execute(
            `SELECT card_id, rarity FROM Cards_dex 
             WHERE opleiding = ? ORDER BY RAND() LIMIT 3`,
            [opleiding]
        );

        if (cards.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'No cards found for this education' });
        }

        // 3. Add cards to collection and prepare score updates
        const scoreUpdates = [];
        for (const card of cards) {
            const [existing] = await connection.execute(
                'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
                [userId, card.card_id]
            );

            if (existing.length > 0) {
                await connection.execute(
                    'UPDATE user_cards SET quantity = quantity + 1 WHERE user_id = ? AND card_id = ?',
                    [userId, card.card_id]
                );
            } else {
                await connection.execute(
                    'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, 1)',
                    [userId, card.card_id]
                );
            }
            scoreUpdates.push({ 
                rarity: card.rarity, 
                quantityChange: 1 
            });
        }

        // 4. Update user score based on card rarities
        await updateScoreOnCardChange(connection, userId, scoreUpdates);

        await connection.commit();
        
        // 5. Verify the score update
        const [updatedUser] = await connection.execute(
            'SELECT user_score FROM users WHERE id = ?',
            [userId]
        );

        res.json({ 
            success: true,
            message: 'Starter pack received',
            cards: cards.map(c => c.card_id),
            newScore: updatedUser[0].user_score
        });
    } catch (error) {
        await connection.rollback();
        console.error('Starter pack error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to process starter pack',
            details: error.message
        });
    } finally {
        connection.release();
    }
};

// Give general random card pack
const giveGeneralPack = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { userId } = req.body;
        await connection.beginTransaction();

        // 1. Get 3 random cards
        const [cards] = await connection.execute(
            `SELECT card_id, rarity FROM Cards_dex 
             ORDER BY RAND() LIMIT 3`
        );

        // 2. Add cards and prepare score updates
        const scoreUpdates = [];
        for (const card of cards) {
            const [existing] = await connection.execute(
                'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
                [userId, card.card_id]
            );

            if (existing.length) {
                await connection.execute(
                    'UPDATE user_cards SET quantity = quantity + 1 WHERE user_id = ? AND card_id = ?',
                    [userId, card.card_id]
                );
            } else {
                await connection.execute(
                    'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, 1)',
                    [userId, card.card_id]
                );
            }
            scoreUpdates.push({ rarity: card.rarity, quantityChange: 1 });
        }

        // 3. Update score
        await updateScoreOnCardChange(connection, userId, scoreUpdates);

        await connection.commit();
        res.json({ 
            success: true,
            message: 'Algemene pack ontvangen',
            cards: cards.map(c => c.card_id)
        });
    } catch (error) {
        await connection.rollback();
        console.error('General pack error:', error);
        res.status(500).json({ error: 'Kon pack niet geven' });
    } finally {
        connection.release();
    }
};

// Get all cards in the game
const getCard_dex = async (req, res) => {
    try {
        const [cards] = await db.execute(
            'SELECT * FROM Cards_dex'
        );
        res.json(cards);
    } catch (error) {
        console.error('Card dex error:', error);
        res.status(500).json({ error: 'Kon kaarten niet ophalen' });
    }
};

export {
    addCardToUser,
    getUserCards,
    tradeCards,
    giveStarterPack,
    giveGeneralPack,
    getCard_dex
};

