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
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"))  //configuration to store public available files such as favicon,etc
 
app.use(cookieParser()) //to manage cookie on user's browser



//routes import
import userRouter from  "./routes/user.routes.js"
import commentRouter from "./routes/comment.routes.js"

app.get('/', function (req, res) {
  res.send(`Hii \n Welcome to Chirag's application`)
})

//routes declaration
app.use("/api/v1/users",userRouter)  //https:localhost:8000/api/v1/users/register
app.use("/api/v1/commenets",commentRouter)


// export default express
export {app}