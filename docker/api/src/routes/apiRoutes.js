import express from 'express';
const router = express.Router();
import * as UserController from '../controllers/UserController.js';
import * as CardController from '../controllers/CardsController.js';
import * as LeaderboardController from '../controllers/LeaderboardController.js';
import * as DailyRewardController from '../controllers/DailyRewardController.js';
import * as TradingController from "../controllers/TradingController.js";

/////////////////////////////////////////////////////////////////
///////////////////////////// users /////////////////////////////
/////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: JohnDoe
 *               opleiding:
 *                 type: string
 *                 example: technology&bio
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', UserController.registerUser); 

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: JohnDoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', UserController.loginUser);

/**
 * @swagger
 * /api/getAllUsers:
 *   get:
 *     summary: Retrieve all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: JohnDoe
 *                   opleiding:
 *                     type: string
 *                     example: technology&bio
 *                   user_score:
 *                     type: integer
 *                     example: 100
 *       500:
 *         description: Internal server error
 */
router.get('/getAllUsers', UserController.getAllUsers);

/**
 * @swagger
 * /api/getUserBy/{param}/{value}:
 *   get:
 *     summary: Retrieve a user by a specific parameter and value
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: string
 *         description: The column name to search by (e.g., "username", "id")
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: The value to search for in the specified column
 *     responses:
 *       200:
 *         description: A user matching the specified parameter and value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: JohnDoe
 *                 opleiding:
 *                   type: string
 *                   example: technology&bio
 *                 user_score:
 *                   type: integer
 *                   example: 100
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/getUserBy/:param/:value', UserController.getUserBy); 

/**
 * @swagger
 * /api/deleteUser/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteUser/:id', UserController.deleteUser);

/////////////////////////////////////////////////////////////////
//////////////////////// leaderboards ///////////////////////////
/////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/getUserScoreById/{id}:
 *   get:
 *     summary: Retrieve the score of a user by their ID
 *     tags:
 *       - Leaderboards
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose score is to be retrieved
 *     responses:
 *       200:
 *         description: The user's score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: JohnDoe
 *                 user_score:
 *                   type: integer
 *                   example: 150
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/getUserScoreById/:id', LeaderboardController.getUserScoreById);


/**
 * @swagger
 * /api/getScoreByEducation:
 *   get:
 *     summary: Retrieve the total scores grouped by education
 *     tags:
 *       - Leaderboards
 *     responses:
 *       200:
 *         description: Total scores grouped by education
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   opleiding:
 *                     type: string
 *                     example: technology&bio
 *                   total_score:
 *                     type: integer
 *                     example: 5000
 *       500:
 *         description: Internal server error
 */
router.get('/getScoreByEducation', LeaderboardController.getScoreByEducation);


/**
 * @swagger
 * /api/getUsersScores:
 *   get:
 *     summary: Retrieve the scores of all users
 *     tags:
 *       - Leaderboards
 *     responses:
 *       200:
 *         description: A list of all users with their scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   userName:
 *                     type: string
 *                     example: JohnDoe
 *                   user_score:
 *                     type: integer
 *                     example: 150
 *       500:
 *         description: Internal server error
 */
router.get('/getUsersScores', LeaderboardController.getUsersScores);

/////////////////////////////////////////////////////////////////
/////////////////////////// cards ///////////////////////////////
/////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/addCard:
 *   post:
 *     summary: Add a card to a user's collection
 *     tags:
 *       - Cards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               card_id:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Card added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Kaart toegevoegd"
 *                 card_id:
 *                   type: integer
 *                   example: 101
 *       404:
 *         description: Card not found
 *       500:
 *         description: Internal server error
 */
router.post('/addCard', CardController.addCardToUser);


/**
 * @swagger
 * /api/userCards/{user_id}:
 *   get:
 *     summary: Retrieve all cards owned by a user
 *     tags:
 *       - Cards
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose cards are to be retrieved
 *     responses:
 *       200:
 *         description: A list of all cards owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   card_id:
 *                     type: integer
 *                     example: 101
 *                   cardName:
 *                     type: string
 *                     example: Fireball
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/userCards/:user_id', CardController.getUserCards);


/**
 * @swagger
 * /api/starter-pack:
 *   post:
 *     summary: Give a starter pack of cards to a user
 *     tags:
 *       - Cards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Starter pack given successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Starter pack given"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/starter-pack', CardController.giveStarterPack);


/**
 * @swagger
 * /api/general-pack:
 *   post:
 *     summary: Give a general pack of cards to a user
 *     tags:
 *       - Cards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: General pack given successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "General pack given"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/general-pack', CardController.giveGeneralPack);


/**
 * @swagger
 * /api/getCard_dex:
 *   get:
 *     summary: Retrieve the card dex (all available cards)
 *     tags:
 *       - Cards
 *     responses:
 *       200:
 *         description: A list of all available cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   card_id:
 *                     type: integer
 *                     example: 101
 *                   cardName:
 *                     type: string
 *                     example: Fireball
 *                   health:
 *                     type: integer
 *                     example: 50
 *                   attack:
 *                     type: integer
 *                     example: 20
 *                   rarity:
 *                     type: string
 *                     example: Rare
 *                   ability:
 *                     type: string
 *                     example: Heal
 *                   info:
 *                     type: string
 *                     example: "A powerful fire-based attack card."
 *                   opleiding:
 *                     type: string
 *                     example: technology&bio
 *                   artwork_path:
 *                     type: string
 *                     example: "fireball.png"
 *       500:
 *         description: Internal server error
 */
