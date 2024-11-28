import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet=asyncHandler(async(req,res)=>{
    const {content}=req.body;
    if(!content)
        throw new ApiError(404,`Tweet content is required for new tweet`)
    const createdTweet=await Tweet.create(
        {
            content:content,
            owner:ObjectId(req.user?._id)
        }
    )
    if(!createdTweet)
        throw new ApiError(404,`Tweet creation error`)
    res
    .status(200)
    .json(new ApiResponse(200,createdTweet,`New tweet creation successfully !!`))
})
const getUserTweets=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    if(!userId || ObjectId.isValid(userId))
        throw new ApiError(404,`Invalid user id request`)
    const user=await User.findById(ObjectId(userId))
    if(!user)
            throw new ApiError(404,`User not found`)

    const tweets=await Tweet.find({owner:ObjectId(userId)});
    if(!tweets)
        throw new ApiError(404,`No Tweets found`)

    res
    .status(200)
    .json(new ApiResponse(200,tweets,`user tweets fetched successfully !!`))
})
const updateTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params;
    const {content}=req.body
    if(!tweetId || ObjectId.isValid(tweetId))
        throw new ApiError(404,`Invalid tweet request`)
    if(!content || !content.trim())
        throw new ApiError(404,`Content is required to update`)
    
    const tweet=await Tweet.findById(ObjectId(tweetId))
    if(!tweet)
        throw new ApiError(404,`Tweet not found`)
    if(tweet.content!=content){
        tweet.content=content;
        tweet.save({validateBeforeSave:false})
    }
    res
    .status(200)
    .json(new ApiResponse(200,tweet,`Tweet updated successfully !!`))
})
const deleteTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    if(!tweetId || ObjectId.isValid(tweetId))
        throw new ApiError(404,`Invalid tweet request`)
    await Tweet.deleteOne({_id:ObjectId(tweetId)})
    res
    .status(200)
    .json(new ApiResponse(200,null,`Tweet deleted successfully !!`))
})

export{createTweet,getUserTweets,updateTweet,deleteTweet}