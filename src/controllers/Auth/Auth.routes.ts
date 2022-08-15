import express, { Router } from 'express';
import { getMe, login, register, users } from './Auth.controller';
import { proctect } from '../../middleware/auth.middleware';

const router: Router = express.Router();
router.route('/users').get(proctect, users);
router.get('/me', proctect, getMe);
router.route('/register').post(register);
router.route('/login').post(login);

export default router;
