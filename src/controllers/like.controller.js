import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //toggle like on video
  const { videoId } = req.params;
  if (!videoId || !Object.isValid(videoId))
    throw new ApiError(401, `Invalid video like request`);

  const likedVideo = await Like.findOne({
    likedBy: ObjectId(req.user?._id),
    video: ObjectId(videoId),
  });

  try {
    if (likedVideo) {
      const result = await Like.deleteOne({ _id: likedVideo?._id });
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    } else {
      const newVideoLike = await Like.create({
        likeBy: ObjectId(req.user?._id),
        video: ObjectId(videoId),
      });
      if (!newVideoLike) throw new ApiError(`New like creation on video failed`);
    }
  } catch (error) {
    console.error(`Error while toggling like on video`, error);
    throw new ApiError(`Error occured while toggle video like`);
  }

  res.status(200).json(new ApiResponse(
    `toggled like on video successfully !!`
  ));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //toggle like on comment
  const {commentId}=req.params
  if(!commentId || !Object.isValid(commentId))
    throw new ApiError(401,`Invalid comment like request`)
  const likedComment=await Like.findOne({
    likedBy:ObjectId(req.user?._id),
    comment:ObjectId(commentId)
  })
  try {
    if(likedComment){
        const result=await Like.deleteOne({_id:likedComment?._id})
        if(result.deletedCount===1){
            console.log(`Successfully deleted one document`)
        }else{
            console.log("No documents matched the query. Deleted 0 documents.");
        }
    }else{
        const newLikedComment=await Like.create({
            comment:ObjectId(commentId),
            likedBy:ObjectId(req.user?._id)
        })
        if(!newLikedComment)
            throw new ApiError(401,`New like creation on comment failed`)
    } 
  } catch (error) {
    console.error(`Error while toggling like on comment`,error)
    throw new ApiError(401,`Error occured while toggling like on comment`)
  }
  res
  .status(200)
  .json(new ApiResponse(200,'toggled like on comment successfully !!'))
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId}=req.params
    if(!tweetId || !Object.isValid(tweetId))
        throw new ApiError(401,`Invalid tweet like requst`)
    const likedTweet=await Like.findOne({
        likedBy:ObjectId(req.user?._id),
        tweet:ObjectId(tweetId)
    })
    try {
        if(likedTweet){
            const result=await Like.deleteOne({_id:likedTweet._id})
            if(result.deletedCount===1){
                console.log(`Successfully deleted one document`)
            }else{
                console.log("No documents matched the query. Deleted 0 documents.");
            }
        }else{
            const newLikedTweet=await Like.create({
                likeBy:ObjectId(req.user?._id),
                tweet:ObjectId(tweetId)
            })
            if(!newLikedTweet)
                    throw new ApiError(401,`New like creation on tweet failed`)
        }
    } catch (error) {
        console.error(`Error while toggling like on tweet`,error)
        throw new ApiError(401,`Error occured while toggling like on tweet`)  
}
res
.status(200)
.json(new ApiResponse(200,`toggled like on tweet successfully !!`))

});

const getLikedVideo = asyncHandler(async (req, res) => {
    try {
        const likedVideos=await Like.aggregate([
            {
                $match:{
                    likedBy:ObjectId(req.user?._id),
                    video:{$exits:true}
                }
            },
            {
                $lookup:{
                    from:"Video",
                    foreignField:"_id",
                    localField:"video",
                    as:"likedVideos",
                    pipeline:[
                        {
                            $project:{
                                _id:1,
                                videofile:1,
                                thumbnail:1,
                                title:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    likedVideoCount:{$size:"$likedVideos"}
                }
            }
        ])

        res
        .status(200)
        .json(new ApiResponse(200,`Liked video fetched successfully !!`,likedVideos))
    } catch (error) {
        throw new ApiError(401,`Error while getting liked video`)
    }
    
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideo };
