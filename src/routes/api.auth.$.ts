import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { serverAuth } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => {
        return serverAuth(env).handler(request);
      },
      POST: ({ request }) => {
        return serverAuth(env).handler(request);
      },
    },
  },
});
