import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary, uploader, config } from "cloudinary";


export const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
   
  });

  next();
};

export { uploader, cloudinary };
