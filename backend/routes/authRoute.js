import express from 'express';
import { signUp ,signIn, google, refreshToken } from '../controllers/authController.js';
const router = express.Router()

router.post('/signup',signUp)
router.post('/signin',signIn)
router.post('/google',google)
router.post('/refreshToken',refreshToken)




export default router