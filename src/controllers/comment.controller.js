import mongoose, { connect } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //Todo: get all comments for a video
  const { VideoId } = req.params;

  if (!VideoId || !ObjectId.isValid(VideoId))
    throw new ApiError(400, `Invalid Video request`);

  const { page = 1, limit = 10 } = req.query;

  const myAggregaterespose = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(VideoId),
      },
    },
    {
      $sort: {
        createdAt: -1, // to sort comments by descending order of creation date
      },
    },
  ]);
  const options = {
    page: page,
    limit: limit,
  };
  const commennts = await Comment.aggregatePaginate(
    myAggregaterespose,
    options
  );

  res
    .status(200)
    .json(new ApiResponse(200, commennts, `Comment fetched successfully`));
});

const addComment = asyncHandler(async (req, res) => {
  const { VideoId } = req.params;

  if (!VideoId || !ObjectId.isValid(VideoId))
    throw new ApiError(400, `Invalid Video request`);

  const userId = req.user?._id;

  const { content } = req.body;

  if (!content || content.trim() === "")
    throw new ApiError(400, `No comment content`);

  const comment = await Comment.create({
    content: content.trim(),
    video: ObjectId(VideoId),
    owner: ObjectId(userId),
  });

  if (!comment)
    throw new ApiError(500, "Something went wrong while adding comment");

  res
    .status(201)
    .json(new ApiResponse(200, comment, "comment added successfully"));
});

const updateComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    if(!commentId || !ObjectId.isValid(commentId))
        throw new ApiError(401,`Invalid comment update request`)

    const currentComment=await Comment.findById(commentId);
    if(!currentComment)
            throw new ApiError(404,`Comment not found`)
    
    const {content}=req.body;

    if(content.trim()===currentComment.content )
        throw new ApiError(401,`No changes to update`)

    if(!content || content.trim()==="")
        throw new ApiError(401,`No comment content to update`)

    currentComment.content=content.trim();
    await currentComment.save({validateBeforeSave:false});
    res
    .status(200)
    .json(new ApiResponse(200,currentComment,`comment updated successfully`));
})
const deleteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    if(!commentId || ObjectId.isValid(commentId))
            throw new ApiError(400,`Invalid comment request`)
    await Comment.findByIdAndDelete(commentId);
    
    res
    .status(200)
    .json(new ApiResponse(200,null,`Comment deleted successfully !!`))
})

export { getVideoComments,addComment,updateComment,deleteComment };
