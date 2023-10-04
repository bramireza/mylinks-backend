import { User } from "./user.model";
import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Link extends TimeStamps {
  @prop({ require: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public url!: string;

  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop({ type: Boolean, default: false })
  public actived!: boolean;
}
export const LinkModel = getModelForClass(Link);
