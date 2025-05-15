import db from '../db.js';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid
import axios from "axios";
import { addTradePoint, recalculateUserScore } from './ScoreUpdateController.js';
import { io, userSockets } from '../server.js';
const API_URL = "https://api.collectica.devbitapp.be";

const activeTrades = {};

export const getActiveTrades = (req, res) => {
    try {
        const now = new Date();
        
        // You might want to add timestamps when trades are created
        const trades = Object.entries(activeTrades).map(([code, trade]) => ({
            tradeCode: code,
            user1: trade.user1,
            user2: trade.user2,
            status: trade.user1 && trade.user2 ? 'active' : 'waiting',
            createdAt: trade.createdAt || 'unknown' // Consider adding this when creating trades
        }));
        
        res.json({
            success: true,
            count: trades.length,
            activeCount: trades.filter(t => t.status === 'active').length,
            waitingCount: trades.filter(t => t.status === 'waiting').length,
            trades
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active trades',
            error: error.message
        });
    }
};

// generate a unique trade code and store the trade session
export const startTrade = (req, res) => {
    const tradeCode = uuidv4();
    const userId = req.body.userId;

    if (!userId) {
        console.error("User ID is required");
        return res.status(400).json({ error: "User ID is required" });
    }

    activeTrades[tradeCode] = { 
        user1: userId,
        user2: null,
        createdAt: new Date().toISOString()
    };

    console.log("New trade created:", activeTrades[tradeCode]);

    res.json({ tradeCode });
};

// join a trade once code has been scanned/created and return both users ID
export const joinTrade = (req, res) => {
    const { tradeCode, userId } = req.body;
    console.log("Received data:", { tradeCode, userId });

    if (!tradeCode || !userId) {
        console.error("Missing trade code or user ID");
        return res.status(400).json({ error: "Missing trade code or user ID" });
    }

    if (!activeTrades[tradeCode]) {
        console.error("Invalid trade code:", tradeCode);
        return res.status(400).json({ error: "Invalid trade code" });
    }

    let bothJoined = false;

    try {
        // Voeg de gebruiker toe aan de juiste plek in de trade
        if (!activeTrades[tradeCode].user1) {
            activeTrades[tradeCode].user1 = userId;
        } else if (!activeTrades[tradeCode].user2) {
            activeTrades[tradeCode].user2 = userId;
            bothJoined = true; // Beide gebruikers zijn nu in de trade
        } else {
            console.error("Trade is already full:", activeTrades[tradeCode]);
            return res.status(400).json({ error: "Trade is already full" });
        }

        console.log(`Trade Code: ${tradeCode}`);
        console.log(`User 1: ${activeTrades[tradeCode].user1}`);
        console.log(`User 2: ${activeTrades[tradeCode].user2}`);

        // Notify both users to update their trade session
        if (bothJoined) {
            notifyUserToUpdate(activeTrades[tradeCode].user1, tradeCode);
            notifyUserToUpdate(activeTrades[tradeCode].user2, tradeCode);
        } else {
            // Notify the first user to update their trade session
            notifyUserToUpdate(activeTrades[tradeCode].user1, tradeCode);
        }

        res.json({
            message: "Joined trade successfully",
            tradeCode,
            user1: activeTrades[tradeCode].user1,
            user2: activeTrades[tradeCode].user2,
        });
    } catch (error) {
        console.error("Error in joinTrade:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const notifyUserToUpdate = (userId, tradeCode) => {
    try {
        const socketId = userSockets[userId];
        if (socketId) {
            io.to(socketId).emit("tradeUpdated", { tradeCode });
        } else {
            console.warn(`Socket ID not found for user: ${userId}`);
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

    const trade = activeTrades[tradeCode];
    
    // Voeg logging toe voor debugging
    console.log(`Selecting card for trade ${tradeCode}`, {
        user1: trade.user1,
        user2: trade.user2,
        currentUser: userId
    });

    if (trade.user1 === userId) {
        trade.user1Card = card;
    } else if (trade.user2 === userId) {
        trade.user2Card = card;
    } else {
        return res.status(400).json({ error: "User not part of this trade" });
    }

    // Forceer een volledige status update naar beide gebruikers
    io.to(tradeCode).emit("tradeUpdated", {
        tradeCode,
        forceUpdate: true,  // Nieuwe vlag voor complete refresh
        tradeStatus: trade  // Stuur de volledige trade status mee
    });

    res.json({
        message: "Card selected successfully",
        tradeStatus: trade
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
        user1Accepted: activeTrades[tradeCode].user1Accepted,
        user2Accepted: activeTrades[tradeCode].user2Accepted
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
        
        // Add trade point to users
        await addTradePoint(user1); 
        await addTradePoint(user2); 
        //
       
  
      console.log("TradingController.js 3");
      console.log("Trade completed successfully");

        // Mark trade as complete
        trade.completed = true;

        // Notify users about the completed trade
        io.to(userSockets[trade.user1]).emit("tradeCompleted", { 
            tradeCode,
            receivedCard: trade.user2Card 
        });
        io.to(userSockets[trade.user2]).emit("tradeCompleted", { 
            tradeCode,
            receivedCard: trade.user1Card 
        });

        console.log("Trade completed successfully");
    } catch (error) {
        console.error("Error executing trade:", error);
    }
  };  

  // delete a trade from the activeTrades array
  export const deleteTrade = (req, res) => {
  
    const { tradeCode, userId } = req.body;
  
    if (!tradeCode || !userId) {
      return res.status(400).json({ error: "Missing trade code or user ID" });
    }
  
    delete activeTrades[tradeCode];
  
    res.json({ success: true });
  };

