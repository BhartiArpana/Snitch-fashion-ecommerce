import { Router } from "express";
import { validateRegisterUser } from "../validators/auth.validators.js";
import {register} from '../controllers/auth.controller.js'

const authRouter = Router()


authRouter.post('/register',validateRegisterUser,register)


export default authRouter