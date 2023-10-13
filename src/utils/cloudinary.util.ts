import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { CLOUDINARY, PATH_CLOUDINARY_IMAGES } from "../configs";

cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
  secure: true,
});

export const uploadImage = async (
  filePath: string
): Promise<UploadApiResponse> => {
  return await cloudinary.uploader.upload(filePath, {
    folder: PATH_CLOUDINARY_IMAGES,
  });
};

export const deleteImage = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId);
};