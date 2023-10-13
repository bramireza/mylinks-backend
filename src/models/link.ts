import { User } from "./user";
import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Link extends TimeStamps {
  @prop({ type: String })
  public name!: string;

  @prop({ type: String })
  public url!: string;

  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop({ type: Boolean, default: false })
  public actived!: boolean;
}
export const LinkModel = getModelForClass(Link);
