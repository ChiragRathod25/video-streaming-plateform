import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  //1DB call : get all videos and count their total views, no of videos, or directly do the addition of number of videos and sum of view  of selected video with database query and get it
  //2DB call : get total subscribers count
  //3DB call : get total likes count
  //4DB call : get total comments count
  //5DB call : get total tweets count
  //make one stats object of all this info and return it
  const { channelId } = req.params;
  if (!channelId || !ObjectId.isValid(channelId))
    throw new ApiError(`Invalid channel requst`);
  const channel = await User.findById({
    _id: ObjectId(channelId),
  });
  if (!channelId) throw new ApiError(404, `Channel not found`);
  const stats = await Video.aggregate([
    {
      $match: {
        owner: ObjectId(channelId),
      },
    },
    {
      //get totalViews and totalVideos
      $group: {
        _id: null,
        totalViews: {
          $sum: "$views",
        },
        totalVideos: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        //match the video
        from: "videos",
        pipeline: [
          {
            $match: {
              owner: ObjectId(channelId),
            },
          },
        ],

        //to get total likes of the video
        pipeline: [
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "video",
              as: "likedVideos",
            },
          },
          {
            $count: "TotalLikedVideos",
          },
        ],

        //get total comments of the video
        pipeline: [
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "video",
              as: "videoComments",
            },
          },
          {
            $count: "TotalVideoComments",
          },
        ],

        //to get total subscriber
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "owner",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $count: "TotalSubscribers",
          },
        ],
      },
      as: "statDetails",
    },
  ]);
  if (!stats) throw new ApiError(404, `Error while fetching channel States`);
  res
    .status(200)
    .json(new ApiResponse(200, stats, `Channel stats fetched successfully !!`));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;
  if (!channelId || !Object.isValid(channelId))
    throw new ApiError(404, `Invalid channel request`);
  const videos = await Video.find({ owner: ObjectId(channelId) }).select(
    "-videoFile -description"
  );
  if (!video) throw new ApiError(404, `No Video found`);
  res
    .status(200)
    .json(
      new ApiResponse(200, videos, `channel videos are fetched successfully !!`)
    );
});

export { getChannelVideos,getChannelStats };
