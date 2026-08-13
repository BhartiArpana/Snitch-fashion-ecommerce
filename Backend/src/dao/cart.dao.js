import cartModel from "../model/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId){
     let cart = (await cartModel.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
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

      return cart
}