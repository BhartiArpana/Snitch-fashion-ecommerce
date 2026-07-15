import mongoose from "mongoose";
import priceSchema from "./price.model.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variants: {
          type: mongoose.Schema.Types.ObjectId, // variant is a subdocument _id inside Product.variants
          ref:'Product.variants',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: priceSchema,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel;