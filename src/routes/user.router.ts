import { Router } from "express";
import { userController } from "../controllers/";
import { isAuthenticated, uploadImages } from "../middlewares";

const userRouter: Router = Router();

userRouter.get("/", isAuthenticated, userController.getAllUsers);
userRouter.get("/:username", userController.getOneUserByUsername);
userRouter.put(
  "/:id",
  isAuthenticated,
  uploadImages,
  userController.updateUser
);
userRouter.delete("/:id", isAuthenticated, userController.deleteUser);

export default userRouter;
