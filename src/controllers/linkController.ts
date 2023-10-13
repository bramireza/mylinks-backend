import { Request, Response } from "express";
import { Link, LinkModel, UserModel } from "../models";
import { failureResponse, successResponse } from "../utils";
import { ERROR } from "../configs";

const createLink = async (req: Request, res: Response): Promise<Response> => {
  const { name, url, user }: Link = req.body;
  try {
    if (!name || !url || !user) {
      return failureResponse({
        res,
        status: 400,
        message: ERROR.DATA_NOT_PROVIDER,
      });
    }
    const newLink = new LinkModel(req.body);
    const savedNewLink = await newLink.save();

    return successResponse({ res, status: 201, data: { link: savedNewLink } });
  } catch (error) {
    return failureResponse({ res });
  }
};
const updateLink = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const isFoundLink = await LinkModel.findById(id);
    if (!isFoundLink) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.LINK_NOT_FOUND,
      });
    }
    const updatedLink = await LinkModel.findByIdAndUpdate(
      isFoundLink._id,
      req.body,
      { new: true }
    );

    return successResponse({ res, data: { link: updatedLink } });
  } catch (error) {
    return failureResponse({ res });
  }
};
const deleteLink = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const isFoundLink = await LinkModel.findById(id);
    if (!isFoundLink) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.LINK_NOT_FOUND,
      });
    }
    await isFoundLink.deleteOne();

    return successResponse({ res, message: "Link deleted succesfully" });
  } catch (error) {
    return failureResponse({ res });
  }
};
const getAllLinksByUsername = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username } = req.params;
  try {
    const isFoundUser = await UserModel.findOne({ username });
    if (!isFoundUser) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.USER_NOT_FOUND,
      });
    }
    const links = (await LinkModel.find({ user: isFoundUser._id })) || [];

    return successResponse({ res, data: { links } });
  } catch (error) {
    return failureResponse({ res });
  }
};
const getAllLinksActiveByUsername = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username } = req.params;
  try {
    const isFoundUser = await UserModel.findOne({ username });
    if (!isFoundUser) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.USER_NOT_FOUND,
      });
    }
    const links =
      (await LinkModel.find({ user: isFoundUser._id, actived: true })) || [];

    return successResponse({ res, data: { links } });
  } catch (error) {
    return failureResponse({ res });
  }
};

export default {
  createLink,
  updateLink,
  deleteLink,
  getAllLinksActiveByUsername,
  getAllLinksByUsername,
};
