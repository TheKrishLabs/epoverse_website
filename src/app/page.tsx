"use client";
import Stories from "@/components/ArticleSlugPage/Stories";
import { getArticles } from "@/services/articleService";
import { Article } from "@/types/article";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBolt } from "react-icons/fa";
import TopWeek from "@/components/ArticleSlugPage/TopWeek";
import PopularPosts from "../../components/CategoryPage.tsx/PopularPosts";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await getArticles();
      setArticles(data || []);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const published = articles.filter(
    (article) => article.status === "published",
  );

  const mainArticle = published[0];
  const sideArticles = published.slice(1, 4);
  const bottomArticles = published.slice(4, 10);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md mb-8" />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <div className="w-full h-[450px] bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-28" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-3/4" />
          </div>
          <div className="col-span-4 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="w-full h-52 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-3 w-20" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mt-1 w-3/4" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {mainArticle && (
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded-md px-4 py-3 mb-8 transition-colors">
          <span className="flex justify-between items-center bg-red-500 text-white px-3 py-1 text-base font-semibold rounded mr-4 text-center gap-2 shadow-sm min-w-max">
            <FaBolt className="animate-pulse" /> Breaking
          </span>
          <Link 
            href={`/articles/${mainArticle.slug}`}
            className="text-gray-900 dark:text-gray-100 font-medium hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-1"
          >
            {mainArticle.headline}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {mainArticle && (
          <div className="col-span-8">
            <div className="relative w-full h-[450px] rounded-lg overflow-hidden">
              <Image
                src={mainArticle.image || mainArticle.thumbnail || ""}
                alt={mainArticle.headline}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-red-500 mt-4 font-semibold">
              {mainArticle.category?.name}
            </p>

            <Link href={`/articles/${mainArticle.slug}`}>
              <h2 className="text-3xl font-bold mt-2 hover:text-red-600">
                {mainArticle.headline}
              </h2>
            </Link>
          </div>
        )}

        <div className="col-span-4 space-y-6">
          {sideArticles.map((article) => (
            <div key={article._id} className="border-b pb-4">
              <p className="text-sm text-red-500 font-medium">
                {article.category?.name}
              </p>

              <Link href={`/articles/${article.slug}`}>
                <h4 className="font-semibold text-lg hover:text-red-500">
                  {article.headline}
                </h4>
              </Link>
            </div>
          ))}
          <div className="col-span-4">
            <PopularPosts />
          </div>

          <div className="col-span-4 mt-8">
            <TopWeek />
          </div>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {bottomArticles.map((article) => (
          <div key={article._id} className="group cursor-pointer">
            <div className="relative w-full h-52 rounded-lg overflow-hidden">
              <Image
                src={article.image || article.thumbnail || ""}
                alt={article.headline}
                fill
                className="object-cover group-hover:scale-105 transition"
              />
            </div>

            <p className="text-sm text-red-500 mt-3 font-medium">
              {article.category?.name}
            </p>

            <Link href={`/articles/${article.slug}`}>
              <h2 className="text-lg font-semibold mt-1 group-hover:text-red-600">
                {article.headline}
              </h2>
            </Link>
          </div>
        ))}
      </div>
      <div className="w-full px-4">
        <Stories />
      </div>
    </main>
  );
}

