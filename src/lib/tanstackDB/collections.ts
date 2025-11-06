import { createCollection, localStorageCollectionOptions } from "@tanstack/react-db";
import { z } from "zod/mini";

export const playlistSchema = z.object({
  title: z.string(),
  videoId: z.string(),
  playlistId: z.optional(z.string()),
  url: z.optional(z.string()),
});
export type Playlist = z.infer<typeof playlistSchema>;

export const playlistCollection = createCollection(
  localStorageCollectionOptions({
    id: "playlists",
    storageKey: "yt-playlists",
    schema: playlistSchema,
    // storage: localStorage,
    getKey: (t) => t.videoId,
    onInsert: async ({ transaction }) => {
      console.log("Inserting:", transaction.mutations[0].modified);
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      console.log("Updating from", original, "to", modified);
    },
  }),
);
