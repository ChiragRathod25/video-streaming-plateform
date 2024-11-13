import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments=asyncHandler(async (req,res)=>{
    //Todo: get all comments for a video
    const {VideoId}=req.params

    if(!VideoId || !ObjectId.isValid(VideoId))
            throw new ApiError(400,`Invalid Video request`)
    
    const {page=1,limit=10}=req.query

    const myAggregaterespose=await Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(VideoId),
            }
        },
        {
            $sort:{
                createdAt:-1 // to sort comments by descending order of creation date
            }
        }
    ])
    const options={
        page:page,
        limit:limit
    }
    const commennts=await Comment.aggregatePaginate(myAggregaterespose,options);

    res
    .status(200)
    .json(new ApiResponse(200,commennts,`Comment fetched successfully`))
})

export {getVideoComments}