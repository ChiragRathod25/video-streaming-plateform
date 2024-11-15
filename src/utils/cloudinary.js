import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //for file system
import { extractPublicId } from "cloudinary-build-url";
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
    if (!deleteMediaURL) return null;
   
      //console.log(`DeleteMediaURL:`, deleteMediaURL);

      const publicId = extractPublicId(deleteMediaURL);

     // console.log(`Extracted public id:`,publicId);

      //cloudinary deletion
    const response = await cloudinary.uploader.destroy(publicId);

    //cloudinary deletion respose
    //console.log(`Cloudinary deletion respose: `,response)

    if (response.result!=="ok") {
      throw new ApiError(
        500,
        `Error while deleting old image form storage server`
      );
    }

    return response;
  } catch (error) {
    console.error(`Error during media deletion `,error)
    throw new ApiError(400, `Media deletion error`, error);
  }
};

export { uploadOnCloudinary, deleteMediaOnCloudinary };
