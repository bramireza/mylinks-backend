import { Request, Response } from "express";
import {
  RefreshTokenModel,
  User,
  UserModel,
  BlackListTokenModel,
  ProviderType,
} from "../models";
import { validatePassword } from "../helpers";
import {
  createTokens,
  failureResponse,
  successResponse,
  verifyToken,
  getTokenInHeaders,
  oAuth2Client,
} from "../utils";
import { ERROR, GOOGLE } from "../configs";
import { updateUser } from "./userController";

const googleLogin = async (req: Request, res: Response) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return failureResponse({
        res,
        status: 403,
        message: ERROR.GOOGLE_ACOUNT_NOT_VERIFIED,
      });
    }
    const { email, picture, name, given_name, family_name } = payload;
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      {
        avatar: {
          secure_url: picture,
        },
        firtsName: given_name,
        lastName: family_name,
        fullName: name,
        provider: ProviderType.Google,
      },
      { new: true }
    );
    if (!updatedUser) {
      const newUser = new UserModel({
        email,
        avatar: {
          secure_url: picture,
        },
        firstName: given_name,
        lastName: family_name,
        provider: ProviderType.Google,
      });
      const savedNewUser = await newUser.save();

      const { accessToken, refreshToken } = createTokens(savedNewUser);
      await RefreshTokenModel.create({
        token: refreshToken,
        user: savedNewUser._id,
      });

      return successResponse({
        res,
        data: { user: savedNewUser, accessToken, refreshToken },
      });
    }
    const { accessToken, refreshToken } = createTokens(updatedUser);
    await RefreshTokenModel.create({
      token: refreshToken,
      user: updatedUser._id,
    });

    return successResponse({
      res,
      data: { user: updatedUser, accessToken, refreshToken },
    });
  } catch (error) {
    return failureResponse({ res });
  }
};
const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password }: User = req.body;

  try {
    if (!email || !password) {
      return failureResponse({
        res,
        status: 400,
        message: ERROR.DATA_NOT_PROVIDER,
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return failureResponse({
        res,
        status: 403,
        message: ERROR.INVALID_CREDENTIALS,
      });
    }
    if (!user.password) {
      return failureResponse({
        res,
        status: 403,
        message: ERROR.INVALID_LOCAL_PROVIDER,
      });
    }
    const isMatch = await user.isMatchPassword(password);
    if (!isMatch) {
      return failureResponse({
        res,
        status: 403,
        message: ERROR.INVALID_CREDENTIALS,
      });
    }
    const { accessToken, refreshToken } = createTokens(user);
    await RefreshTokenModel.create({ token: refreshToken, user: user._id });

    return successResponse({ res, data: { user, accessToken, refreshToken } });
  } catch (error) {
    return failureResponse({ res });
  }
};
const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, firstName, lastName, email, password }: User = req.body;
  try {
    if (!username || !firstName || !lastName || !email || !password) {
      return failureResponse({
        res,
        status: 400,
        message: ERROR.DATA_NOT_PROVIDER,
      });
    }
    if (!validatePassword(password)) {
      return failureResponse({
        res,
        status: 400,
        message: ERROR.PASSWORD_NOT_FORMAT_VALID,
      });
    }
    const isFoundUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    
    if (isFoundUser) {
      return failureResponse({
        res,
        status: 400,
        message: ERROR.USER_ALREADY_EXIST,
      });
    }
    const newUser = new UserModel(req.body);
    const savedNewUser = await newUser.save();

    return successResponse({ res, data: { user: savedNewUser } });
  } catch (error) {
    console.log(error);
    return failureResponse({ res });
  }
};

const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return failureResponse({
        res,
        status: 400,
        message: ERROR.MISSING_REFRESH_TOKEN,
      });
    }

    const savedRefreshToken = await RefreshTokenModel.findRefreshTokenByToken(
      refreshToken
    );
    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      return failureResponse({ res, status: 401, message: ERROR.UNAUTHORIZED });
    }

    const user = await UserModel.findOne({ _id: savedRefreshToken.user._id });
    if (!user) {
      return failureResponse({ res, status: 401, message: ERROR.UNAUTHORIZED });
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

const revokeRefreshTokens = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return failureResponse({
        res,
        status: 400,
        message: ERROR.MISSING_USER_ID,
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

const me = async (req: Request, res: Response): Promise<Response> => {
  try {
    const accessToken = getTokenInHeaders(req);
    if (!accessToken) {
      return failureResponse({
        res,
        status: 401,
        message: ERROR.TOKEN_MISING_OR_INVALID,
      });
    }
    const decodedToken = await verifyToken(accessToken, false);
    const user = await UserModel.findById(decodedToken._id);
    return successResponse({ res, data: { user } });
  } catch (error) {
    return failureResponse({ res });
  }
};

const logout = async (
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

export default {
  googleLogin,
  signIn,
  signUp,
  me,
  revokeRefreshTokens,
  refreshToken,
  logout,
};