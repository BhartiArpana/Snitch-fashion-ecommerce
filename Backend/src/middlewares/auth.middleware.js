import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'
import userModel from '../model/user.model.js'

export const authMiddleware = async(req,res,next)=>{
    const token = req.cookies.token
    try{
      if(!token){
        return res.status(401).json({
            message:'Unauthorized'
        })
    }
    const decoded = jwt.verify(token,config.JWT_SECRET_KEY)
    const user = await userModel.findById(decoded.id)
    if(!user){
        return res.status(401).json({
            message:'Unauthorized'
        })
    }
    if(user.role !== 'seller'){
        return res.status(403).json({
            message:'Forbidden'
        })
    }

    req.user = user
    next()

    }catch(err){
        console.log(err)
        res.status(401).json({
            message:'Unauthorized'
        })
    }

}

export const authenticateUser = async(req,res,next)=>{
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:'Token not provided'
        })
    }
    try{
        const dcecoded = jwt.verify(token,config.JWT_SECRET_KEY)
        const user = await userModel.findById(dcecoded.id)
        if(!user){
            return res.status(401).json({
                message:'unauthorized'
            })
        }
        req.user = user
        next()
    }catch(err){
        console.log(err);
        
    }
}