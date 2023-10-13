import { Router } from "express";
import { userController } from "../controllers/";
import { isAuthenticated, uploadImages } from "../middlewares";
import fileUpload from "express-fileupload";
import { PATH_TEMP_IMAGES } from "../configs";

const userRouter: Router = Router();

userRouter.get("/", isAuthenticated, userController.getAllUsers);
userRouter.get("/:username", userController.getOneUserByUsername);
userRouter.put(
  "/:id",
  isAuthenticated,
  fileUpload({
    useTempFiles: true,
    tempFileDir: `./${PATH_TEMP_IMAGES}`,
  }),
  userController.updateUser
);
userRouter.delete("/:id", isAuthenticated, userController.deleteUser);

export default userRouter;
