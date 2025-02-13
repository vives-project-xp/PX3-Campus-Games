import express from 'express';
const router = express.Router();
import * as UserController from '../controllers/UserController.js';

router.post('/addUser', UserController.addUser);
router.get('/getAllUsers', UserController.getAllUsers);
export default router;

