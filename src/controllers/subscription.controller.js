import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription =asyncHandler(async(req,res)=>{
    //check subscribed or not
    //if subscribed that means document is exist in the collection , so remove it
    // if not exist that means user is not subscribed to channed, create new document and add it
    const {channelId}=req.params
    if(!channelId || !ObjectId.isValid(channelId))
        throw new ApiError(404,`Invalid channed request`)
    const subscribedCheck=await Subscription.find(
        {
            subscriber:ObjectId(req.user?._id),
            channel:ObjectId(channelId)
        }
    )
    let isSubscribed;
    if(!subscribedCheck){
        //user is not subscribed, so create new document
        const subscriberAdded=await Subscription.create(
            {
                subscriber:ObjectId(req.user?._id),
                channel:ObjectId(channelId)
            }
        )
        if(!subscriberAdded)
                throw new ApiError(404,`Error while adding subscriber`)
        isSubscribed=true;
        
    }else{
        //delete existing document
        const deleteSubscription=await Subscription.deleteOne(
            {
                _id:subscribedCheck._id
            }
        )
        if(deleteSubscription)
            throw new ApiError(404,`Error while removing subscriber`)
        isSubscribed=false;
    }
    res
    .status(200)
    .json(new ApiResponse(200,isSubscribed,`Subscription toggeled successfully !!`))
})
const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    if(!channelId || ObjectId.isValid(channelId))
        throw new ApiError(404,`Invalid channel request`)
    const subscribers=await Subscription.aggregate([
        {
            $match:{channelId:ObjectId(channelId)}
        },
        {
            $lookup:{
                from:"User",
                localField:"subscriber",
                foreignField:"_id",
                as: "subscribers",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            username:1,
                            avatar:1,
                            fullname:1
                        }
                    }
                ]
            }
        }
    ])
    res
    .status(200)
    .json(new ApiResponse(200,subscribers,`Subscribers fetched successfully !!`))
})
const getSubscribedChannels=asyncHandler(async(req,res)=>{
    const {subscriberId}=req.params
    if(!subscriberId || !ObjectId.isValid(subscriberId))
        throw new ApiError(404,`Invalid subscriber request`)
    const subscribedChannels=await Subscription.aggregate([
        {
            $match:{
                subscriber:ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"User",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedChannelList",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            username:1,
                            fullname:1,
                            avatar:1
                        }
                    }
                ]
            }
        }
    ])
    res
    .status(200)
    .json(new ApiResponse(200,subscribedChannels,`Subscribed channels fetched successfully !!`))
})

export {toggleSubscription,getUserChannelSubscribers,getSubscribedChannels}