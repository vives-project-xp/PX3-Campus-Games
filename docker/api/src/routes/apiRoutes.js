import express from 'express';
const router = express.Router();
import * as UserController from '../controllers/UserController.js';
import * as CardController from '../controllers/CardsController.js';
import * as LeaderboardController from '../controllers/LeaderboardController.js';
import * as DailyRewardController from '../controllers/DailyRewardController.js';
import * as TradingController from "../controllers/TradingController.js";

// users

/**
 * @swagger
 * /register:
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
 *               userName:
 *                 type: string
 *                 example: JohnDoe
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
 * /login:
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
 *               userName:
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
router.post('/register', UserController.registerUser); 


router.post('/login', UserController.loginUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.get('/getUserBy/:param/:value', UserController.getUserBy); // param = column name, value = value to search for
router.delete('/deleteUser/:id', UserController.deleteUser);

// leaderboards
router.get('/getUserScoreById/:id', LeaderboardController.getUserScoreById);
router.get('/getScoreByEducation', LeaderboardController.getScoreByEducation);
router.get('/getUsersScores', LeaderboardController.getUsersScores); //alle scores hoog naar laag per 10 users
// cards
router.post('/addCard', CardController.addCardToUser);   
router.get('/userCards/:user_id', CardController.getUserCards);  
router.post('/starter-pack', CardController.giveStarterPack);
router.post('/general-pack', CardController.giveGeneralPack);
router.get('/getCard_dex', CardController.getCard_dex);

// trading
router.post("/startTrade", TradingController.startTrade);
router.post("/joinTrade", TradingController.joinTrade);
router.post("/selectCard", TradingController.selectCard);
router.get("/getTradeStatus/:tradeCode", TradingController.getTradeStatus);
router.post("/fetchTradeUpdates", TradingController.fetchTradeUpdates);
router.post("/acceptTrade", TradingController.acceptTrade);
//router.post("/tradeCards", TradingController.tradeCards); (this is called in "acceptTrade" function)

//Daily rewards
router.post('/daily', DailyRewardController.claimDailyReward);
router.post('/daily/select', DailyRewardController.confirmCardSelection);
router.get('/daily/check',DailyRewardController.checkDailyReward);


export default router;