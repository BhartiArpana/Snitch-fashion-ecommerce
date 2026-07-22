import productModel from "../model/product.model.js";
import cartModel from "../model/cart.model.js";
import { stockInVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body || {};
  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(400).json({
      message: "Product not found",
      success: false,
    });
  }

  const stock = stockInVariant;

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.variants?.toString() === variantId,
  );
  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variants?.toString() === variantId,
    ).quantity;
    if (quantityInCart > stock) {
      return res.status(400).json({
        message: "out of stock",
        success: false,
      });
    }
    await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.products": productId,
        "item.variants": variantId,
      },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );

    return res.status(200).json({
      message: "Cart update successfully",
      success: true,
      cart,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: "out of stock",
      success: false,
    });
  }
  cart.items.push({
    product: productId,
    variants: variantId,
    quantity,
    price: product.price,
  });
  await cart.save();

  res.status(200).json({
    message: "Add to cart successfully",
    success: true,
    cart,
  });
};

export const getCart = async (req, res) => {
  let user = req.user;
  let cart = (await cartModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user._id),
      },
    },
    { $unwind: { path: "$items" } },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.product",
      },
    },
    { $unwind: { path: "$items.product" } },
    {
      $unwind: { path: "$items.product.variants" },
    },
    {
      $match: {
        $expr: {
          $eq: ["$items.variants", "$items.product.variants._id"],
        },
      },
    },
    {
      $addFields: {
        itemsPrice: {
          price: {
            $multiply: [
              "$items.quantity",
              "$items.product.variants.price.amount",
            ],
          },
          currency: "$items.product.variants.price.currency",
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        totalPrice: { $sum: "$itemsPrice.price" },
        currency: {
          $first: "$itemsPrice.currency",
        },
        items: { $push: "$items" },
      },
    },
  ]))[0];

  if (!cart) {
    cart = await cartModel.create({
      user: user._id,
    });
  }
  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

export const incrementCartQuantity = async (req, res) => {
  const { variantId, productId } = req.params;
  const product = await productModel.findOne(
    {
      _id: productId,
      "variants._id": variantId,
    },
    {
      "varinats.$": 1,
    },
  );
  if (!product) {
    return res.status(400).json({
      message: "product not found",
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
    });
  }

  const stock = await stockInVariant(productId, variantId);
  const itemQuantityInCart =
    cart?.items.find(
      (item) =>
        item.product.toString() == productId && item.variants == variantId,
    )?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `${stock} item left in the stock`,
      success: false,
    });
  }

  const updateCart = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variants": variantId,
    },
    {
      $inc: { "items.$.quantity": 1 },
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    message: "cart item increment successfully",
    success: true,
    cart: updateCart,
  });
};

export const decrementCartQuantity = async (req, res) => {
  const { variantId, productId } = req.params;
  const product = await productModel.findOne(
    {
      _id: productId,
      "variants._id": variantId,
    },
    {
      "varinats.$": 1,
    },
  );
  if (!product) {
    return res.status(400).json({
      message: "product not found",
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
    });
  }

  const stock = await stockInVariant(productId, variantId);
  const itemQuantityInCart =
    cart?.items.find(
      (item) =>
        item.product.toString() == productId && item.variants == variantId,
    )?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `${stock} item left in the stock`,
      success: false,
    });
  }

  const updateCart = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variants": variantId,
    },
    {
      $inc: { "items.$.quantity": -1 },
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    message: "cart item increment successfully",
    success: true,
    cart: updateCart,
  });
};

export const removeAddToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  try {
    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const cart = await cartModel.findOne({
      user: req.user._id,
    });
    if (!cart) {
      return res.status(404).json({
        message: "cart not found",
      });
    }
    const deleteItemId =
      cart.items.find(
        (item) =>
          item.product.toString() == productId &&
          item.variants.toString() == variantId,
      )?._id || null;

    if (!deleteItemId) {
      return res.status(404).json({
        message: "item not found",
        success: false,
      });
    }
    await cartModel.updateOne(
      { user: req.user._id },
      { $pull: { items: { _id: deleteItemId } } },
    );

    res.status(200).json({
      message: "cart deleted successfully",
      success: true,
    });
  } catch (err) {
    console.log("err ", err);
  }
};
