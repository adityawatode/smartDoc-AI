import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const assertCloudinaryConfig = () => {
  const missing = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
  ].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const error = new Error(`Missing Cloudinary environment variables: ${missing.join(", ")}`);
    error.statusCode = 500;
    throw error;
  }
};

export default cloudinary;
