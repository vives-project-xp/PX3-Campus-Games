import db from '../db.js';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid


const activeTrades = {};

// trade code aanmaken en sessie aanmaken
export const startTrade = (req, res) => {
    const tradeCode = uuidv4(); // Generate unique tradeCode
    activeTrades[tradeCode] = { user1: null, user2: null }; // Store trade session

    res.json({ tradeCode }); // Send tradeCode to frontend
};


export const joinTrade = (req, res) => {
    const { tradeCode } = req.body;

    if (!activeTrades[tradeCode]) {
        return res.status(400).json({ error: "Invalid trade code" });
    }

    if (!activeTrades[tradeCode].user1) {
        activeTrades[tradeCode].user1 = req.body.userId;
    } else if (!activeTrades[tradeCode].user2) {
        activeTrades[tradeCode].user2 = req.body.userId;
    } else {
        return res.status(400).json({ error: "Trade is already full" });
    }

    res.json({ message: "Joined trade successfully", tradeCode });
};
