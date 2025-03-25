import db from '../db.js';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid
import axios from "axios";
const API_URL = "http://localhost:3000";

import { io, userSockets } from '../server.js';




const activeTrades = {};

// generate a unique trade code and store the trade session
export const startTrade = (req, res) => {
    const tradeCode = uuidv4();
    activeTrades[tradeCode] = { user1: null, user2: null };

    res.json({ tradeCode });
};

// join a trade once code has been scanned/created and return both users ID
// join a trade once code has been scanned/created and return both users ID
// Join a trade once the QR code is scanned
export const joinTrade = (req, res) => {
    const { tradeCode, userId } = req.body;
    console.log("Received data:", { tradeCode, userId });

    if (!tradeCode || !userId) {
        return res.status(400).json({ error: "Missing trade code or user ID" });
    }

    if (!activeTrades[tradeCode]) {
        return res.status(400).json({ error: "Invalid trade code" });
    }

    let otherUserId = null;

    if (!activeTrades[tradeCode].user1) {
        activeTrades[tradeCode].user1 = userId;
    } else if (!activeTrades[tradeCode].user2) {
        activeTrades[tradeCode].user2 = userId;
        otherUserId = activeTrades[tradeCode].user1; // Get the first user's ID
    } else {
        return res.status(400).json({ error: "Trade is already full" });
    }

    console.log(`Trade Code: ${tradeCode}`);
    console.log(`User 1: ${activeTrades[tradeCode].user1}`);
    console.log(`User 2: ${activeTrades[tradeCode].user2}`);

    // ✅ Notify the first user to update their trade session
    if (otherUserId) {
        notifyUserToUpdate(otherUserId, tradeCode);
    }

    res.json({
        message: "Joined trade successfully",
        tradeCode,
        user1: activeTrades[tradeCode].user1,
        user2: activeTrades[tradeCode].user2,
    });
};

const notifyUserToUpdate = async (userId, tradeCode) => {
    try {
        console.log("Notifying user:", userId, "to update trade:", tradeCode);
        // Check if we have a socket for the user
        const socketId = userSockets[userId];
        if (socketId) {
            io.to(socketId).emit("tradeUpdated", { tradeCode });
        }
    } catch (error) {
        console.error("Error notifying user to update:", error);
    }
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

    // Return the updated trade state so the frontend updates immediately
    res.json({
        message: "Card selected successfully",
        tradeStatus: activeTrades[tradeCode] // Send the updated trade state
    });
};


// Get the current trade status (does it exist)
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

// Handle trade update requests
export const fetchTradeUpdates = (req, res) => {
    const { tradeCode, userId } = req.body;

    if (!activeTrades[tradeCode]) {
        return res.status(400).json({ error: "Trade not found" });
    }

    const tradeData = activeTrades[tradeCode];

    res.json({
        tradeCode,
        user1: tradeData.user1,
        user2: tradeData.user2,
        user1Card: tradeData.user1Card || null,
        user2Card: tradeData.user2Card || null,
    });
};


