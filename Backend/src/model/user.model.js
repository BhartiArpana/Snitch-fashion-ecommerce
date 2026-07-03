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
        required:false
    },
    password:{
        type:String,
        required:function (){
            return !this.googleId
        }
    },
    role:{
        type:String,
        enum:['buyer','seller'],
        default:'buyer',
        required:true
    },
    googleId:{
        type:String
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