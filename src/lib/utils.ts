import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { YT } from "@/types/yt";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractYtId = (url: string) => {
  const [a, , b] = url
    .replace(/(>|<)/gi, "")
    .split(
      /^.*(?:(?:youtu\.?be(\.com)?\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/,
    );
  if (b !== undefined) {
    return b.split(/[^0-9a-z_-]/i)[0];
  }
  return a;
};

export const validYtLink = (url: string) =>
  /^.*(?:(?:youtu\.?be(\.com)?\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/.test(
    url,
  );

export async function fetchYouTubeMeta(url: string): Promise<YT.Meta> {
  const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
  if (!response.ok) throw new Error("Invalid YouTube URL");
  return response.json();
}

export const cacheYtMeta = async (url: string): Promise<YT.Meta> => {
  if (typeof window === "undefined") {
    return fetchYouTubeMeta(url);
  }
  const store = localStorage.getItem(encodeURIComponent(url));
  if (store) return JSON.parse(store);
  const data = await fetchYouTubeMeta(url);
  localStorage.setItem(encodeURIComponent(url), JSON.stringify(data));
  return data;
};

export const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const getHm = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  return { hours, minutes: minutes % 60 };
};

export const getHms = (secs: number) => {
  return {
    seconds: secs % 60,
    ...getHm(Math.floor(secs / 60)),
  };
};

export const formatTime = (h: number, m: number, s: number) =>
  `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
