import db from '../db.js';
import { updateScoreOnCardChange } from './ScoreUpdateController.js';
import { io, userSockets } from '../server.js';

const getCardRarity = async (card_id) => {
    const [card] = await db.execute(
        'SELECT rarity FROM Cards_dex WHERE card_id = ?',
        [card_id]
    );
    return card[0]?.rarity;
};

export const claimDailyReward = async (req, res) => {
    try {
        const { userId } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // Check if already claimed today
        const [user] = await db.execute(
            'SELECT last_login FROM users WHERE id = ? AND last_login = ?',
            [userId, today]
        );

        if (user.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Je hebt vandaag al een beloning geclaimd' 
            });
        }

        // Update last login date
        await db.execute(
            'UPDATE users SET last_login = ? WHERE id = ?',
            [today, userId]
        );

        // Get 3 random cards
        const [cards] = await db.execute(
            'SELECT card_id FROM Cards_dex ORDER BY RAND() LIMIT 3'
        );

        // Notify client via Socket.IO if connected
        if (userSockets[userId]) {
            io.to(userSockets[userId]).emit('rewardAvailable', {
                cards: cards.map(c => c.card_id)
            });
        }

        res.json({
            success: true,
            cards: cards.map(c => c.card_id),
            message: 'Kies 1 kaart als beloning'
        });
    } catch (error) {
        console.error('Daily reward error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Fout bij ophalen dagelijkse beloning' 
        });
    }
};

export const selectDailyCard = async (req, res) => {
    try {
        const { userId, cardId } = req.body;
        
        // Add card to collection
        const [existing] = await db.execute(
            'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
            [userId, cardId]
        );

        if (existing.length > 0) {
            await db.execute(
                'UPDATE user_cards SET quantity = quantity + 1 WHERE user_id = ? AND card_id = ?',
                [userId, cardId]
            );
        } else {
            await db.execute(
                'INSERT INTO user_cards (user_id, card_id, quantity) VALUES (?, ?, 1)',
                [userId, cardId]
            );
        }

        // Update score
        const rarity = await getCardRarity(cardId);
        await updateScoreOnCardChange(userId, [
            { rarity, quantityChange: 1 }
        ]);

        // Notify client of successful selection
        if (userSockets[userId]) {
            io.to(userSockets[userId]).emit('rewardClaimed', {
                cardId,
                success: true
            });
        }

        res.json({ 
            success: true,
            message: 'Beloning ontvangen!',
            cardId
        });
    } catch (error) {
        console.error('Error selecting daily card:', error);
        res.status(500).json({ 
            success: false,
            error: 'Fout bij toevoegen beloning' 
        });
    }
};