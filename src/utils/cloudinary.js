import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //filesystem built in with node js to tackle files

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) 
      return null;
       //upload file on clodinary
  const response= await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      })
      //file has been successfully uploaded
    console.log("file is upload on cloudinary",response.url);
    fs.unlinkSync(localFilePath)

    return response;
    }
   catch (error) {
   fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed
   return null;
    
}
};
export {uploadOnCloudinary}