import { betterAuth } from "better-auth";
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  // biome-ignore lint/style/useNamingConvention: true
  baseURL: process.env.BETTER_AUTH_URL,
});
