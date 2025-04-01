import db from '../db.js';
import { updateScoreOnCardChange } from './ScoreUpdateController.js';

export const claimDailyReward = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const userId = Number(req.body.userId);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Ongeldige userId' 
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const [claimed] = await connection.execute(
      'SELECT 1 FROM users WHERE id = ? AND DATE(last_reward_claimed) = ?',
      [userId, today]
    );

    if (claimed.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Je hebt vandaag al een beloning geclaimd' 
      });
    }

    const [cards] = await connection.execute(
      `SELECT card_id, cardName, artwork_path, attack, ability, health, rarity 
       FROM Cards_dex 
       ORDER BY RAND() 
       LIMIT 3`
    );

    if (cards.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Geen kaarten beschikbaar' 
      });
    }

    res.json({
      success: true,
      cards: cards.map(card => ({
        ...card,
        artwork_path: card.artwork_path.split('/').pop()
      }))
    });

  } catch (error) {
    console.error('Daily reward error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Interne serverfout',
      details: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};

export const confirmCardSelection = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { userId, cardId } = req.body;
    
    if (!userId || !cardId) {
      return res.status(400).json({ 
        success: false,
        error: 'Ontbrekende userId of cardId' 
      });
    }

    // Voeg kaart toe aan gebruiker
    await connection.execute(
      `INSERT INTO user_cards (user_id, card_id, quantity) 
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE quantity = quantity + 1`,
      [userId, cardId]
    );

    // Update score
    const [card] = await connection.execute(
      'SELECT rarity FROM Cards_dex WHERE card_id = ?',
      [cardId]
    );
    
    if (card.length > 0) {
      await updateScoreOnCardChange(connection, userId, [
        { rarity: card[0].rarity, quantityChange: 1 }
      ]);
    }

    // Update claim datum
    await connection.execute(
      'UPDATE users SET last_reward_claimed = NOW() WHERE id = ?',
      [userId]
    );

    res.json({ 
      success: true,
      message: 'Kaart succesvol toegevoegd aan je collectie!'
    });

  } catch (error) {
    console.error('Card selection error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Databasefout bij toevoegen kaart'
    });
  } finally {
    if (connection) connection.release();
  }
};