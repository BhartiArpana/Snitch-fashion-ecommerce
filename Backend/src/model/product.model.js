import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
     seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:['INR','USD','EUR','GBP'],
            default:"INR"
        }
    },
    images:[
        {
            url:{
            type:String,
            required:true
        },
        }
    ]
},{timestamps:true})

const productModel = mongoose.model('Product',productSchema)
export default productModel 