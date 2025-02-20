import express from 'express';
const router = express.Router();
import * as UserController from '../controllers/UserController.js';

router.post('/addUser', UserController.addUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.get('/getUserBy/:param/:value', UserController.getUserBy);
router.delete('/deleteUser/:id', UserController.deleteUser);
router.get('/leaderboard/weekly', UserController.getWeeklyLeaderboard);
router.get('/leaderboard/total', UserController.getTotalLeaderboard);
router.get('/leaderboard/study', UserController.getStudyLeaderboard);
router.get('/leaderboard/user/:userId', UserController.getUserRanking);
router.post('/add', UserController.addCardToUser);   
router.get('/user/:user_id', UserController.getUserCards);  
router.post('/trade', UserController.tradeCards);  
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/starter-pack', UserController.giveStarterPack);
export default router;

