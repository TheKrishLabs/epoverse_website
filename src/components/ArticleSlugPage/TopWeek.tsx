"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTopWeekArticles } from "@/services/topweek";
import { getPopularArticles } from "@/services/popularnews";
import { FaEye, FaRegCommentDots } from "react-icons/fa";

export type Category = {
  _id?: string;
  name: string;
};

export type Article = {
  _id: string;
  headline: string;
  content: string;

  image?: string;
  thumbnail?: string;

  slug: string;
  author: string;

  status: "draft" | "published";
  isLatest: boolean;

  // ✅ FIXED
  category: Category;

  createdAt?: string;
  updatedAt?: string;

  // API fields
  commentsCount?: number;
  views?: number;
  likes?: number;

  isDeleted?: boolean;
};


function TopWeekSkeleton() {
  return (
    <div className="animate-pulse space-y-4">

      <div className="h-64 bg-gray-300 w-full rounded" />

      {[1, 2].map((i) => (
        <div key={i} className="flex gap-3">

          <div className="w-20 h-16 bg-gray-300 rounded" />

          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full" />
            <div className="h-3 bg-gray-300 rounded w-2/3" />
          </div>

        </div>
      ))}

    </div>
  );
}
export default function TopWeek() {

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchTopWeek = async () => {

      const data = await getTopWeekArticles();

      const validArticles =
        (data?.articles || []).filter(
          (a: Article) => !a.isDeleted && a.status === "published"
        );

      setArticles(validArticles);
      setLoading(false);

    };

    fetchTopWeek();

  }, []);

  if (loading) return <TopWeekSkeleton />;

  if (!articles.length) return null;

  const top4 = articles.slice(0, 4);

  return (
    <div className="w-full mt-12 mb-6">
      <div className="mb-6 flex relative">
        <h3 className="text-[15px] font-bold text-[#e43f3e] uppercase tracking-wider py-2 border-b-[2px] border-[#e43f3e] z-10">
          TOP WEEK
        </h3>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-gray-800 -z-0"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {top4.map((article) => (
          <div key={article._id} className="group">
            <Link href={`/articles/${article.slug}`} className="block relative w-full h-[180px] mb-3 overflow-hidden">
              <Image
                src={article.image || article.thumbnail || ""}
                alt={article.headline}
                fill
                sizes="300px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {article.category?.name && (
                <div className="absolute bottom-0 left-0 bg-[#e43f3e] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                  {article.category.name}
                </div>
              )}
            </Link>
            <Link href={`/articles/${article.slug}`} className="block mb-2">
              <h4 className="font-bold text-[16px] text-gray-900 dark:text-white leading-snug group-hover:text-[#e43f3e] transition-colors line-clamp-3">
                {article.headline}
              </h4>
            </Link>
            <div className="flex items-center text-gray-500 text-[11px] font-medium gap-3">
              <span className="flex items-center gap-1">
                <FaEye className="mb-[1px]" /> {article.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <FaRegCommentDots className="mb-[1px]" /> {article.commentsCount || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}