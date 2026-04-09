"use client";

import { privateApi, publicApi } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Comments({ articleId }: { articleId: string }) {
  const router=useRouter()
  const [comments, setComments] = useState<any[]>([]);
  
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchComments = async () => {
    const res = await publicApi.get(`/comments/article/${articleId}`);
    setComments(res.data.comments);   };

   fetchComments();
   }, [articleId]);

const submitComment = async (e: any) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to post a comment");
    router.push("/login");
    return;
  }
  

  try {
    const res = await privateApi.post(`/comments/article/${articleId}`, {
      content
    });

    const newComment = res.data;

    setComments((prev) => [newComment, ...prev]);

   
    setContent("");

    alert("Comment posted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to post comment. Please try again.");
  }
};

const handleCommentChange = (e: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to post a comment");
      router.push("/login");
      return;
    }

    setContent(e.target.value);
}

  return (
    <div className="mt-16">

      <h3 className="text-red-500 font-bold mb-4">COMMENTS</h3>

      <textarea
        placeholder="Share your thoughts..."
        className="w-full border rounded-lg p-4 h-28 mb-4"
        value={content}
        onChange={handleCommentChange}
      />

      <button
        onClick={submitComment}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Posting..." : "POST COMMENTS"}
      </button>

    
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">All Comments</h1>
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-4 m-2"> 
            <p className="font-semibold">{c.user?.email}</p>
            <p className="text-gray-700">{c.content}</p>
          </div>
        ))}
      </div> 
    </div>
  );
}
