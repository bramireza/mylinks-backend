import { Request, Response } from "express";
import { UserModel } from "../models";
import { failureResponse, successResponse } from "../utils";

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await UserModel.find();
    return successResponse({ res, data: { users } });
  } catch (error) {
    return failureResponse({ res });
  }
};

export const getOneUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return failureResponse({ res, status: 404, message: "USER_NOT_FOUND" });
    }

    return successResponse({ res, data: { user } });
  } catch (error) {
    return failureResponse({ res });
  }
};
