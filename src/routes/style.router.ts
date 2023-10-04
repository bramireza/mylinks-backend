import { Router } from "express";
import { styleController } from "../controllers/";
import { isAuthenticated } from "../middlewares";

const styleRouter: Router = Router();

styleRouter.post("/", isAuthenticated, styleController.createStyle);
styleRouter.put("/:id", isAuthenticated, styleController.updateStyle);
styleRouter.delete("/:id", isAuthenticated, styleController.deleteStyle);
styleRouter.get("/", styleController.getAllStyle);

export default styleRouter;
