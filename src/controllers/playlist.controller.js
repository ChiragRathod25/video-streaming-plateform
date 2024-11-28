import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    throw new ApiError(
      404,
      `Name and description are must required for playlist creation`
    );

  const createdPlaylist = await Playlist.create({
    name,
    description,
    owner: ObjectId(req.user?._id),
  });
  if (!createPlaylist)
    throw new ApiError(404, `Error while creating new playlist instance`);

  res
    .status(200)
    .json(
      new ApiResponse(200, createPlaylist, `playlist creation successfully !!`)
    );
});
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

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  if (!videoId || ObjectId.isValid(videoId))
    throw new ApiError(404, `Invalid playlist request`);

  if (!playlistId || !ObjectId.isValid(playlistId))
    throw new ApiError(404, `Invalid video request`);

  const playlist = await Playlist.findById(ObjectId(playlistId));
  if (!playlist) 
    throw new ApiError(404, `playlist not found`);

  const video = await Video.findById(ObjectId(videoId));
  if (!video) 
    throw new ApiError(404, `video not found`);

  const updatedPlaylist = await Playlist.updateOne(
    { 
      _id: ObjectId(playlistId) 
    },
    {
      $pull:{videos:ObjectId(videoId)}
    }
  );

  if(!updatePlaylist)
      throw new ApiError(404,`Video updation error`)

  res
  .status(200)
  .json(new ApiResponse(200,updatePlaylist,`Video removed successfully !!`))
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if(!playlistId || ObjectId.isValid(playlistId))
      throw new ApiError(404,`Invalid playlist requst`)
  await Playlist.deleteOne(
    {
      _id:ObjectId(playlistId)
    }
  )
  res
  .status(200)
  .json(new ApiResponse(200,"",`playlist deleted successfully !!`))
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const {playlistId}=req.params
  const {name,description}=req.body
  if(!playlistId || !ObjectId.isValid(playlistId))
     throw new ApiError(`Invalid playlist request`)

  if(!name && !description)
      throw new ApiError(404,`name or description are requires to change it`)
  
  const playlist=await Playlist.findById(ObjectId(playlistId))
  if(!playlist)
      throw new ApiError(404,`playlist not found`)
  if(name)
      playlist.name=name;
  if(description)
      playlist.description=description
  playlist.save({validateBeforeSave:false})

  res
  .status(200)
  .json(new Apiresponse(200,playlist,`Playlist updated successfully !! `))

});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
};
