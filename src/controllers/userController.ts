import { Request, Response } from "express";
import { UserModel } from "../models";
import { failureResponse, successResponse } from "../utils";
import { ERROR } from "../configs";

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = (await UserModel.find()) || [];
    return successResponse({ res, data: { users } });
  } catch (error) {
    return failureResponse({ res });
  }
};
export const getOneUserByUsername = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username })
      .select("username pictureUrl")
      .populate("style");
    if (!user) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.USER_NOT_FOUND,
      });
    }

    return successResponse({ res, data: { user } });
  } catch (error) {
    return failureResponse({ res });
  }
};
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const isFoundUser = await UserModel.findById(id);
    if (!isFoundUser) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.USER_NOT_FOUND,
      });
    }
    const updatedUser = await isFoundUser.updateOne(req.body, { new: true });

    return successResponse({ res, data: { user: updatedUser } });
  } catch (error) {
    return failureResponse({ res });
  }
};
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const isFoundUser = await UserModel.findById(id);
    if (!isFoundUser) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.USER_NOT_FOUND,
      });
    }
    await isFoundUser.deleteOne();

    return successResponse({ res, message: "Style deleted succesfully" });
  } catch (error) {
    return failureResponse({ res });
  }
};
export default {
  getAllUsers,
  getOneUserByUsername,
  updateUser,
  deleteUser,
};
