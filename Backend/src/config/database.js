import mongoose from "mongoose";
import {config} from './config.js'

const connectToDb = async()=>{
    try{
        await mongoose.connect(config.MONGO_URI)
    }catch(err){
        console.error('Database connection failed ')
        throw err
    }finally{
        console.log('Database connected successfully ')
    }
}

export default connectToDb