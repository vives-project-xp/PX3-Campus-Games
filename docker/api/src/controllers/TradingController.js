import db from '../db.js';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid


const activeTrades = {};

// generate a unique trade code and store the trade session
export const startTrade = (req, res) => {
    const tradeCode = uuidv4();
    activeTrades[tradeCode] = { user1: null, user2: null };

    res.json({ tradeCode });
};

// join a trade once code has been scanned/created and return both users ID
export const joinTrade = (req, res) => {
    const { tradeCode, userId } = req.body;

    if (!activeTrades[tradeCode]) {
        return res.status(400).json({ error: "Invalid trade code" });
    }

    if (!activeTrades[tradeCode].user1) {
        activeTrades[tradeCode].user1 = userId;
    } else if (!activeTrades[tradeCode].user2) {
        activeTrades[tradeCode].user2 = userId;
    } else {
        return res.status(400).json({ error: "Trade is already full" });
    }

    res.json({
        message: "Joined trade successfully",
        tradeCode,
        user1: activeTrades[tradeCode].user1,
        user2: activeTrades[tradeCode].user2,
    });
};



// Select a card for trading
export const selectCard = (req, res) => {
    const { tradeCode, userId, card } = req.body;

    if (!activeTrades[tradeCode]) {
        return res.status(400).json({ error: "Trade not found" });
    }

    if (activeTrades[tradeCode].user1 === userId) {
        activeTrades[tradeCode].user1Card = card;
    } else if (activeTrades[tradeCode].user2 === userId) {
        activeTrades[tradeCode].user2Card = card;
    } else {
        return res.status(400).json({ error: "User not part of this trade" });
    }

    res.json({ message: "Card selected successfully" });
};

// Get the current trade status
export const getTradeStatus = (req, res) => {
    const { tradeCode } = req.params;

    if (!activeTrades[tradeCode]) {
        return res.status(400).json({ error: "Trade not found" });
    }

    res.json({
        user1: activeTrades[tradeCode].user1,
        user2: activeTrades[tradeCode].user2,
        user1Card: activeTrades[tradeCode].user1Card,
        user2Card: activeTrades[tradeCode].user2Card,
    });
};
