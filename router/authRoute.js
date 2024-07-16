import express from 'express'
import { login,logout, signUp } from '../controller/authController.js'

const router = express.Router()

router.post('/login',login)
router.post('/signup',signUp)
router.get('/logout',logout)


export default router