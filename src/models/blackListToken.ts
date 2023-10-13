import { prop, getModelForClass, index } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { JWT } from "../configs";

@index({ createdAt: 1 }, { expires: JWT.ACCESS_TOKEN.EXP })
class BlackListToken extends TimeStamps {
  @prop({ type: String })
  public token!: string;
}

export const BlackListTokenModel = getModelForClass(BlackListToken);
