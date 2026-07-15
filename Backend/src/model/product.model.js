import mongoose from "mongoose";
import priceSchema from "./price.model.js";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type:priceSchema,
      required:true
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    variants: [
      {
        image: [
          {
            url: {
              type: String,
            },
          },
        ],
        stock: {
          type: Number,
          default: 0,
        },
        attribut: {
          type: Map,
          of: String,
        },
        price: {
          type:priceSchema
        },
        
      },
    ],
    additional_info:{
            type:String
    }
  },
  { timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);
export default productModel;
