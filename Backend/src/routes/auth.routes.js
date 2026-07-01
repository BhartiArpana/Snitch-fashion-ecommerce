import express from 'express'
import {registerValidator} from '../validator/auth.validator.js'
import {register} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register',registerValidator,register)

export default router