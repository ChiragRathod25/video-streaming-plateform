import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

import { response } from "express";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if user already exist - check username,email
  //check for images, check for  avatar
  //upload them to cloudinary,avatar check
  //create user object - create entry in DB
  //remove password and refresh token field from response
  //check for user creation
  //return respose

  //get user details from user
  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check user already exist or not
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exist with same username or email");
  }

  //check for images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log(req.files);
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required ");
  
  //upload to cloudinary
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverImageLocalPath)

  //check status
  if (!avatar) throw new ApiError(400, "Avatar is required ");

  //DB entry
  const user=await User.create(
    {
        fullname,
        avatar:avatar.url,
        email,
        password,
        username:username.tolowerCase(),
        coverImage:coverImage?.url || "" //take url is available, else ""
    })

    //remove password and refreshToken from response
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    //error if not created
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }
    else{
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
        )
    }


});

export { registerUser };
