import {
  Ref,
  DocumentType,
  getModelForClass,
  prop,
  index,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { User } from "./user";
import { JWT } from "../configs";

@index({ createdAt: 1 }, { expires: JWT.REFRESH_TOKEN.EXP })
export class RefreshToken extends TimeStamps {
  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop({ type: String })
  public token!: string;

  @prop({ type: Boolean, default: false })
  public revoked!: boolean;

  static async revokeAllTokensByUserId(userId: string): Promise<void> {
    await RefreshTokenModel.updateMany({ user: userId }, { revoked: true });
  }
  static async revokeTokenById(id: string): Promise<void> {
    await RefreshTokenModel.findByIdAndUpdate(id, { revoked: true });
  }

  static async findRefreshTokenByToken(
    token: string
  ): Promise<DocumentType<RefreshToken> | null> {
    return await RefreshTokenModel.findOne({ token, revoked: false });
  }
}

export const RefreshTokenModel = getModelForClass(RefreshToken);
