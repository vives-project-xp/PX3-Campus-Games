import db from '../db.js';

const rarityValues = {
  'Common': 10,
  'Uncommon': 20,
  'Rare': 30,
  'Ultra Rare': 40,
  'Legendary': 50
};

// Bereken punten voor een enkele kaart
const calculateCardPoints = (rarity, quantity = 1) => {
  return rarityValues[rarity] * quantity;
};

// Update alleen wanneer kaarten veranderen
export const updateScoreOnCardChange = async (userId, cardChanges = []) => {
  // Bereken totaal verschil in punten
  const pointsDifference = cardChanges.reduce((total, change) => {
    return total + calculateCardPoints(change.rarity, change.quantityChange);
  }, 0);

  if (pointsDifference === 0) return;

  // Efficiënte single query update
  await db.execute(
    'UPDATE users SET user_score = user_score + ? WHERE id = ?',
    [pointsDifference, userId]
  );
};

// Alternatieve lightweight versie voor complete herberekening
export const recalculateUserScore = async (userId) => {
  const [cards] = await db.execute(
    `SELECT c.rarity, uc.quantity 
     FROM user_cards uc
     JOIN Cards_dex c ON uc.card_id = c.card_id
     WHERE uc.user_id = ?`,
    [userId]
  );

  const newScore = cards.reduce((total, card) => {
    return total + calculateCardPoints(card.rarity, card.quantity);
  }, 0);

  await db.execute(
    'UPDATE users SET user_score = ? WHERE id = ?',
    [newScore, userId]
  );

  return newScore;
};