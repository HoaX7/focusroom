import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteSolid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    {
      // cloudflare workaround for dev
      name: "remove-ssr-external",
      configResolved(config) {
        config.environments.ssr.resolve.external = [];
      },
    },
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
    tsConfigPaths(),
    tanstackStart({
      srcDirectory: "src",
      server: {
        entry: "src/server.ts",
      },
    }),
    // solid's vite plugin must come after start's vite plugin
    viteSolid({ ssr: true }),
    tailwindcss(),
  ],
});
