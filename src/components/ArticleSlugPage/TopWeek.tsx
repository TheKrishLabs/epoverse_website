"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTopWeekArticles } from "@/services/topweek";
import { TrendingUp } from "lucide-react";

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

  category: Category;

  createdAt?: string;
  updatedAt?: string;

  commentsCount?: number;
  views?: number;
  likes?: number;

  isDeleted?: boolean;
};

function TopWeekSkeleton() {
  return (
    <div className="bg-card rounded-xl p-4 border border-border animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/3 rounded mb-4" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-3 py-2.5 border-b border-border last:border-0">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
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
    <div className="bg-card rounded-xl p-4 border border-border">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
        <TrendingUp size={11} /> Trending
      </h3>
      {top4.map((article, idx) => (
        <Link 
          key={article._id} 
          href={`/articles/${article.slug}`}
          className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-0 text-left w-full group"
        >
          <span className="text-xl font-bold text-border font-mono leading-none flex-shrink-0 w-6">
            {idx + 1}
          </span>
          <p className="text-xs text-card-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {article.headline}
          </p>
        </Link>
      ))}
    </div>
  );
}