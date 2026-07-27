import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema(
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

          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const whishlistModel = mongoose.model("Wishlist", wishlistSchema);
export default whishlistModel;
