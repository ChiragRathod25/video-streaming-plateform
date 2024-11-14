import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //for file system
// import { extractPublicId } from "cloudinary-build-url";
import { ApiError } from "../utils/ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (uploadFilePath) => {
  try {
    if (!uploadFilePath) return null;
    const response = await cloudinary.uploader
      .upload(uploadFilePath, {
        resource_type: "auto",
      })
      .catch((error) => {
        console.log(error);
      });
    //file has been uploaded successfully
    // console.log(`file is uploaded on cloudinary : ${response.url}`)
    fs.unlinkSync(uploadFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(uploadFilePath); //remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteMediaOnCloudinary = async (deleteMediaURL) => {
  try {
    console.local(deleteMediaURL)
    if (!deleteMediaURL) return null;
    const publicId = await extractPublicId(deleteMediaURL);
    console.log(publicId);
    
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });
    
    if (!response) {
      throw new ApiError(
        401,
        `Error while deleting old image form storage server`
      );
    }
    
    console.log(`Delete media response from cloudinary : \n${response}`);
    
    return response;
  } catch (error) {
    throw new ApiError(400, `something went wrong while deleting media`,error);
  }
};

export { uploadOnCloudinary,deleteMediaOnCloudinary };
