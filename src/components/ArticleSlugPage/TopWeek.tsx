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
          (a:Article) => !a.isDeleted && a.status === "published"
        );

      setArticles(validArticles);
      setLoading(false);

    };

    fetchTopWeek();

  }, []);

  if (loading) return <TopWeekSkeleton />;

  if (!articles.length) return null;

  const main = articles[0];
  const others = articles.slice(1, 3);
  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="bg-black text-white px-4 py-2 font-semibold uppercase text-sm">
        TOP WEEK
      </div>

      {/* MAIN ARTICLE */}
      <Link href={`/articles/${main.slug}`}>

        <div className="relative w-full h-64 overflow-hidden">

          <Image
  src={
    main?.image ||
    main?.thumbnail || main.headline
  }
  alt={main.headline}
  fill
  sizes="80px"
  priority
  className="object-cover hover:scale-105 transition"
/>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 text-white">

            <span className="bg-red-600 px-3 py-1 text-xs w-fit mb-2 uppercase">
              {main.category?.name || "OTHERS"}
            </span>

            <h3 className="font-bold text-lg leading-snug">
              {main.headline}
            </h3>

            {/* Stats Row */}
            <div className="flex gap-4 text-xs mt-2 opacity-90">

              <span className="flex items-center gap-1">
                <FaEye />
                {main.views || 0}
              </span>

              <span className="flex items-center gap-1">
                <FaRegCommentDots />
                {main.commentsCount || 0}
              </span>

            </div>

          </div>

        </div>

      </Link>

      {/* SMALL ARTICLES */}
      <div className="space-y-4 mt-4">

        {others.map((article) => (

          <Link
            key={article._id}
            href={`/articles/${article.slug}`}
            className="flex gap-3 group"
          >

            <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded">

              <Image
                src={
                  article.image ||
                  article.thumbnail ||
                  "/placeholder.jpg"
                }
                alt={article.headline}
                fill
                className="object-cover group-hover:scale-105 transition"
              />

            </div>

            <div>

              <h4 className="text-sm font-medium leading-snug group-hover:text-red-500">
                {article.headline}
              </h4>

              {/* Small Stats */}
              <div className="flex gap-3 text-xs text-gray-500 mt-1">

                <span className="flex items-center gap-1">
                  <FaEye />
                  {article.views || 0}
                </span>

                <span className="flex items-center gap-1">
                  <FaRegCommentDots />
                  {article.commentsCount || 0}
                </span>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}