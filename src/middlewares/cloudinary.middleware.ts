import fileUpload from "express-fileupload";
import { PATH_TEMP_IMAGES } from "../configs";

export const uploadImages = fileUpload({
  useTempFiles: true,
  tempFileDir: `./${PATH_TEMP_IMAGES}`,
});
