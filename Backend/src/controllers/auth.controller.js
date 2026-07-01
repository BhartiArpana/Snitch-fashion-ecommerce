import userModel from '../model/user.model.js'
import { config } from '../config/config.js'
import jwt from 'jsonwebtoken'

const generateToken = (user,res,message)=>{
    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET_KEY,{expiresIn:'7d'})
     
    res.cookie('token',token)
    res.status(200).json({
        message,
        _id:user._id,
        fullName:user.fullName,
        contact:user.contact,
        email:user.email,
        role:user.role,
        token
    })
}

export const register= async(req,res)=>{
    const {fullName, email,password, contact,isSeller} = req.body
    try{
        const userExists = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })
        if(userExists){
            return res.status(400).json({
                message:"User already exists with this email or contact number"
            })
        }

        const user = await userModel.create({
            fullName,
            email,
            password,
            contact,
            role:isSeller?'seller':'buyer'
        })

        await generateToken(user,res,'User registered successfully')
    
    }catch(err){
        console.error(err)
        res.status(500).json({
            message:'Internal server error'
        })
    }
}