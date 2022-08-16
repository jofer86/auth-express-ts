import express, { Router } from 'express';
import { forgotPassword, getMe, login, register, resetPassowrd, users } from './Auth.controller';
import { proctect, authorize } from '../../middleware/auth.middleware';

const router: Router = express.Router();
router.route('/users').get(proctect, authorize('admin'), users);
router.get('/me', proctect, getMe);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:resetToken').put(resetPassowrd);

export default router;
