import dotenv from 'dotenv'

dotenv.config()
if(!process.env.PORT){
    throw new Error('Port is not defined in the environment variables')
}
if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI is not defined in the environment variables')
}
if(!process.env.JWT_SECRET_KEY){
    throw new Error('JWT_SECRET_KEY is not defined in the environment variables`')
}

export const config = {
    PORT: process.env.PORT || 3000,
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY
}