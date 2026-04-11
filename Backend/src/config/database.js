import mongoose from "mongoose";
import {config} from "./config.js";

const connectToDb = async()=>{
    mongoose.connect(config.MONGO_URI)
    .then(()=>{
        console.log("Connected to database");
    })
}

export default connectToDb