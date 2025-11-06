import { env } from "cloudflare:workers";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

export const initDb = <T = unknown>() => {
  return new Kysely<T>({
    dialect: new D1Dialect({
      database: env.DB,
    }),
  });
};
