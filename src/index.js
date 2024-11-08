import connectDB from "./db/index.js";
import { app } from "./app.js";
connectDB()
.then(() => {
    try {
      app.listen(process.env.PORT, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
      });
    } catch (error) {
      console.log(`Error while starting the server : `,error);
    }
  })
.catch((err) => {
    console.log("MONGODB CONNECTION FAILED !! \nError :", err);
  });

/*
import express from 'express';
const app=express()
//one way to connect mongoose database
;(async ()=>{
    try{    
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("Error : ",error)
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.error("Error : ",error);
    }
})()
    */
