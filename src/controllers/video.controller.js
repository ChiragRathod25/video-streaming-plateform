import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !ObjectId.isValid(videoId))
    throw new ApiError(404, `Invalid video request`);

  const video = await Video.findById(
    { 
        _id: ObjectId(videoId) 
    }
  );

  if (!video ) 
    throw new ApiResponse(404, `Video not found`);
  if(!video.isPublished)
    throw new ApiError(404,`Video is not published by the channel owner`)
  res
    .status(200)
    .json(new ApiResponse(200, video, `Video fetched successfully !!`));
});

//TODO: Stream video as user is playing it, to reduce the bandwidth => getVideoById
export { getVideoById };
