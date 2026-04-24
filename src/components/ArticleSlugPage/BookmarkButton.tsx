"use client";

import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import {
  saveBookmark,
  removeBookmark,
  getBookmarks,
} from "@/services/bookmarkService";

export default function BookmarkButton({ postId }: { postId: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (loading) return;
    try {
      setLoading(true);

      if (saved) {
        await removeBookmark(postId);
        setSaved(false);
      } else {
        await saveBookmark(postId);
        setSaved(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
        ${saved
          ? "text-[#e43f3e]"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
    >
      {loading ? (
        <svg className="animate-spin h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : saved ? (
        <FaBookmark size={14} />
      ) : (
        <CiBookmark size={18} strokeWidth={0.5} />
      )}
      {!loading && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
