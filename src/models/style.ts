import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Style extends TimeStamps {
  @prop({ required: true, type: String })
  public backgroundColor!: string;

  @prop({ required: true, type: String })
  public fontColor!: string;

  @prop({ required: true, type: String })
  public buttonColor!: string;

  @prop({ required: true, type: String })
  public buttonFontColor!: string;

  @prop({ type: String })
  public buttonShadowColor?: string;
}
export const StyleModel = getModelForClass(Style);
