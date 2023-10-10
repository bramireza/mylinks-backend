import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || "8000";
export const FRONT_URL = process.env.FRONT_URL || "http://localhost:3000/";
export const DB_MONGO_URI = process.env.DB_MONGO_URI!;

export const JWT = {
  ACCESS_TOKEN: {
    SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
    EXP: process.env.JWT_ACCESS_TOKEN_EXPIRATION!,
  },
  REFRESH_TOKEN: {
    SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
    EXP: process.env.JWT_REFRESH_TOKEN_EXPIRATION!,
  },
};
export const GOOGLE = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
