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

export async function getAllProducts(req,res){
    const products = await productModel.find()
    return res. status(200).json({
        message:'product fetched successfully',
        success:true,
        products
    })
}

export async function getProductDetails(req,res){
    const {productId} = req.params

    const product = await productModel.findById(productId)

    if(!product){
        return res.status(404).json({
            message:"product not found",
           
        })
    }

    res.status(200).json({
        message:"Product detail fetched successfully!",
        success:true,
        product
    })


}

export async function addProductVariant(req,res){
    const {productId} = req.params

    const product = await productModel.findOne({
        _id:productId,
        seller: req.user._id
    })
     if(!product){
        return res.status(404).json({
            message:"product not found",        
            success:false
        })
    }

    const files = req.files
    const images = []
    if(files && files.length > 0){
        (await Promise.all(files.map(async(file)=>{
            const image = await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname
            })
            return image
        }))).map(img=>images.push(img))
    }

    const price = req.body.priceAmount
    const stock = req.body.stock
    const attributes = req.body.attributes ? JSON.parse(req.body.attributes) : {}
    // console.log('price ',price ,'stock',stock,'attribute',attributes);
    
    product.variants.push({
        price:{
            amount:price || product.price.amount,
            currency:product.price.currency
        },
        stock:stock || 0,
        attributes,
        images
    })
    await product.save()
    res.status(201).json({
        message:"Product variant added successfully",
        success:true,
        product
    })
}