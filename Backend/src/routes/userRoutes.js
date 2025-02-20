import express from 'express';
const router = express.Router();
import * as UserController from '../controllers/UserController.js';

router.post('/users', UserController.addUser);
router.post('/trade', UserController.tradeCards);  
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/starter-pack', UserController.giveStarterPack);

export default router;

