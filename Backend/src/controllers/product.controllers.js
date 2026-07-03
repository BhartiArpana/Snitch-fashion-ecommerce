import userModel from '../model/user.model.js'
import productModel from '../model/product.model.js'
import uploadFile from '../services/storage.services.js'

export const createproduct = async(req,res)=>{
    const {description,title,priceAmount,priceCurrency} = req.body
    const seller  = req.user
    const images = await Promise.all(req.files.map(async(file)=>{
        return await uploadFile(
            file.buffer,
        file.originalname
        )
    }))

    const product = await productModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency:priceCurrency || 'INR'
        },
        images,
        seller:seller._id
    })
    res.status(201).json({
        message:'product created successfully',
        success:true,
        product
    })
    
}