import express from 'express'
import {registerValidator,loginValidator,addressValidator,updateAddressValidator} from '../validator/auth.validator.js'
import {register,login,googleCallback,getme,addAddress,updateAddress} from '../controllers/auth.controller.js'
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

// @route /api/auth/address/
// @description add address
// @access private

router.post('/address',authenticateUser,addressValidator,addAddress)

// @route /api/auth/address/:id
// @description update address
// @access private

router.patch('/address/:addressId',authenticateUser,updateAddressValidator,updateAddress)

export default router