import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

//configure server to allow CORS requests from the origin specified
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//to allow data from JSON
app.use(express.json({
    limit:"16kb"
}))
//it allows data passing through URL via express
app.use(express.urlencoded({
    extended:true,limit:"16kb"
}))
app.use(express.static("public"))  //configuration to store public available files such as favicon,etc
 
app.use(cookieParser()) //to manage cookie on user's browser
// export {app}
export default express