import { Router } from "express";
import { validateRegisterUser ,validateLoginUser} from "../validators/auth.validators.js";
import {register,login, googleCallback} from '../controllers/auth.controller.js'
import passport from "passport";

const authRouter = Router()


authRouter.post('/register',validateRegisterUser,register)
authRouter.post('/login',validateLoginUser,login)
authRouter.get('/google',
    passport.authenticate('google',{scope:["profile","email"]})
)
authRouter.get('/google/callback',
    passport.authenticate('google',{session:false}),
    googleCallback
)

export default authRouter