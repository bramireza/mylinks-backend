import { Request, Response } from "express";
import { Style, StyleModel } from "../models";
import { failureResponse, successResponse } from "../utils";
import { ERROR } from "../configs";

export const createStyle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { backgroundColor, fontColor, buttonColor, buttonFontColor }: Style =
    req.body;
  try {
    if (!backgroundColor || !fontColor || !buttonColor || buttonFontColor) {
      return failureResponse({
        res,
        status: 400,
        message: ERROR.DATA_NOT_PROVIDER,
      });
    }
    const newStyle = new StyleModel(req.body);
    const savedNewStyle = await newStyle.save();

    return successResponse({
      res,
      status: 201,
      data: { style: savedNewStyle },
    });
  } catch (error) {
    return failureResponse({ res });
  }
};
export const updateStyle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const isFoundStyle = await StyleModel.findById(id);
    if (!isFoundStyle) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.STYLE_NOT_FOUND,
      });
    }
    const updatedStyle = await StyleModel.findByIdAndUpdate(
      isFoundStyle._id,
      req.body,
      { new: true }
    );

    return successResponse({ res, data: { style: updatedStyle } });
  } catch (error) {
    return failureResponse({ res });
  }
};
export const deleteStyle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const isFoundStyle = await StyleModel.findById(id);
    if (!isFoundStyle) {
      return failureResponse({
        res,
        status: 404,
        message: ERROR.STYLE_NOT_FOUND,
      });
    }
    await isFoundStyle.deleteOne();

    return successResponse({ res, message: "Style deleted succesfully" });
  } catch (error) {
    return failureResponse({ res });
  }
};
export const getAllStyle = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const styles = (await StyleModel.find()) || [];
    return successResponse({ res, data: { styles } });
  } catch (error) {
    return failureResponse({ res });
  }
};

export default {
  createStyle,
  updateStyle,
  deleteStyle,
  getAllStyle,
};
