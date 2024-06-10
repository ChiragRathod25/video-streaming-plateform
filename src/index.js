import { config } from 'dotenv';
config({ path: './env' });

import mongoose  from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

connectDB();
















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