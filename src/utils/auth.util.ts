import { OAuth2Client } from "google-auth-library";
import { config } from "../configs";

export const oAuth2Client = new OAuth2Client(
  config.GOOGLE.CLIENT_ID,
  config.GOOGLE.CLIENT_SECRET,
  "postmessage"
);