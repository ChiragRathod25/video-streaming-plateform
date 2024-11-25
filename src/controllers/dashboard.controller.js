import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const getChannelStats=asyncHandler(async(req,res)=>{
      // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
        //1DB call : get all videos and count their total views, no of videos, or directly do the addition of number of videos and sum of view  of selected video with database query and get it
        //2DB call : get total subscribers count
        //3DB call : get total likes count
        //4DB call : get total comments count
        //5DB call : get total tweets count
        //make one stats object of all this info and return it
})

const getChannelVideos=asyncHandler(async(req,res)=>{
    // TODO: Get all the videos uploaded by the channel
    const {channelId}=req.params
    if(!channelId || !Object.isValid(channelId))
        throw new ApiError(404,`Invalid channel request`)
    const videos=await Video.find({owner:ObjectId(channelId)}).select("-videoFile -description")
    if(!video)
        throw new ApiError(404,`No Video found`)
    res
    .status(200)
    .json(new ApiResponse(200,videos,`channel videos are fetched successfully !!`))
})

export{getChannelVideos}