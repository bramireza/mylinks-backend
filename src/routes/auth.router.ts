import { Router } from "express";
import { authController } from "../controllers/";
import { isAuthenticated } from "../middlewares";

const authRouter: Router = Router();

authRouter.post("/signin", authController.signIn);
authRouter.post("/signup", authController.signUp);
authRouter.post("/refreshtoken", authController.refreshToken);
authRouter.post(
  "/revoketokens",
  isAuthenticated,
  authController.revokeRefreshTokens
);
authRouter.get("/me", isAuthenticated, authController.me);
authRouter.post("/logout", authController.logout);

export default authRouter;
