import express from "express";
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import cors from 'cors'

const app= express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE','PATCH'],
    credentials:true
}))

app.use('/api/auth',authRoutes)

export default app