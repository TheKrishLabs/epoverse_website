"use client";

import { privateApi, publicApi } from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Report({ articleId }: { articleId: string }) {
  const router=useRouter()
  const pathname = usePathname()
  const [reports, setReports] = useState<any[]>([]);  
  const [reason, setReason] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

const submitReport = async (e: any) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to post a comment");
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    return;
  }

  try {
    const res = await privateApi.post(`/reports/article/${articleId}`, {
        description: content,
        reason
    });

    const newReport = res.data;

    setReports((prev) => [newReport, ...prev]);

   
    setContent("");

    alert("Report posted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to post report. Please try again.");
  }
};

const handleReportChange = (e: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to post a report");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setContent(e.target.value);
}


  return (
    <div className="mt-16">

      <h3 className="text-red-500 font-bold mb-4">REPORTS</h3>
      <select
        className="w-full border rounded-lg p-4 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">Select a reason</option>
        <option value="spam">Spam</option>
        <option value="abusive">Abusive</option>
        <option value="fake_news">Fake News</option>
        <option value="copyright">Copyright Violation</option>
        <option value="misleading">Misleading Information</option>
        <option value="other">Other</option>
      </select>


      <textarea
        placeholder="Share your thoughts..."
        className="w-full border rounded-lg p-4 h-28 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        value={content}
        onChange={handleReportChange}
      />

      <button
        onClick={submitReport}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg dark:bg-white dark:text-black"
      >
        {loading ? "Posting..." : "POST REPORT"}
      </button>

    

      {/* Report List
      <div className="space-y-6">
        {reports.map((r) => (
          <div key={r._id} className="border-b pb-4">
            <p className="font-semibold">{r.name}</p>
            <p className="text-gray-700">{r.content}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}
