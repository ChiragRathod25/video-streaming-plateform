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
import healthCheckRouter from "./routes/healthcheck.routes.js"
import userRouter from  "./routes/user.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/likes.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"



app.get('/', function (req, res) {
  res.send(`Hii \n Welcome to Chirag's Video steaming application`)
})

//routes declaration
app.use("/api/v1/users",userRouter) 
app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/commenets",commentRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/dashboard",dashboardRouter)


// export default express
export {app}