import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import multer from 'multer'
import { createProduct, getSellerProduct,getAllProducts,getProductDetails } from "../controllers/products.controller.js";

const upload  = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5*1024*1024
    }
})

const router = Router()

// @/api/products

router.post('/',upload.array('images',7),authenticateSeller,createProduct)
router.get('/seller',authenticateSeller,getSellerProduct)
router.get('/allProducts',getAllProducts)
router.get('/product/:productId',getProductDetails)

export default router