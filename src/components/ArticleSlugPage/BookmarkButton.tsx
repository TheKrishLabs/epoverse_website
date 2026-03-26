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
      console.log(data);
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
      className="flex items-center gap-2 px-4 py-2 mt-5 border rounded-lg hover:bg-gray-100 transition"
    >
      <CiBookmark
        size={22}
        className={`transition-all duration-200 
        ${saved ? "text-yellow-500" : "text-gray-600"}
        ${animate ? "scale-125" : "scale-100"}
        `}
      />

      <span className="text-sm">{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
