import { Router } from "express";
import { userController } from "../controllers/";
import { isAuthenticated } from "../middlewares";

const userRouter: Router = Router();

userRouter.get("/", isAuthenticated, userController.getAllUsers);
userRouter.get("/:username", userController.getOneUserByUsername);
userRouter.put("/:id", isAuthenticated, userController.updateUser);
userRouter.delete("/:id", isAuthenticated, userController.deleteUser);

export default userRouter;
