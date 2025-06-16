export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const ORIGIN_URL = isDev
  ? "http://localhost:3000"
  : "https://sommaire-beta.vercel.app";
