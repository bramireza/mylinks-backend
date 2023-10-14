import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routes } from "./routes";
import { failureResponse } from "./utils";
import { MORGAN_FORMAT, allowOrigins } from "./configs";

const app: express.Application = express();

app.use(morgan(MORGAN_FORMAT));
app.use(
  cors({
    origin: allowOrigins(),
    credentials: true,
  })
);
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Routes middleware
routes(app);

// Route 404 default
app.use((req: Request, res: Response): Response => {
  return failureResponse({
    res,
    status: 404,
    message: `${req.method} -> ${req.originalUrl}  not found`,
  });
});
export default app;
