import userModel from '../model/user.model.js'
import { config } from '../config/config.js'
import jwt from 'jsonwebtoken'

const generateToken = (user,res,message)=>{
    const token = jwt.sign({
        id:user._id,
        role:user.role
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

export const login = async(req,res)=>{
    const {email,password} = req.body
    try{
      const user = await userModel.findOne({email})
      if(!user){
        res.status(400).json({
            message:'Invalid email or password'
        })
      }
      const match = await user.comparepassword(password)
      if(!match){
        res.status(400).json({
            message:'Invalid email or password'
        })
      }
      await generateToken(user,res,'User logged in successfully')

    }catch(err){
        console.log(err)
    }
}

export const googleCallback = async(req,res)=>{
    // console.log(req.user)
    const {displayName,emails,profileUrl, id} = req.user
    const user = await userModel.findOne({email:emails[0].value})
    if(!user){
        user = await userModel.create({
            fullName:displayName,
            email:emails[0].value,
            googleId:id,

        })
    }
    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET_KEY,{expiresIn:'7d'})
    res.cookie('token',token)

    res.redirect(config.NODE_ENV? 'http://localhost:5173':'/')

}