import mongooes from "mongoose"
import {Playlist,} from "../models/playlist.model.js"

import {ApiError} from "../utils/ApiError.js"
import { ApiResponse} from "../utils/Apiresponse.js" 
import {asyncHandler} from "../utils/asyncHandler.js"

const getUserPlaylists=asyncHandler(async(req,res)=>{
    const {userId}=req.params;
    if(!userId || Object.isValid(userId))
            throw new ApiError(201,`Invalid user id`)
    const playlists=await Playlist.find({owner:ObjectId(userId)})
    
    res
    .status(200)
    .json(new ApiResponse(200,playlists,`Playlists fetched successfully !!`))
})
export {getUserPlaylists}