import { Router } from "express";
import { validateRegisterUser ,validateLoginUser} from "../validators/auth.validators.js";
import {register,login, googleCallback, getMe} from '../controllers/auth.controller.js'
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = Router()


authRouter.post('/register',validateRegisterUser,register)
authRouter.post('/login',validateLoginUser,login)
authRouter.get('/google',
    passport.authenticate('google',{scope:["profile","email"]})
)
authRouter.get('/google/callback',
    passport.authenticate('google',{session:false,failureRedirect:'http://localhost:5173/login'}),
    googleCallback
)

authRouter.get('/me',authenticateUser,getMe)

export default authRouter