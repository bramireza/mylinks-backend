import express, { Router } from "express";
import authRouter from "./auth.router";
import userRouter from "./user.router";
import linkRouter from "./link.router";

const allRoutes = [
  ["auth", authRouter],
  ["user", userRouter],
  ["link", linkRouter]
];

export const routes = (app: express.Application): void => {
  allRoutes.forEach(([path, controller]) => {
    app.use(`/${path}`, <Router>controller);
  });
};
