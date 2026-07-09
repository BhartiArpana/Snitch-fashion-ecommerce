import Router from 'express'
import {authMiddleware} from '../middlewares/auth.middleware.js'
import {createproduct, getSellerProduct,getAllProducts} from '../controllers/product.controllers.js'
import multer from 'multer'
import { productValitor } from '../validator/product.validator.js'

const uplaod = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5* 1024*1024
    }
})

const router = Router()

// @route /api/products
// @description create product 
// @access private
router.post('/',authMiddleware,uplaod.array('images',7),productValitor,createproduct)

// @route /api/products/seller
// @description get all products by authenticate seller 
// @access private
router.get('/seller',authMiddleware,getSellerProduct)

// @route /api/products
// @description Get all products for client 
// @access public
router.get('/',getAllProducts)

export default router