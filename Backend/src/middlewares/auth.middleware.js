import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import userModel from '../models/user.model.js'

export async function authenticateUser(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(400).json({
            message:'Token not provided!'
        })
    }
    try{
        const decoded = jwt.verify(token,config.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.id)
        if(!user){
            return res.status(409).json({
                message:"unauthorized"
            })
        }
        req.user = user
        next()

    }catch(err){
        res.status(400).json({
            message:'unauthorized'
        })
    }
}

export async function authenticateSeller(req,res,next){
   const token = req.cookies.token
   if(!token){
    return res.status(400).json({
        message:'UnAuthorized'
    })
   }
   try{
    const decoded =  jwt.verify(token,config.JWT_SECRET_KEY)
    const user = await userModel.findById(decoded.id)
    if(!user){
        return res.status(400).json({
            message:"Unauthorized"
        })
    }
    if(user.role!=='seller'){
        return res.status(403).json({
            message:"forbidden"
        })
    }
    req.user = user
    next()
   }catch(err){
    return res.status(401).json({
        message:"Unauthorized"
    })
   }
   
}