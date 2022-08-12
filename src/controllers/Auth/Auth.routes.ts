import express, { Router } from 'express';
import { register } from './Auth.controller';

const router: Router = express.Router();

router.post('/register', register);

export default router;
