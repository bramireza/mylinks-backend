import { Request, Response } from "express";
import {
  RefreshTokenModel,
  User,
  UserModel,
  BlackListTokenModel,
} from "../models";
import { validatePassword } from "../helpers";
import {
  createTokens,
  failureResponse,
  successResponse,
  verifyToken,
  getTokenInHeaders,
} from "../utils";

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password }: User = req.body;

  try {
    if (!email || !password) {
      return failureResponse({
        res,
        status: 400,
        message: "DATA_NOT_PROVIDER",
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return failureResponse({
        res,
        status: 403,
        message: "INVALID_CREDENTIALS",
      });
    }
    if (user.googleId && !user.password) {
      return failureResponse({
        res,
        status: 403,
        message: "INVALID_CREDENTIALS",
      });
    }
    const isMatch = await user.isMatchPassword(password);
    if (!isMatch) {
      return failureResponse({
        res,
        status: 403,
        message: "INVALID_CREDENTIALS",
      });
    }
    const { accessToken, refreshToken } = createTokens(user);
    await RefreshTokenModel.create({ token: refreshToken, user: user._id });

    return successResponse({ res, data: { user, accessToken, refreshToken } });
  } catch (error) {
    return failureResponse({ res });
  }
};
export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, firstName, lastName, email, password }: User = req.body;
  try {
    if (!username || !firstName || !lastName || !email || !password) {
      return failureResponse({
        res,
        status: 400,
        message: "DATA_NOT_PROVIDER",
      });
    }
    if (!validatePassword(password)) {
      return failureResponse({
        res,
        status: 400,
        message: "PASSWORD_NOT_FORMAT_VALID",
      });
    }
    const isFoundUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    console.log(isFoundUser);
    if (isFoundUser) {
      return failureResponse({
        res,
        status: 400,
        message: "USER_ALREADY_EXIST",
      });
    }
    const newUser = new UserModel(req.body);
    const savedNewUser = await newUser.save();

    return successResponse({ res, data: { user: savedNewUser } });
  } catch (error) {
    return failureResponse({ res });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return failureResponse({
        res,
        status: 400,
        message: "MISSING_REFRESH_TOKEN",
      });
    }

    const savedRefreshToken = await RefreshTokenModel.findRefreshTokenByToken(
      refreshToken
    );
    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      return failureResponse({ res, status: 401, message: "UNAUTHORIZED" });
    }

    const user = await UserModel.findOne({ _id: savedRefreshToken.user._id });
    if (!user) {
      return failureResponse({ res, status: 401, message: "UNAUTHORIZED" });
    }

    await RefreshTokenModel.revokeTokenById(savedRefreshToken.id);
    const { accessToken, refreshToken: newRefreshToken } = createTokens(user);
    await RefreshTokenModel.create({ user: user._id, token: newRefreshToken });

    return successResponse({
      res,
      data: { user, accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    return failureResponse({ res });
  }
};

export const revokeRefreshTokens = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return failureResponse({
        res,
        status: 400,
        message: "USER_ID_MISSING_OR_INVALID",
      });
    }
    await RefreshTokenModel.revokeAllTokensByUserId(userId);

    return successResponse({
      res,
      message: "Tokens revoked for user",
    });
  } catch (error) {
    return failureResponse({ res });
  }
};

export const me = async (req: Request, res: Response): Promise<Response> => {
  try {
    const accessToken = getTokenInHeaders(req);
    if (!accessToken) {
      return failureResponse({
        res,
        status: 401,
        message: "TOKEN_MISING_OR_INVALID",
      });
    }
    const decodedToken = await verifyToken(accessToken, false);
    const user = await UserModel.findById(decodedToken._id);
    return successResponse({ res, data: { user } });
  } catch (error) {
    return failureResponse({ res });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { accessToken, refreshToken } = req.body;

    if (accessToken) {
      await BlackListTokenModel.create({ token: accessToken });
    }
    if (refreshToken) {
      const savedRefreshToken = await RefreshTokenModel.findRefreshTokenByToken(
        refreshToken
      );
      await RefreshTokenModel.revokeTokenById(savedRefreshToken?.id);
    }

    return successResponse({ res, message: "Logout Successfully" });
  } catch (error) {
    return failureResponse({ res });
  }
};
