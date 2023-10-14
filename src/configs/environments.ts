import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || "8000";
export const DB_MONGO_URI = process.env.DB_MONGO_URI!;
export const MORGAN_FORMAT = NODE_ENV === "production" ? "common" : "dev";

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

export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
export const PATH_TEMP_IMAGES = process.env.PATH_TEMP_IMAGES || "temp_images";
export const PATH_CLOUDINARY_IMAGES =
  process.env.PATH_CLOUDINARY_IMAGES || "images";

export const allowOrigins = (): string[] => {
  const origins = process.env.ALLOW_ORIGINS_URLS || "";
  const originsArray = origins.split(" ").filter((el) => el !== "");

  return originsArray;
};
