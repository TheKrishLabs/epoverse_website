"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPopularArticles } from "@/services/popularnews";

type Article = {
  _id: string;
  headline: string;
  slug: string;
};

export default function PopularPosts() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPopular() {
      try {
        const data = await getPopularArticles();

        // ✅ IMPORTANT: use data.articles
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Popular load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPopular();
  }, []);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700">
      {/* Header */}
      <div className="bg-black text-white px-3 py-2 font-semibold text-sm">
        POPULAR POST
      </div>

      {/* Content */}
      <div className="space-y-4 mt-4">

        {loading ? (
          <p className="text-sm text-gray-500">
            Loading popular posts...
          </p>

        ) : articles.length > 0 ? (

          articles.map((article, index) => (
            <div
              key={article._id}
              className="flex items-start gap-3 border-b pb-3"
            >

              {/* Title */}
              <Link href={`/articles/${article.slug}`}>
                <p className="text-base font-semibold hover:text-red-500 cursor-pointer dark:text-gray-200">
                  {article.headline}
                </p>
              </Link>
            </div>
          ))

        ) : (
          <p className="text-sm text-gray-500">
            No popular posts available
          </p>
        )}

      </div>
    </div>
  );
}