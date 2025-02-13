import express from 'express';
const router = express.Router();
import { addUser } from '../controllers/usercontroller.js';

router.post('/users', addUser);

export default router;

