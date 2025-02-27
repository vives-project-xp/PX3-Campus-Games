import express from 'express';
const router = express.Router();
import * as UserController from '../controllers/UserController.js';
import * as CardController from '../controllers/CardsController.js';
import * as LeaderboardController from '../controllers/LeaderboardController.js';
import * as ScoreUpdateController from '../controllers/ScoreUpdateController.js';

// users
router.post('/users/register', UserController.registerUser); // origineel = router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.get('/getUserBy/:param/:value', UserController.getUserBy); // param = column name, value = value to search for
router.delete('/deleteUser/:id', UserController.deleteUser);

// leaderboards
router.get('/getUserScoreById/:id', LeaderboardController.getUserScoreById);
router.get('/getUsersScores', LeaderboardController.getUsersScores); //alle scores hoog naar laag per 10 users

// cards
router.post('/addCard', CardController.addCardToUser);   
router.get('/userCards/:user_id', CardController.getUserCards);  
router.post('/tradeCards', CardController.tradeCards);  
router.post('/starter-pack', CardController.giveStarterPack);

// score
router.patch('/addPoints/:id', ScoreUpdateController.addPoints);
export default router;


