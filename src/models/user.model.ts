import {
  DocumentType,
  Ref,
  getModelForClass,
  pre,
  prop,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import bcrypt from "bcrypt";
import { Style } from "./style.model";

export enum ProviderType {
  Local = "Local",
  Google = "Google",
}
@pre<User>("save", async function (next) {
  this.fullName = this.firstName + " " + this.lastName;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
})
export class User extends TimeStamps {
  @prop({ type: String })
  public fullName?: string;

  @prop({ required: true, unique: true, type: String })
  public username!: string;

  @prop({ required: true, type: String })
  public firstName!: string;

  @prop({ required: true, type: String })
  public lastName!: string;

  @prop({ required: true, unique: true, type: String })
  public email!: string;

  @prop({ type: String })
  public password!: string;

  @prop({ type: Date })
  public birthDay?: Date;

  @prop({ type: String })
  public nationality?: string;

  @prop({ type: String })
  public gender?: string;

  @prop({ type: String })
  public pictureUrl?: string;

  @prop({ type: String, default: ProviderType.Local })
  public provider?: ProviderType;

  @prop({ ref: () => Style })
  public style?: Ref<Style>;

  public async isMatchPassword(
    this: DocumentType<User>,
    password: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
export const UserModel = getModelForClass(User);
