import { Router } from "express";
import { linkController } from "../controllers/";
import { isAuthenticated } from "../middlewares";

const linkRouter: Router = Router();

linkRouter.post("/", isAuthenticated, linkController.createLink);
linkRouter.put("/:id", isAuthenticated, linkController.updateLink);
linkRouter.delete("/:id", isAuthenticated, linkController.deleteLink);
linkRouter.get(
  "/:username/all",
  isAuthenticated,
  linkController.getAllLinksByUsername
);
linkRouter.get("/:username/active", linkController.getAllLinksActiveByUsername);

export default linkRouter;
