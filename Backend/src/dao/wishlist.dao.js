import whishlistModel from "../model/wishlist.model.js";
import mongoose from "mongoose";

export async function getWishlistDetails(userId) {
  let wishlist = await whishlistModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: {
        path: "$items",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.product",
      },
    },
    {
      $unwind: {
        path: "$items.product",
      },
    },
    {
      $unwind: {
        path: "$items.product.variants",
      },
    },
    {
      $match: {
        $expr: {
          $eq: ["$items.variants", "$items.product.variants._id"],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$items",
        },
      },
    },
  ]);
  return wishlist
}
