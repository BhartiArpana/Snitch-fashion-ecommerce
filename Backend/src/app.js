import express from "express";
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import cors from 'cors'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import {config} from './config/config.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import {fileURLToPath} from 'url'   
import path from 'path'


const app= express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.join(__dirname, '../public')

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(passport.initialize())
app.use(cors({
    origin:[
        'https://snitch-fashion-ecommerce-2.onrender.com',
        'http://localhost:5173'
    ],

    methods:['GET','POST','PUT','DELETE','PATCH'],
    credentials:true
}))
app.use(express.static(publicDir))

passport.use(new GoogleStrategy({
    clientID : config.CLIENT_ID,
    clientSecret : config.CLIENT_SECRET,
    callbackURL : '/api/auth/google/callback'
},(accessToken, refreshToken, profile, done)=>{
   return done(null,profile)
})
)

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/wishlist',wishlistRoutes)

app.get('*name',(_req,res)=>{
    res.sendFile(path.join(publicDir,'index.html'))
})

export default app