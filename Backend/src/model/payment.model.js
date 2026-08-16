import mongoose from "mongoose";
import priceSchema from "./price.model.js";
import addressSchema from './address.model.js'

const paymentSchema = new mongoose.Schema({
    status:{
        type:String,
        enum:['pending','paid','failed'],
        default:"pending"
    },
    price:priceSchema,
    razorpay:{
        orderId:String,
        paymentId:String,
        signature:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderItems:[
        {
            title:String,
            productId:mongoose.Schema.Types.ObjectId,
            variantId:mongoose.Schema.Types.ObjectId,
            quantity:Number,
            images:[{url:String}],
            description:String,
            price:priceSchema,
        }
    ],
    address:{
        type:addressSchema,
        required:true
    }
})

const paymentModel = mongoose.model('payment',paymentSchema)
export default paymentModel