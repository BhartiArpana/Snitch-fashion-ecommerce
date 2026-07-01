
import app from './src/app.js'
import connectDb from './src/config/database.js'
import {config} from './src/config/config.js'

await connectDb()

app.listen(config.PORT,()=>{
    console.log(`Server is running on port ${config.PORT}`)
})