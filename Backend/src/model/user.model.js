import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['buyer','seller'],
        default:'buyer',
        required:true
    }
})


userSchema.pre('save',async function(){
   if(!this.isModified('password'))  return;

   const hash = await bcrypt.hash(this.password,10)
   this.password = hash
})

userSchema.methods.comparepassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model('User',userSchema)

export default userModel;