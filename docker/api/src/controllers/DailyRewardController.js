// DailyRewardController.js
import db from '../db.js';
import { updateScoreOnCardChange } from './ScoreUpdateController.js';

const getCardRarity = async (card_id) => {
    const [card] = await db.execute(
        'SELECT rarity FROM Cards_dex WHERE card_id = ?',
        [card_id]
    );
    return card[0]?.rarity;
};

export const claimDailyReward = async (req, res) => {
    const db = await db.getdb();
    try {
        const { userId } = req.body;
        const today = new Date().toISOString().split('T')[0];

        await db.beginTransaction();

        // Check if already claimed today
        const [claimed] = await db.execute(
            'SELECT 1 FROM users WHERE id = ? AND last_reward_claim = ?',
            [userId, today]
        );

        if (claimed.length > 0) {
            await db.rollback();
            return res.status(400).json({ 
                success: false,
                message: 'Je hebt vandaag al een beloning geclaimd' 
            });
        }

        // Get 1 random card (vereenvoudigd van 3 naar 1)
        const [cards] = await db.execute(
            'SELECT card_id, rarity FROM Cards_dex ORDER BY RAND() LIMIT 1'
        );

        if (cards.length === 0) {
            await db.rollback();
            return res.status(404).json({ error: 'Geen kaarten beschikbaar' });
        }

        const card = cards[0];
        
        // Add card to collection
        const [existing] = await db.execute(
            'SELECT * FROM user_cards WHERE user_id = ? AND card_id = ?',
            [userId, card.card_id]
        );

        if (existing.length > 0) {
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

        // Update score
        await updateScoreOnCardChange(db, userId, [
            { rarity: card.rarity, quantityChange: 1 }
        ]);

        // Update last claim date
        await db.execute(
            'UPDATE users SET last_reward_claim = ? WHERE id = ?',
            [today, userId]
        );

        await db.commit();
        res.json({
            success: true,
            message: 'Dagelijkse beloning ontvangen!',
            cardId: card.card_id
        });
    } catch (error) {
        await db.rollback();
        console.error('Daily reward error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Fout bij claimen dagelijkse beloning' 
        });
    } finally {
        db.release();
    }
};