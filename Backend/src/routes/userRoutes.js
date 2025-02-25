import express from 'express';
const router = express.Router();
import * as UserController from '../controllers/UserController.js';
import * as CardController from '../controllers/CardController.js';
import * as LeaderboardController from '../controllers/LeaderboardController.js';

// users
router.post('/addUser', UserController.addUser);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.get('/getUserBy/:param/:value', UserController.getUserBy);
router.delete('/deleteUser/:id', UserController.deleteUser);

// leaderboards
router.get('/leaderboard/weekly', LeaderboardController.getWeeklyLeaderboard);
router.get('/leaderboard/total', LeaderboardController.getTotalLeaderboard);
router.get('/leaderboard/study', LeaderboardController.getStudyLeaderboard);
router.get('/leaderboard/user/:userId', LeaderboardController.getUserRanking);

// cards
router.post('/add', UserController.addCardToUser);   
router.get('/user/:user_id', UserController.getUserCards);  
router.post('/trade', UserController.tradeCards);  
router.post('/starter-pack', UserController.giveStarterPack);

export default router;

