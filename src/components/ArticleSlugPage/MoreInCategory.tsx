"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { fetchArticlesByCategoryId } from "@/services/articleService";

type Article = {
  _id: string;
  headline: string;
  slug: string;
  image?: string;
  thumbnail?: string;
  createdAt?: string;
  category?: {
    _id?: string;
    name: string;
  };
};

/*
  Reference: App.tsx lines 843-850
  Container: bg-card rounded-xl p-4 border border-border
  Header:    text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2  (with category color)
  Cards use StandardCard horizontal (lines 384-396):
    - Wrapper: flex gap-3 group cursor-pointer py-3 border-b border-border last:border-0
    - Image:   relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-secondary
    - Category: text-[9px] font-bold uppercase tracking-widest  (with category color)
    - Title:   text-sm font-semibold text-card-foreground group-hover:text-foreground transition-colors line-clamp-2 leading-snug mt-0.5
    - Time:    text-[11px] text-muted-foreground mt-1 flex items-center gap-1
*/

export default function MoreInCategory({
  categoryId,
  categoryName,
  currentArticleId,
}: {
  categoryId: string;
  categoryName: string;
  currentArticleId: string;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORY_COLORS: Record<string, string> = {
    International: "#5B8DEF",
    Entertainment: "#FF5C8A",
    Education: "#2FC6A0",
    Sports: "#FFB238",
    Finance: "#4AD991",
    Technology: "#B18CFF",
    Home: "#FF4747",
  };

  const color = CATEGORY_COLORS[categoryName] || "#FF4747";

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArticlesByCategoryId(categoryId);
        // Filter out the current article and take up to 3
        const filtered = (data || []).filter(
          (a: Article) => a._id !== currentArticleId
        );
        setArticles(filtered.slice(0, 3));
      } catch (err) {
        console.error("MoreInCategory load error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (categoryId) {
      load();
    } else {
      setLoading(false);
    }
  }, [categoryId, currentArticleId]);

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 w-2/3 rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
            <div className="w-24 h-20 bg-gray-300 dark:bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles.length) return null;

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      {/* Header — ref line 844-846 */}
      <h3
        className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
        style={{ color }}
      >
        <span
          className="w-1 h-3 rounded-full inline-block"
          style={{ background: color }}
        />
        More in {categoryName}
      </h3>

      {/* Cards — ref StandardCard horizontal (lines 384-396) */}
      {articles.map((article) => (
        <Link
          key={article._id}
          href={`/articles/${article.slug}`}
          className="flex gap-3 group cursor-pointer py-3 border-b border-border last:border-0"
        >
          <div className="relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-secondary">
            <Image
              src={article.image || article.thumbnail || "https://via.placeholder.com/150"}
              alt={article.headline}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color }}
            >
              {categoryName}
            </span>
            <h4 className="text-sm font-semibold text-card-foreground group-hover:text-foreground transition-colors line-clamp-2 leading-snug mt-0.5">
              {article.headline}
            </h4>
            {article.createdAt && (
              <span className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <Clock size={9} />{" "}
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
