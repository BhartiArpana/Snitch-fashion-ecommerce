import Router from 'express'
import {authMiddleware} from '../middlewares/auth.middleware.js'
import {createproduct} from '../controllers/product.controllers.js'
import multer from 'multer'
import { productValitor } from '../validator/product.validator.js'

const uplaod = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5* 1024*1024
    }
})

const router = Router()
router.post('/',authMiddleware,productValitor,uplaod.array('images',7),createproduct)

export default router