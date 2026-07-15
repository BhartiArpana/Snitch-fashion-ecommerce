import Router from 'express'
import {authenticateUser} from '../middlewares/auth.middleware.js' 
import {validateAddtoCart} from '../validator/cart.validator.js'
import {addToCart,getCart} from '../controllers/cart.controller.js'

const route = Router()

// @route /api/cart/add/:productId:/variantId
// @description add to cart
// @access private
// @argument productid
// @argument variantId
// @argument quantity

route.post('/add/:productId/:variantId',authenticateUser,validateAddtoCart,addToCart)

// @route /api/cart
// @description get all card
// @access private

route.get('/',authenticateUser,getCart)

export default route