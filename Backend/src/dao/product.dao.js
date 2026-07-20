import productModel from "../model/product.model.js";

export const stockInVariant = async (productId, variantId) => {
  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) return 0; // ya jo bhi default sahi lage tumhare logic ke hisaab se

  const variant = product.variants.find(
    (v) => v._id.toString() === variantId
  );

  return variant?.stock || 0;
};