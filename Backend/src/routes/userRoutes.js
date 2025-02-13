import express from 'express';
const router = express.Router();
import * as userController from '../controllers/usercontroller.js';

router.post('/users', userController.addUser);
router.get('/getAllUsers', userController.getAllUsers);


export default router;

