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

export default router;

