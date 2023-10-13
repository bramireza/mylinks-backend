import { Request, Response } from "express";
import fs from "fs-extra";
import { LinkModel, UserModel } from "../models";
import {
  deleteImage,
  failureResponse,
  successResponse,
  uploadImage,
} from "../utils";
import { ERROR } from "../configs";
import fileUpload from "express-fileupload";

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
    if (req.files?.avatar) {
      const imagesUploaded = await uploadImage(req.files.avatar.tempFilePath);
      console.log(imagesUploaded);
      req.body.avatar = {
        public_id: imagesUploaded.public_id,
        secure_url: imagesUploaded.secure_url,
      };
      await fs.unlink(req.files.avatar.tempFilePath);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      isFoundUser._id,
      req.body,
      { new: true }
    );

    return successResponse({ res, data: { user: updatedUser } });
  } catch (error) {
    if (req.files?.avatar) {
      await fs.unlink(req.files.avatar.tempFilePath);
    }
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
    if (isFoundUser.avatar.public_id) {
      await deleteImage(isFoundUser.avatar.public_id);
    }
    const hasLinks = await LinkModel.find({ user: isFoundUser._id });

    if (hasLinks) {
      await LinkModel.deleteMany({ user: isFoundUser._id });
    }
    await isFoundUser.deleteOne();

    return successResponse({ res, message: "User deleted succesfully" });
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
