import mongoose, { connect, mongo } from "mongoose";
import { DB_NAME } from "../constants.js";
import  'dotenv/config';

import express from 'express';
const app=express()

const connectDB=async ()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connected !! DB HOST : ${connectionInstance.connection.host}`)
        // console.log(connectionInstance)
        
        //to listen error
        app.on("error",()=>{
            console.log("Error occurred: ",error)
            throw error; 
         })
         const port = process.env.PORT || 8000;
        app.listen(port,()=>{
            console.log(`App is listening on port : ${port}`)
        }) 
    }
    catch(error){
        console.log(`Error connection failed: `,error)
        process.exit(1);
    }
}
export default connectDB