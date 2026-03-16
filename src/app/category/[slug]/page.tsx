"use client";

import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { Bookmark } from "lucide-react";
import {
  saveBookmark,
  removeBookmark,
  getBookmarks,
} from "@/services/bookmarkService";

export default function BookmarkButton({ postId }: { postId: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBookmark();
  }, [postId]);

  const checkBookmark = async () => {
    try {
      const data = await getBookmarks();
      const exists = data?.some((item: any) => item.postId?._id === postId);
      setSaved(exists);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleBookmark = async () => {
    if (loading) return;

    setLoading(true);

    // optimistic UI
    const newState = !saved;
    setSaved(newState);

    try {
      if (newState) {
        await saveBookmark(postId);
      } else {
        await removeBookmark(postId);
      }
    } catch (err) {
      console.log(err);

      // revert if API fails
      setSaved(!newState);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleBookmark}
      className="flex items-center gap-2 px-4 py-2 mt-5 border rounded-lg hover:bg-gray-100 transition"
    >
      {saved ? (
        <Bookmark className="w-5 h-5 text-yellow-500 fill-yellow-500 transition-transform duration-200 scale-110" />
      ) : (
        <CiBookmark className="w-5 h-5 text-gray-600 transition-transform duration-200 hover:scale-110" />
      )}

      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}