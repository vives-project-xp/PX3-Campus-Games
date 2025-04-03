import db from '../db.js';

const rarityValues = {
  'Common': 10,
  'Uncommon': 20,
  'Rare': 30,
  'Ultra Rare': 40,
  'Legendary': 50
};

export const updateScoreOnCardChange = async (connection, userId, cardChanges) => {
  try {
      // Calculate total points change
      const pointsDifference = cardChanges.reduce((total, change) => {
          return total + (rarityValues[change.rarity] * change.quantityChange);
      }, 0);

      if (pointsDifference !== 0) {
          await connection.execute(
              'UPDATE users SET user_score = user_score + ? WHERE id = ?',
              [pointsDifference, userId]
          );
      }
  } catch (error) {
      console.error('Score update error:', error);
      throw error;
  }
};

export const recalculateUserScore = async (connection, userId) => {
    try {
        const [cards] = await connection.execute(
            `SELECT c.rarity, uc.quantity 
           FROM user_cards uc
           JOIN Cards_dex c ON uc.card_id = c.card_id
           WHERE uc.user_id = ?`,
            [userId]
        );

        const newScore = cards.reduce((total, card) => {
            return total + (rarityValues[card.rarity] * card.quantity);
        }, 0);

        await connection.execute(
            'UPDATE users SET user_score = ? WHERE id = ?',
            [newScore, userId]
        );

        return newScore;
    } catch (error) {
        console.error('Recalculate score error:', error);
        throw error;
    }
};

export const addTradePoint = async (userId) => {
    try {
        if (!userId) {
            throw new Error('userId is required');
        }

        // Get a database connection
        const connection = await db.getConnection();

        // Update the user's score
        await connection.execute(
            'UPDATE users SET user_score = user_score + 1 WHERE id = ?',
            [userId]
        );

        console.log(`Trade point added successfully for user ${userId}`);
    } catch (error) {
        console.error('Error adding trade point:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

export const addCardPoints = async (userId, cardId) => {
    try {
        if (!userId || !cardId) {
            throw new Error('userId and cardId are required');
        }
        // Get a database connection
        const connection = await db.getConnection();
        // Update the user's score
        await connection.execute(
            'UPDATE users SET user_score = user_score + ? WHERE id = ?',
            [quantity, userId]
        );
        console.log(`Card points added successfully for user ${userId}`);
    }
    catch (error) {
        console.error('Error adding card points:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
    };



