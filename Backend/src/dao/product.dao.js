import productModel from "../model/product.model.js";

export const stockInVariant = async(req,res)=>{
    const {productId, variantId} = req.params
     const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });
  const stock = await product.variants.find(variants=>variants._id.toString()===variantId).stock
  return stock
}