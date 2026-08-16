import Router from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  validateAddtoCart,
  validateincrementCartQuantity,
} from "../validator/cart.validator.js";
import {
  addToCart,
  getCart,
  incrementCartQuantity,
  decrementCartQuantity,
  removeAddToCart,
  createorderController,
  verifyPaymentController,
  createBuynowOrderController
} from "../controllers/cart.controller.js";

const route = Router();

// @route /api/cart/add/:productId:/variantId
// @description add to cart
// @access private
// @argument productid
// @argument variantId
// @argument quantity

route.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddtoCart,
  addToCart,
);

// @route /api/cart
// @description get all card
// @access private

route.get("/", authenticateUser, getCart);

// @route /api/cart/product/increment/:productId/:variantId
// @description increment cart quantity by 1
// @access private

route.patch(
  "/product/increment/:productId/:variantId",
  authenticateUser,
  validateincrementCartQuantity,
  incrementCartQuantity,
);

// @route /api/cart/product/decrement/:productId/variantId
// @description decrement cart quantity by 1
// @access private

route.patch(
  "/product/decrement/:productId/:variantId",
  authenticateUser,
  validateincrementCartQuantity,
  decrementCartQuantity,
);

// @route /api/cart/product/remove/:productId/:variantId
route.delete(
  "/product/remove/:productId/:variantId",
  authenticateUser,
  validateincrementCartQuantity,
  removeAddToCart,
);

// @route /api/cart/payment/create/order
// @description create payment
// @access private
route.post("/payment/create/order", authenticateUser, createorderController);

// @route /api/cart/payment/verify/order
// @description verify payment
// @access private
route.post("/payment/verify/order", authenticateUser, verifyPaymentController);

// @route /api/cart/payment/buynow/:productId/:variantId
// @description create payment for buynow
// @access private
route.post('/payment/buynow/:productId/:variantId',authenticateUser,createBuynowOrderController)
export default route;
