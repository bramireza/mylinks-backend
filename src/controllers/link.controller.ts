import { Request, Response } from "express";
import { Link, LinkModel, UserModel } from "../models";
import { failureResponse, successResponse } from "../utils";

export const createLink = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, url }: Link = req.body;
  try {
    if (!name || !url) {
      return failureResponse({
        res,
        status: 400,
        message: "DATA_NOT_PROVIDER",
      });
    }
    const newLink = new LinkModel(req.body);
    const savedNewLink = await newLink.save();

    return successResponse({ res, data: { link: savedNewLink } });
  } catch (error) {
    return failureResponse({ res });
  }
};

export const getAllLinksByUsername = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username } = req.params;
  try {
    const isFoundUser = await UserModel.findOne({ username });
    console.log(username);
    if (!isFoundUser) {
      return failureResponse({
        res,
        status: 404,
        message: "USER_NOT_FOUNT",
      });
    }
    const links = await LinkModel.findById(isFoundUser._id) || [];

    return successResponse({ res, data: { links } });
  } catch (error) {
    return failureResponse({ res });
  }
};
