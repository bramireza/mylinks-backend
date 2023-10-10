import { OAuth2Client } from "google-auth-library";
import { GOOGLE } from "../configs";

export const oAuth2Client = new OAuth2Client(
  GOOGLE.CLIENT_ID,
  GOOGLE.CLIENT_SECRET,
  "postmessage"
);