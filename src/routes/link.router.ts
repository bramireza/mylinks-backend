import { Router } from "express";
import { linkController } from "../controllers/";

const linkRouter: Router = Router();

linkRouter.get("/:username", linkController.getAllLinksByUsername);

export default linkRouter;
