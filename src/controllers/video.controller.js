import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  if (!query) throw new ApiError(404, `Invalid query request`);

  //here, check user doesn't mandatory all the time becase already we are using verifyJWT middleware
  if (!userId || !ObjectId.isValid(userId))
    throw new ApiError(404, `Invalid user request`);

  if (!sortType || sortType != 1 || sortType != -1) {
    //default set to ascending
    sortType = 1;
  }

  if (!sortBy) {
    sortBy = "Relevance";
  }
  if (sortBy === "Upload date") sortBy = "createdAt";
  else if (sortBy === "View count") sortBy = "views";

  //here is the article that explains search query implementation very well
  //1. https://medium.com/@aniagudo.godson/running-a-simple-search-query-on-mongodb-atlas-using-express-nodejs-1-making-basic-queries-a426e2bd9478
  //2. https://medium.com/@aniagudo.godson/running-a-simple-search-query-on-mongodb-atlas-using-express-nodejs-2-refining-search-queries-49949ce5c4a1

  const notPermittedWords = ["if", "for"];

  //separate all the words of the string and make query string
  const queryString = query.split(" ");
  let allQueries = [];
  queryString.forEach((element) => {
    // to exculde not permitted words for the search
    //if(!notPermittedWords.includes(element))

    //creating array of queries to search
    allQueries.push({
      title: { $regex: String(element) },
      isPublished: true,

      //to perform search and description both together
      /* $or:[
              {
                title: { $regex:String(element)}
              },
              {
                description:{$regex:String(element)}
              }
            ]*/
    });
  });

  const allVideos = await Video.find({
    $or: allQueries,
  }).sort({ sortBy: sortType });
  if (!allVideos) throw new ApiError(404, `No video found`);

  const options = {
    page: page,
    limit,
  };

  const allFetchedVideosList = await Video.aggregatePaginate(
    allVideos,
    options
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, allFetchedVideosList, `Videos fetched successfully`)
    );
});

const publishVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description } = req.body;
  if (!title || !description)
    throw new ApiError(404, `title and descriptions are required`);

  //uploading videoFile

  const videoLocalPath = req.files.videoFile[0].path;
  if (!videoLocalPath) throw new ApiError(404, `Video files is required`);

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  if (!videoFile || !videoFile.url)
    throw new ApiError(500, `Error while uploading file on cloudinary`);

  const duration = videoFile.duration;

  //uploading thumbnail
  const thumbnailLocalPath = req.files.thumbnail[0]?.path;
  if (!thumbnailLocalPath) throw new ApiError(404, `thumbnail is required`);

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail || !thumbnail.url)
    throw new ApiError(`Error while uploading thumbnail on cloudinary`);

  //creating video document
  // console.log(typeof req.user?._id);
  const addVideo = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: req.user?._id,
    title,
    description,
    duration,
  });

  if (!addVideo)
    throw new ApiError(
      404,
      `something went wrong while creating video document`
    );
  res
    .status(200)
    .json(new ApiResponse(200, addVideo, `Video published successfully !!`));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !ObjectId.isValid(videoId))
    throw new ApiError(404, `Invalid video request`);

  const video = await Video.findById({
    _id: videoId,
  });

  if (!video) throw new ApiResponse(404, `Video not found`);
  if (!video.isPublished)
    throw new ApiError(404, `Video is not published by the channel owner`);
  res
    .status(200)
    .json(new ApiResponse(200, video, `Video fetched successfully !!`));
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !ObjectId.isValid(videoId))
    throw new ApiError(404, `Invalid video request`);

  const thumbnailLocalPath = req.file?.path;
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  // console.log(thumbnail);

  if (!thumbnail || !thumbnail.url)
    throw new ApiError(404, `Error while updating thumbnail on cloudinary`);
  const video = await Video.findByIdAndUpdate(
    {
      _id: videoId,
    },
    {
      thumbnail: thumbnail.url,
    },
    {
      new: true,
    }
  );
  // console.log(video);

  if (!video) throw new ApiError(404, `Error while updating video thumbnail`);
  res
    .status(200)
    .json(
      new ApiResponse(200, video, `Video thumbnail updated successfully !!`)
    );
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description
  const { videoId } = req.params;
  if (!videoId || !ObjectId.isValid(videoId))
    throw new ApiError(404, `Invalid video request`);

  
  const { title, description } = req.body;
  if (!title && !description)
    throw new ApiError(404, `title or descriptions are reuired to update`);

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, `Video not found`);

  if (title && title.trim() != "" && title != video.title)
    video.title = title;
  if (
    description &&
    description.trim() != "" &&
    description != video.description
  )
    video.description = description;

  video.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(404, video, `Video details updated successfully!!`));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  const { videoId } = req.params;
  if (!videoId || !ObjectId.isValid(videoId))
    throw new ApiError(404, `Invalid video request`);
  const response = await Video.findByIdAndDelete(videoId);

  if (!response) throw new ApiError(404, `Error while deleting the video`);
  // console.log(response) //entire deleted video object

  res
    .status(200)
    .json(new ApiResponse(200, null, `Video deleted successfully !!`));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !ObjectId.isValid(videoId))
    throw new ApiError(404, `Invalid video request`);
  const toggleVideoPublishStatus = await Video.findOneAndUpdate(
    {
      _id: videoId,
    },
    [
      {
        $set: {
          // isPublished: {
          //   $cond: { if: "$isPublished", then: false, else: true },
          // },
          isPublished: { $not: "$isPublished" },
        },
      },
    ],
    { new: true }
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        toggleVideoPublishStatus,
        `video's publish status toggled successfully !!`
      )
    );
});

//TODO: Stream video as user is playing it, to reduce the bandwidth => getVideoById
export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideoThumbnail,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
};
