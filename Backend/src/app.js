import express from "express";
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import cors from 'cors'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import {config} from './config/config.js'

const app= express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(passport.initialize())
// app.use(cors({
//     origin:'http://localhost:5173',
//     methods:['GET','POST','PUT','DELETE','PATCH'],
//     credentials:true
// }))
passport.use(new GoogleStrategy({
    clientID : config.CLIENT_ID,
    clientSecret : config.CLIENT_SECRET,
    callbackURL : '/api/auth/google/callback'
},(accessToken, refreshToken, profile, done)=>{
   return done(null,profile)
})
)

app.use('/api/auth',authRoutes)

export default app