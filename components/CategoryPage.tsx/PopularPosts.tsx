"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPopularArticles } from "@/services/popularnews";

type Article = {
  _id: string;
  headline: string;
  slug: string;
  content?: string;
  image?: string;
  thumbnail?: string;
};

import Image from "next/image";

export default function PopularPosts() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to strip HTML from content
  const stripHtml = (html?: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
  };

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
    <div className="bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#333] dark:bg-[#222] text-white px-4 py-2 font-bold text-[13px] tracking-wider uppercase mb-5 shadow-sm border-l-4 border-[#e43f3e]">
        Popular Post
      </div>

      {/* Content */}
      <div className="space-y-6 px-1 bg-white dark:bg-[#0a0a0a]">
        {loading ? (
          <p className="text-sm text-gray-500 py-4 px-4">
            Loading popular posts...
          </p>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <div
              key={article._id}
              className={`relative flex items-start gap-3 group ${index !== articles.length - 1 ? 'pb-6 border-b border-gray-100 dark:border-[#222]' : ''}`}
            >
              {/* Hover Indicator */}
              <div className="absolute left-0 top-0 bottom-6 w-[3px] bg-[#e43f3e] scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-300 z-10" />

              {/* Content Box */}
              <div className="flex z-10 w-full pl-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0 mr-4">
                  <div className="relative w-[72px] h-[72px] overflow-hidden rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    <Image src={article.thumbnail || article.image || "/placeholder.jpg"} alt={article.headline} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>

                {/* Text Content */}
                <Link href={`/articles/${article.slug}`} className="block group flex-grow min-w-0">
                  <p className="text-[15px] leading-snug font-bold text-gray-900 group-hover:text-[#e43f3e] transition-colors dark:text-gray-100 mb-1.5 line-clamp-2">
                    {article.headline}
                  </p>
                  {article.content && (
                    <p className="text-gray-500 dark:text-gray-400 text-[12px] line-clamp-2 leading-[1.6] font-medium">
                      {stripHtml(article.content)}
                    </p>
                  )}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-4 px-4">
            No popular posts available
          </p>
        )}
      </div>
    </div>
  );
}