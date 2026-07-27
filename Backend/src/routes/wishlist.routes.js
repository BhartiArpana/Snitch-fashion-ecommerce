import whishlistModel from "../model/wishlist.model.js";
import Router from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddtoWhislist } from "../validator/wishlist.validator.js";
import {
  addToWhishlist,
  getAllWishlistCart,
  removeWishlistCart,
} from "../controllers/wishlist.controller.js";
import route from "./cart.routes.js";

const router = Router();

// @route /api/wishlist/productId/variantId
// @description add to whishlist
// @access private
router.post(
  "/:productId/:variantId",
  authenticateUser,
  validateAddtoWhislist,
  addToWhishlist,
);

// @route /api/wishlist
// @description get all wishlist cart
// @access private
router.get("/", authenticateUser, getAllWishlistCart);

// @route /api/wishlist/remove/productId/variantId
// @description remove item from wishlist
// @access private
router.delete(
  "/remove/:productId/:variantId",
  authenticateUser,
  validateAddtoWhislist,
  removeWishlistCart,
);
export default router;
