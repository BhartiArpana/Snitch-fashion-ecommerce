import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    
      country: {
        type: String,
        default: "India",
      },
      name: {
        type: String,
        required: true,
      },
      mobileNumber: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required:true
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
        
      },
      state: {
        type: String,
        required: true,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
    
},{
    _v:false
})

export default addressSchema


   