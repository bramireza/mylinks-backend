import {
  DocumentType,
  Ref,
  getModelForClass,
  pre,
  prop,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import bcrypt from "bcrypt";
import { Style } from "./style";
import { generateRandomUsername } from "../helpers";

export enum ProviderType {
  Local = "Local",
  Google = "Google",
}
class Image {
  @prop({ type: String })
  public secure_url!: string;

  @prop({ type: String })
  public public_id?: string;
}
@pre<User>("save", async function (next) {
  this.fullName = this.firstName + " " + this.lastName;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (!this.username) {
    this.username = generateRandomUsername(this.firstName);
  }
  if (!this.avatar || !this.avatar.secure_url) {
    this.avatar = this.avatar || {};
    this.avatar.secure_url = `https://ui-avatars.com/api/?name=${this.username}&bold=true&length=1&font-size=0.35&color=000000&background=ffffff`;
  }
  next();
})
@pre<User>(["updateOne", "findOneAndUpdate"], function (next) {
  const document = this.getUpdate() as User;
  if (document) {
    this.setUpdate({
      $set: {
        ...document,
        fullName: document.firstName + " " + document.lastName
      }
    });
  }
  next();
})
export class User extends TimeStamps {
  @prop({ type: String })
  public fullName!: string;

  @prop({ type: String, unique: true })
  public username!: string;

  @prop({ type: String })
  public firstName!: string;

  @prop({ type: String })
  public lastName!: string;

  @prop({ type: String, unique: true })
  public email!: string;

  @prop({ type: String })
  public password!: string;

  @prop({ type: Date })
  public birthDay?: Date;

  @prop({ type: String })
  public nationality?: string;

  @prop({ type: String })
  public gender?: string;

  @prop({ type: () => Image })
  public avatar!: Image;

  @prop({ type: String, default: ProviderType.Local })
  public provider!: ProviderType;

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
