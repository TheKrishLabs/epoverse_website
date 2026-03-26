import { privateApi, publicApi } from "@/lib/axios";

export const saveBookmark = async (postId: string) => {
  const res = await privateApi.post(`/bookmarks`, { postId });
  return res.data;
};

export const removeBookmark = async (postId: string) => {
  const res = await privateApi.delete(`/bookmarks/${postId}`, {});
  return res.data;
};

export const getBookmarks = async () => {
  const res = await privateApi.get(`/bookmarks`, {});
  return res.data;
};
