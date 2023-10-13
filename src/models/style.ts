import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Style extends TimeStamps {
  @prop({ type: String })
  public backgroundColor!: string;

  @prop({ type: String })
  public fontColor!: string;

  @prop({ type: String })
  public buttonColor!: string;

  @prop({ type: String })
  public buttonFontColor!: string;

  @prop({ type: String })
  public buttonShadowColor?: string;
}
export const StyleModel = getModelForClass(Style);
