import db from '../db.js';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid
import axios from "axios";
import { recalculateUserScore } from './ScoreUpdateController.js';

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

    // Notify the first user to update their trade session
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

    // Notify both users of the card selection update
    notifyUserToUpdate(activeTrades[tradeCode].user1, tradeCode);
    notifyUserToUpdate(activeTrades[tradeCode].user2, tradeCode);

    // Return the updated trade state so the frontend updates immediately
    res.json({
        message: "Card selected successfully",
        tradeStatus: activeTrades[tradeCode] // Send the updated trade state
    });
};

// Get the current trade status (does it exist)
// TradingController.js (Backend)
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
        user1Accepted: activeTrades[tradeCode].user1Accepted, // Add this line
        user2Accepted: activeTrades[tradeCode].user2Accepted  // Add this line
    });
};

// Handle trade update requests
export const fetchTradeUpdates = async () => {
    if (!tradeCode.value) return;
    try {
      const response = await axios.get(`${API_URL}/api/getTradeStatus/${tradeCode.value}`);
      // When both users are in the trade, mark tradeJoined as true
      if (response.data.user1 && response.data.user2) {
        tradeJoined.value = true;
      }
      // Check if both users have accepted the trade
      if (response.data.user1Accepted && response.data.user2Accepted) {
        // Determine which card you received based on your userId
        if (response.data.user1 === userId) {
          receivedCard.value = response.data.user2Card;
        } else {
          receivedCard.value = response.data.user1Card;
        }
        showNewCardPopup.value = true;
      } else {
        // Update the friendCard display (or other parts of your UI)
        if (response.data.user1 === userId) {
          friendCard.value = response.data.user2Card;
        } else {
          friendCard.value = response.data.user1Card;
        }
      }
    } catch (error) {
      console.error("Error fetching trade updates:", error);
    }
  };


// When a user accepts the trade
export const acceptTrade = async (req, res) => {
    const { tradeCode, userId } = req.body;

    if (!tradeCode || !userId) {
        return res.status(400).json({ error: "Trade code and user ID are required" });
    }

    if (!activeTrades[tradeCode]) {
        return res.status(400).json({ error: "Trade not found" });
    }

    const trade = activeTrades[tradeCode];
    if (trade.user1 === userId) {
        trade.user1Accepted = true;
    } else if (trade.user2 === userId) {
        trade.user2Accepted = true;
    } else {
        return res.status(400).json({ error: "User not part of this trade" });
    }

    // Check if both users have accepted
    if (trade.user1Accepted && trade.user2Accepted) {
        console.log("tradeCards(tradeCode);");
        await tradeCards(tradeCode); // Call the trade logic to exchange the cards
    } else {
        // Notify both users to update their trade session
        notifyUserToUpdate(trade.user1, tradeCode);
        notifyUserToUpdate(trade.user2, tradeCode);
    }

    res.json({ message: "Trade accepted", tradeStatus: trade });
};


// The tradeCards function will handle the actual trade logic
export const tradeCards = async (tradeCode) => {
    try {
        console.log("TradingController.js 1");
      const trade = activeTrades[tradeCode];
      const user1 = trade.user1;
      const user2 = trade.user2;
  
      const user1CardId = trade.user1Card && trade.user1Card.card_id ? trade.user1Card.card_id : trade.user1Card;
      const user2CardId = trade.user2Card && trade.user2Card.card_id ? trade.user2Card.card_id : trade.user2Card;
  
      await db.execute("UPDATE user_cards SET user_id = ? WHERE user_id = ? AND card_id = ?",
        [user2, user1, user1CardId]);
      await db.execute("UPDATE user_cards SET user_id = ? WHERE user_id = ? AND card_id = ?",
        [user1, user2, user2CardId]);

        console.log("TradingController.js 2");
        // Recalculate scores for both users
        await recalculateUserScore(db, user1);
        await recalculateUserScore(db, user2);
  
       // Mark trade as complete rather than deleting immediately
       trade.completed = true;
       //notifyUserToUpdate(user1, tradeCode);
       //notifyUserToUpdate(user2, tradeCode);

       io.to(userSockets[trade.user1]).emit("tradeCompleted", { 
        tradeCode,
        receivedCard: trade.user2Card 
      });
      io.to(userSockets[trade.user2]).emit("tradeCompleted", { 
        tradeCode,
        receivedCard: trade.user1Card 
      });
  
      console.log("TradingController.js 3");
      console.log("Trade completed successfully");

      
    } catch (error) {
      console.error("Error executing trade:", error);
    }
  };  