router.get('/getCard_dex', CardController.getCard_dex);

// trading
router.get("/getActiveTrades", TradingController.getActiveTrades);

/////////////////////////////////////////////////////////////////
///////////////////////////// trading ///////////////////////////
/////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/startTrade:
 *   post:
 *     summary: Start a new trade
 *     tags:
 *       - Trading
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user1:
 *                 type: integer
 *                 example: 1
 *               user2:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Trade started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tradeCode:
 *                   type: string
 *                   example: "ABC123"
 *                 message:
 *                   type: string
 *                   example: "Trade started"
 *       500:
 *         description: Internal server error
 */
router.post("/startTrade", TradingController.startTrade);

/**
 * @swagger
 * /api/joinTrade:
 *   post:
 *     summary: Join an existing trade
 *     tags:
 *       - Trading
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeCode:
 *                 type: string
 *                 example: "ABC123"
 *               userId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Trade joined successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trade joined"
 *       404:
 *         description: Trade not found
 *       500:
 *         description: Internal server error
 */
router.post("/joinTrade", TradingController.joinTrade);

/**
 * @swagger
 * /api/selectCard:
 *   post:
 *     summary: Select a card for the trade
 *     tags:
 *       - Trading
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeCode:
 *                 type: string
 *                 example: "ABC123"
 *               userId:
 *                 type: integer
 *                 example: 1
 *               cardId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Card selected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card selected"
 *       404:
 *         description: Trade or card not found
 *       500:
 *         description: Internal server error
 */
router.post("/selectCard", TradingController.selectCard);

/**
 * @swagger
 * /api/getTradeStatus/{tradeCode}:
 *   get:
 *     summary: Get the status of a trade
 *     tags:
 *       - Trading
 *     parameters:
 *       - in: path
 *         name: tradeCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the trade to retrieve the status for
 *     responses:
 *       200:
 *         description: Trade status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tradeStatus:
 *                   type: string
 *                   example: "Pending"
 *                 user1:
 *                   type: integer
 *                   example: 1
 *                 user2:
 *                   type: integer
 *                   example: 2
 *       404:
 *         description: Trade not found
 *       500:
 *         description: Internal server error
 */
router.get("/getTradeStatus/:tradeCode", TradingController.getTradeStatus);

/**
 * @swagger
 * /api/fetchTradeUpdates:
 *   post:
 *     summary: Fetch updates for a trade
 *     tags:
 *       - Trading
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeCode:
 *                 type: string
 *                 example: "ABC123"
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Trade updates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updates:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "User 2 selected a card"
 *       404:
 *         description: Trade not found
 *       500:
 *         description: Internal server error
 */
router.post("/fetchTradeUpdates", TradingController.fetchTradeUpdates);

/**
 * @swagger
 * /api/acceptTrade:
 *   post:
 *     summary: Accept a trade
 *     tags:
 *       - Trading
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeCode:
 *                 type: string
 *                 example: "ABC123"
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Trade accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trade accepted"
 *       404:
 *         description: Trade not found
 *       500:
 *         description: Internal server error
 */
router.post("/acceptTrade", TradingController.acceptTrade);


router.post("/deleteTrade", TradingController.deleteTrade);

//router.post("/tradeCards", TradingController.tradeCards); (this is called in "acceptTrade" function)

/////////////////////////////////////////////////////////////////
//////////////////////// Daily rewards //////////////////////////
/////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/daily:
 *   post:
 *     summary: Claim the daily reward
 *     tags:
 *       - Daily Rewards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Daily reward claimed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       card_id:
 *                         type: integer
 *                         example: 101
 *                       cardName:
 *                         type: string
 *                         example: Fireball
 *                       rarity:
 *                         type: string
 *                         example: Rare
 *       404:
 *         description: No cards available for the daily reward
 *       500:
 *         description: Internal server error
 */
router.post('/daily', DailyRewardController.claimDailyReward);

/**
 * @swagger
 * /api/daily/select:
 *   post:
 *     summary: Confirm the selection of a daily reward card
 *     tags:
 *       - Daily Rewards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               cardId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Card selection confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Card selection confirmed"
 *       404:
 *         description: Card not found or invalid selection
 *       500:
 *         description: Internal server error
 */
router.post('/daily/select', DailyRewardController.confirmCardSelection);

/**
 * @swagger
 * /api/daily/check:
 *   get:
 *     summary: Check if the daily reward is available
 *     tags:
 *       - Daily Rewards
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to check for daily reward availability
 *     responses:
 *       200:
 *         description: Daily reward availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Daily reward is available"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/daily/check', DailyRewardController.checkDailyReward);

export default router;