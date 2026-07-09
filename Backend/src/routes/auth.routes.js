import express from 'express'
import {registerValidator,loginValidator} from '../validator/auth.validator.js'
import {register,login,googleCallback,getme} from '../controllers/auth.controller.js'
import passport from 'passport'
import {config} from '../config/config.js'
import {authenticateUser} from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register',registerValidator,register)
router.post('/login',loginValidator,login)
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback',
  passport.authenticate('google', {
    session: false ,
    failureRedirect:config.NODE_ENV? 'http://localhost:5173/login':'/login'
  }),
  googleCallback
);

// @route /api/auth/get-me
// @access private 
// @description get user details
router.get('/get-me',authenticateUser,getme)

export default router