"use client";

import { privateApi, publicApi } from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function Comments({ articleId }: { articleId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [comments, setComments] = useState<any[]>([]);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    const res = await publicApi.get(`/comments/article/${articleId}`);
    setComments(res.data.comments);
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to post a comment");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }


    try {
      setLoading(true);
      await privateApi.post(`/comments/article/${articleId}`, {
        content
      });

      setContent("");
      await fetchComments();
    } catch (error) {
      console.error(error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (e: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to post a comment");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setContent(e.target.value);
  }

  return (
    <div className="mt-16">

      <h3 className="text-red-500 font-bold mb-4">COMMENTS</h3>

      <textarea
        placeholder="Share your thoughts..."
        className="w-full border rounded-lg p-4 h-28 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        value={content}
        onChange={handleCommentChange}
      />

        <button
          onClick={submitComment}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg dark:bg-white dark:text-black"
        >
        {loading ? "Posting..." : "POST COMMENTS"}
      </button>


      <div className="space-y-6">
        <h1 className="text-2xl font-bold dark:text-white">All Comments</h1>
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-4 m-2 dark:border-gray-700">
            <p className="font-semibold dark:text-white">{c.user?.email}</p>
            <p className="text-gray-700 dark:text-gray-300">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
