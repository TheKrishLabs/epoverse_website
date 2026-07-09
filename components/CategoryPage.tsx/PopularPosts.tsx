"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPopularArticles } from "@/services/popularnews";
import Image from "next/image";
import { Clock } from "lucide-react";

type Article = {
  _id: string;
  headline: string;
  slug: string;
  content?: string;
  image?: string;
  thumbnail?: string;
  createdAt?: string;
  category?: {
    name: string;
  };
};

export default function PopularPosts() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPopular() {
      try {
        const data = await getPopularArticles();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Popular load error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPopular();
  }, []);

  const CATEGORY_COLORS: Record<string, string> = {
    International: "#5B8DEF",
    Entertainment: "#FF5C8A",
    Education: "#2FC6A0",
    Sports: "#FFB238",
    Finance: "#4AD991",
    Technology: "#B18CFF",
    Home: "#FF4747",
  };
  
  const getCategoryColor = (name?: string) => {
    return name && CATEGORY_COLORS[name] ? CATEGORY_COLORS[name] : "#FF4747";
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      {/* Header */}
      <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "#FF4747" }}>
        <span className="w-1 h-3 rounded-full inline-block" style={{ background: "#FF4747" }} />
        Popular Posts
      </h3>

      {/* Content */}
      <div className="flex flex-col">
        {loading ? (
          <div className="animate-pulse space-y-4">
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
        ) : articles.length > 0 ? (
          articles.slice(0, 3).map((article) => (
            <Link 
              key={article._id} 
              href={`/articles/${article.slug}`}
              className="flex gap-3 group cursor-pointer py-3 border-b border-border last:border-0"
            >
              <div className="relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-secondary">
                <Image 
                  src={article.thumbnail || article.image || "https://via.placeholder.com/150"} 
                  alt={article.headline} 
                  fill 
                  className="object-cover transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: getCategoryColor(article.category?.name) }}>
                  {article.category?.name || "News"}
                </span>
                <h4 className="text-sm font-semibold text-card-foreground group-hover:text-foreground transition-colors line-clamp-2 leading-snug mt-0.5">
                  {article.headline}
                </h4>
                {article.createdAt && (
                  <span className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock size={9} /> {new Date(article.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            No popular posts available
          </p>
        )}
      </div>
    </div>
  );
}