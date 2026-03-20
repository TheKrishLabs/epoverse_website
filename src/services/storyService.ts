import { privateApi, publicApi } from "@/lib/axios";

export const getStories = async () => {
  const res = await publicApi.get("/story/public");
  return res.data;
};

export const getStoryItems = async (storyId: string) => {
  const res = await privateApi.get(`/story/public/${storyId}/items`);
  return res.data;
};

export const trackStoryView = async (storyId: string, storyItemId: string) => {
  await privateApi.post("/story/view", {
    storyId,
    storyItemId,
  });
};