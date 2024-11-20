import mongooes from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId || ObjectId.isValid(userId))
    throw new ApiError(201, `Invalid user id`);
  const playlists = await Playlist.find({ owner: ObjectId(userId) });

  if (!playlists) throw new ApiError(404, `playlists not found`);

  res
    .status(200)
    .json(new ApiResponse(200, playlists, `Playlists fetched successfully !!`));
});
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || ObjectId.isValid(playlistId))
    throw new ApiError(401, `Invalid playlist request`);

  const playlist = await Playlist.findById(ObjectId(playlistId));

  if (!playlist) throw new ApiError(404, `Playlist not found`);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        `Playlist information fetched successfully !!`
      )
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  if (!playlistId || ObjectId.isValid(playlistId))
    throw new ApiError(401, `Invalid playlist request`);

  if (!videoId || ObjectId.isValid(videoId))
    throw new ApiError(401, `Invalid video request`);

  const playlist = await Playlist.findById(ObjectId(playlistId));
  if (!playlist) throw new ApiError(404, `Playlist not found`);

  const video = await Video.findById(ObjectId(videoId));
  if (!video)
    throw new ApiError(404, `Invalid request to add video to the playlist`);

  const updatedPlaylist = await Playlist.updateOne(
    { _id: ObjectId(videoId) },
    {
      $push: { videos: ObjectId(videoId) },
    }
  );
  if (!updatedPlaylist) throw new ApiError(404, `video updation error`);

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, `Playlist updated successfully !!`)
    );
});
export { getUserPlaylists, getPlaylistById };
