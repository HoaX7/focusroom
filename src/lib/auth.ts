import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
import { D1Dialect } from "kysely-d1";

let _auth: ReturnType<typeof betterAuth>;
export const serverAuth = (env: Env) => {
  if (!_auth) {
    const dialect = new D1Dialect({
      database: env.DB as D1Database,
    });
    _auth = betterAuth({
      appName: "Focus Room",
      database: {
        dialect,
        type: "sqlite",
      },
      secret: process.env.BETTER_AUTH_SECRET,
      rateLimit: {
        enabled: true,
        window: 10,
        max: 100,
      },
      // advanced: {
      //   ipAddress: {
      //     ipAddressHeaders: ["cf-connecting-ip"], // Cloudflare specific header
      //   }
      // },
      /**
       * If you're using a different base path other than `/api/auth`,
       * make sure to pass the whole URL, including the path.
       * (e.g., http://localhost:3000/custom-path/auth)
       */
      // biome-ignore lint/style/useNamingConvention: true
      baseURL: process.env.BETTER_AUTH_URL,
      emailAndPassword: { enabled: false },
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          mapProfileToUser: (profile) => {
            return {
              firstName: profile.name.split(" ")[0],
              lastName: profile.name.split(" ")[1],
            };
          },
        },
        google: {
          prompt: "select_account",
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          mapProfileToUser: (profile) => {
            return {
              firstName: profile.given_name,
              lastName: profile.family_name,
            };
          },
        },
      },
      plugins: [reactStartCookies()],
    });
  }
  return _auth;
};
