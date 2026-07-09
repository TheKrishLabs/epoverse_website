"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/services/articleService";

type Article = {
  _id: string;
  headline: string;
  slug: string;
  image?: string;
  thumbnail?: string;
  author?: string;
  createdAt?: string;
  category?: {
    _id?: string;
    name: string;
  };
};

/*
  Reference: App.tsx lines 874-884
  Container: <section className="mt-10">
  Header:
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1 h-5 rounded-full" style={{ background: "#FF4747" }} />
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">You May Also Like</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  Grid: <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
  StandardCard (lines 357-380):
    - Wrapper: flex flex-col group cursor-pointer
    - Image: relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-secondary mb-3
    - Category tag: absolute top-3 left-3 px-2 py-1 bg-card/90 backdrop-blur text-[9px] font-bold uppercase tracking-widest rounded
    - Title: text-[15px] font-bold text-card-foreground group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-3
    - Meta: flex items-center gap-2 text-[11px] text-muted-foreground
*/

export default function YouMayAlsoLike({
  currentArticleId,
}: {
  currentArticleId: string;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const CAT: Record<string, string> = {
    International: "#5B8DEF",
    Entertainment: "#FF5C8A",
    Education: "#2FC6A0",
    Sports: "#FFB238",
    Finance: "#4AD991",
    Technology: "#B18CFF",
    Home: "#FF4747",
  };

  const getCategoryColor = (categoryName?: string) => {
    if (!categoryName) return "#FF4747";
    // Match case-insensitively just in case
    const match = Object.keys(CAT).find(
      (k) => k.toLowerCase() === categoryName.toLowerCase()
    );
    return match ? CAT[match] : "#FF4747";
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getArticles();
        // Filter out current article and get exactly 4
        const filtered = (data || []).filter(
          (a: Article) => a._id !== currentArticleId
        );
        // Maybe shuffle or just take the top 4
        setArticles(filtered.slice(0, 4));
      } catch (err) {
        console.error("YouMayAlsoLike load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentArticleId]);

  if (loading) {
    return (
      <section className="mt-10 animate-pulse">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-1 h-5 rounded-full bg-[#FF4747]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            You May Also Like
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="w-full aspect-[3/2] rounded-xl bg-gray-300 dark:bg-gray-700 mb-3" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2" />
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!articles.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-1 h-5 rounded-full"
          style={{ background: "#FF4747" }}
        />
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          You May Also Like
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {articles.map((article) => {
          const categoryName = article.category?.name || "News";
          const color = getCategoryColor(categoryName);
          return (
            <Link
              key={article._id}
              href={`/articles/${article.slug}`}
              className="flex flex-col group cursor-pointer"
            >
              <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-secondary mb-3">
                <Image
                  src={
                    article.thumbnail ||
                    article.image ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt={article.headline}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute top-3 left-3 px-2 py-1 bg-card/90 backdrop-blur text-[9px] font-bold uppercase tracking-widest rounded shadow-sm z-10"
                  style={{ color }}
                >
                  {categoryName}
                </span>
              </div>
              <h4 className="text-[15px] font-bold text-card-foreground group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-3">
                {article.headline}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-auto">
                <span className="font-semibold">{article.author || "Admin"}</span>
                <span>·</span>
                {article.createdAt ? (
                  <span>
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                ) : (
                  <span>Recent</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
