import productModel from "../models/products.model.js"
import { uploadFile } from "../services/storage.service.js"


export async function createProduct (req,res){
    const {title,description,priceAmount,priceCurrency} = req.body
    const user = req.user

   const image = req.files
  ? await Promise.all(req.files.map(async (file) => {
      return await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname
      })
    }))
  : []

    const product = await productModel.create({
        title,
        description,
        seller:user._id,
        image,
        price:{
            amount:priceAmount,
            currency:priceCurrency
        }

    })
    res.status(201).json({
        message:'Product created',
        success:true,
        product
    })

}

export async function getSellerProduct(req,res){
    const user = req.user

    const product = await productModel.find({seller:user._id})

    res.status(200).json({
        message:"Products fetch successfully",
        product
    })
}