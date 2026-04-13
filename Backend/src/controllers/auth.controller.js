import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/config.js";
import { response } from "express";

async function sendTokenResponse(user,res,message){
    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET_KEY,{
        expiresIn:'7d'
    })
    res.cookie('token',token)
    res.status(201).json({
        message,
        success:true,
        user:{
            id:user._id,
            fullname:user.fullname,
            email:user.email,
            contact:user.contact,
            role:user.role
        }
    })
}

export async function register(req,res){
    const {fullname,email,contact, password,isSeller} = req.body
    console.log('fullname',fullname,email,contact,password,isSeller);
    
    try{
         const isUserExist = await userModel.findOne({
        $or:[
            {email:email},
            {contact:contact}
        ]
    })

    if(isUserExist){
        return res.status(400).json({
            message:'User already exist with this email and contact'
        })
    }

    const user = await userModel.create({
        fullname,
        email,
        contact,
        password,
        role:isSeller? 'seller':'buyer'
    })
    await sendTokenResponse(user,res,"User register successfully")

    }catch(err){
        console.log("Error",err);
        return res.status(500).json({message:"Server Error" })
        
    }
   
}

export async function login(req,res){
    const {email,password} = req.body
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"Invalid email and password"
        })
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Invalid email and password"
        })
    }
    await sendTokenResponse(user,res,"User loggedin successfully")

}

export const googleCallback = async(req,res)=>{
    console.log(req.user);
    res.redirect('http://localhost:5173/')
    
}