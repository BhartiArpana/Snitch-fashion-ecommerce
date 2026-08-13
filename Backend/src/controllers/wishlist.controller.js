import whishlistModel from "../model/wishlist.model.js";
import productModel from "../model/product.model.js";
import userModel from "../model/user.model.js";

export const addToWhishlist = async (req, res) => {
  const { productId, variantId } = req.params;
  const user = req.user;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  let wishlist = await whishlistModel.findOne({ user: user._id });

  if (!wishlist) {
    wishlist = await whishlistModel.create({
      user: user._id,
      items: [{ product: productId, variants: variantId }],
    });
  } else {
    const alreadyWishlist = await wishlist.items.some((item) => {
      item.product.toString() == productId &&
        item.variants.toString() == variantId;
    });
    if (alreadyWishlist) {
      return res.status(400).json({
        message: "Cart alrady wishlisted",
        success: false,
      });
    }

    wishlist.items.push({ product: productId, variants: variantId });
    await wishlist.save();
  }

  res.status(201).json({
    message: "Added to whishlist",
    success: true,
    wishlist,
  });
};

export const getAllWishlistCart = async (req, res) => {
  const user = req.user;
  const wishlist = await whishlistModel.find({ user: user._id });
  if (!wishlist) {
    return res.status(400).json({
      message: "Data not found",
    });
  }

  res.status(200).json({
    message: "Data fetched successfully",
    success: true,
    wishlist,
  });
};

export const removeWishlistCart = async (req, res) => {
  const user = req.user;
  const { productId, variantId } = req.params;
  let wishlist = await whishlistModel.findOne({ user: user._id });

  if(!wishlist){
    return res.status(404).json({
        message:'wishlist not exist'
    })
  }

  const item =await wishlist.items.some(
    (item) =>
      item.product.toString() == productId &&
      item.variants.toString() == variantId
  );

  if(!item){
    return res.status(404).json({
        message:"Item not found"
    })
  }

   wishlist.items = wishlist.items.filter(
    (item) =>
      !(item.product.toString() === productId &&
        item.variants.toString() === variantId)
  );

  await wishlist.save()
  

  res.status(200).json({
    message:'Item deleted successfully',
    success:true,
    wishlist
  })
};
