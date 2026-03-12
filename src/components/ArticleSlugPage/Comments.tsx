"use client";

import { useState, useEffect } from "react";

export default function Comments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/comments?articleId=${articleId}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [articleId]);

  const submitComment = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ name, message, articleId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const newComment = await res.json();

    setComments([newComment, ...comments]);
    setName("");
    setMessage("");
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={submitComment} className="space-y-4 mb-10">
        <input
          className="border w-full p-3 rounded"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          className="border w-full p-3 rounded"
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button className="bg-red-500 text-white px-6 py-2 rounded">
          Post Comment
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-4">
            <p className="font-semibold">{c.name}</p>
            <p className="text-gray-700">{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
