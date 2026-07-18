import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createproduct,
  getSellerProduct,
  getAllProducts,
  getProductDetails,
  addProductVariants,
  searchSuggestion,
  searchproducts
} from "../controllers/product.controllers.js";
import multer from "multer";
import { productValitor } from "../validator/product.validator.js";

const uplaod = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = Router();

// @route /api/products
// @description create product
// @access private
router.post(
  "/",
  authMiddleware,
  uplaod.array("images", 7),
  productValitor,
  createproduct,
);

// @route /api/products/seller
// @description get all products by authenticate seller
// @access private
router.get("/seller", authMiddleware, getSellerProduct);

// @route /api/products
// @description Get all products for client
// @access public
router.get("/", getAllProducts);

// @route /api/products/search
// description get searching product
// access public
router.get("/search", searchproducts);

// @route /api/products:productId
// @description get product details
// @access public
router.get("/:productId", getProductDetails);

// @route /api/products/:productId/variants
// @description add varients in products by the seller
// @access private
router.post(
  "/:productId/variants",
  uplaod.array("images", 7),
  authMiddleware,
  addProductVariants,
);



// @route /api/products/search/suggestion
// @description get search suggestions
// @access public
router.get("/search/suggestion", searchSuggestion);



export default router;
