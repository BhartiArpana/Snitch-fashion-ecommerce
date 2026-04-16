import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    contact:{
         type:String,
         unique:true
    },
    password:{
        type:String,
        required:function(){
            return !this.googleId
        }
    },
    role:{
        type:String,
        enum:['seller','buyer'],
        default:'buyer'
    },
    googleId:String,
    photos:String
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model('User',userSchema)
export default userModel