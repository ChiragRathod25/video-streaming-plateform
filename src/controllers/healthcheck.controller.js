import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const healthCheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
    const db=mongoose.connection
    const dbState=db.readyState===1?"Up":"Down";
    const healthCheck={
        uptime:process.uptime(),
        message:'Ok',
        timestamp:Date.now(),
        db:dbState
    }
    if(dbState==="Up"){
        res
        .status(200)
        .json(new ApiResponse(200,healthCheck,`Hurray !! Health is perfect !!`))
    }else {
        healthCheck.message="Error";
        res
        .status(new ApiResponse(503,healthCheck,`Health is not good`))
    }
});

export { healthCheck };
