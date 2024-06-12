import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";

import { response } from "express";

const generateRefreshAndAccessToen= async (userId)=>{
  try {
    const user= await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken=refreshToken //store into model
    await user.save({validateBeforeSave:false})  //update database

    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating refresn and access token")
  }
}

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
  const existedUser =await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exist with same username or email");
  }

  //check for images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log(req.files);
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required ");
  
  let coverImageLocalPath;
  if(req.files &&Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0]?.path;
  }
  
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
        username:username.toLowerCase(),
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

const loginUser=asyncHandler(async(req,res)=>{
  //req body ->data
  //get data : username and email
  //find the user
  //check password
  //access and refresh token  generate
  //send cookie
  const {username,email,password}=req.body
  if(!(username||email)){
    throw new ApiError(400,"username or email is required")
  }
  const user =await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404,"User not exist")
  }
  const isPasswordValid=await user.isPasswordCorrect(password) 
  
  if (!isPasswordValid) {
    throw new ApiError(401,"Invalid user credentials")
  }

  //generating tokens and de-structure it
  const {accessToken,refreshToken}=await generateRefreshAndAccessToen(user._id)
  
  //update or make new query to update refreshtoken into user
  //here we make new database query
  const loggeInUser=await User.findById(user._id)
  .select("-password -refreshToken")

  //cookie setup
  const options={
    httpOnly:true,  //cookies are modified by server only, not frontend user
    secure:true ,
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggeInUser,accessToken,refreshToken
      },
      "User logged in successfully"
    )
  )

})

const logoutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id, 
    {
      $set:{
        refreshToken:1
      }
    },
    {
      new:true
    }
  )
  const options={
    httpOnly:true,  //cookies are modified by server only, not frontend user
    secure:true 
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(
      200,
      {},
      "User logged Out"
    )
  )
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401,"Something went wrong while getting refresh Token(unauthorized request)")
  }
    try {
      const decodedToken=jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      )
      const user=await User.findById(decodedToken?._id)
      if(!user){
        throw new ApiError(401,"Invalid refresh token")
      }
  
      if(incomingRefreshToken !==user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired or used")
      }
      const options={
        httpOnly:true,
        secure:true
      }
      
      const {accessToken,newRefreshToken}=await generateRefreshAndAccessToen(user._id);
      
      return res
      .status(200)
      .cookie("refreshToken",accessToken,options)
      .cookie("refreshToken",newRefreshToken,options)
      .json(
        new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"Access Token refreshed")
      )
    } catch (error) {
      throw new ApiError(400,error?.message||"Invalid refreshToken")
    }
})
export { registerUser,loginUser,logoutUser,refreshAccessToken };
