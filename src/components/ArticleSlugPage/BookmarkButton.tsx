"use client";

import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import {
  saveBookmark,
  removeBookmark,
  getBookmarks,
} from "@/services/bookmarkService";

export default function BookmarkButton({ postId }: { postId: string }) {
  const [saved, setSaved] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) checkBookmark();
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
    try {
      setAnimate(true);

      if (saved) {
        await removeBookmark(postId);
        setSaved(false);
      } else {
        await saveBookmark(postId);
        setSaved(true);
      }

      setTimeout(() => setAnimate(false), 200);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all font-medium
        ${saved 
          ? "bg-red-50 border-red-500 text-red-500 dark:bg-gray-800" 
          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
    >
      <CiBookmark size={22} className={`transition-transform duration-200 ${animate ? "scale-125" : "scale-100"} ${saved ? "text-red-500" : ""}`} />
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
