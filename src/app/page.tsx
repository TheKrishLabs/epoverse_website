"use client";
import Stories from "@/components/ArticleSlugPage/Stories";
import { getArticles } from "@/services/articleService";
import { Article } from "@/types/article";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBolt, FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";
import TopWeek from "@/components/ArticleSlugPage/TopWeek";
import PopularPosts from "../../components/CategoryPage.tsx/PopularPosts";
import FollowUs from "@/components/Sidebar/FollowUs";
import AdSpace from "@/components/Sidebar/AdSpace";

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
  const stackedArticles = published.slice(1, 3);
  const rightColumnArticles = published.slice(3, 7);
  const bottomArticles = published.slice(7, 26);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-2 h-[450px] bg-gray-200 dark:bg-gray-800" />
          <div className="flex flex-col gap-6">
            <div className="h-[213px] bg-gray-200 dark:bg-gray-800" />
            <div className="h-[213px] bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800" />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1360px] mx-auto px-4 py-8">
      {mainArticle && (
        <div className="flex flex-col sm:flex-row sm:items-center bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 mb-8 overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-[#e43f3e] text-white px-5 py-2.5 font-bold flex items-center gap-2 whitespace-nowrap text-sm tracking-wide">
            <FaBolt className="animate-pulse" /> Breaking News
          </div>
          <div className="flex-grow px-4 py-2 truncate text-sm">
            <Link
              href={`/articles/${mainArticle.slug}`}
              className="text-gray-800 dark:text-gray-200 font-medium hover:text-[#e43f3e] dark:hover:text-[#e43f3e] transition-colors"
            >
              {mainArticle.headline}
            </Link>
          </div>
          <div className="hidden sm:flex px-2 text-gray-500 gap-1 mt-2 sm:mt-0 mb-2 sm:mb-0 mr-2">
            <button className="bg-gray-200 dark:bg-gray-800 w-7 h-7 flex items-center justify-center text-xs hover:bg-[#e43f3e] hover:text-white dark:hover:bg-[#e43f3e] transition-colors">&lt;</button>
            <button className="bg-gray-200 dark:bg-gray-800 w-7 h-7 flex items-center justify-center text-xs hover:bg-[#e43f3e] hover:text-white dark:hover:bg-[#e43f3e] transition-colors">&gt;</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        {mainArticle && (
          <div className="lg:col-span-2 group relative">
            <Link href={`/articles/${mainArticle.slug}`} className="block relative w-full h-[350px] lg:h-full min-h-[350px] overflow-hidden rounded-sm">
              <Image
                src={mainArticle.image || mainArticle.thumbnail || ""}
                alt={mainArticle.headline}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 md:from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                {mainArticle.category?.name && (
                  <span className="inline-block bg-[#111] text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 mb-3 hover:bg-[#e43f3e] transition-colors">
                    {mainArticle.category.name}
                  </span>
                )}
                <h2 className="text-2xl md:text-[28px] font-bold text-white leading-snug mb-3 group-hover:text-gray-200 transition-colors">
                  {mainArticle.headline}
                </h2>
                <div className="flex items-center text-white/80 text-[11px] font-medium gap-4">
                  <span className="flex items-center gap-1.5"><FaUser className="mb-[1px]" /> {mainArticle.author || "Admin"}</span>
                  <span className="flex items-center gap-1.5"><FaCalendarAlt className="mb-[1px]" /> {formatDate(mainArticle.createdAt)}</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {stackedArticles.map((article) => (
            <div key={article._id} className="relative group flex-1 min-h-[220px] lg:min-h-0">
              <Link href={`/articles/${article.slug}`} className="block relative w-full h-full overflow-hidden rounded-sm">
                <Image
                  src={article.image || article.thumbnail || ""}
                  alt={article.headline}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {article.category?.name && (
                    <span className="inline-block bg-[#111] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 mb-2 hover:bg-[#e43f3e] transition-colors">
                      {article.category.name}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-white leading-tight mb-2 group-hover:text-gray-200 transition-colors line-clamp-2">
                    {article.headline}
                  </h3>
                  <div className="flex items-center text-white/80 text-[10px] font-medium gap-3">
                    <span className="flex items-center gap-1"><FaUser /> {article.author || "Admin"}</span>
                    <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDate(article.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-0 lg:pl-6 space-y-6">
          {rightColumnArticles.map((article, idx) => (
            <div key={article._id} className={`flex gap-4 group ${idx !== rightColumnArticles.length - 1 ? 'pb-6 border-b border-gray-100 dark:border-gray-800' : ''}`}>
              {/* Optional Thumbnail */}
              <div className="relative w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden mt-1 shadow-sm">
                <Image src={article.thumbnail || article.image || "/placeholder.jpg"} alt={article.headline} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="flex-grow">
                <Link href={`/articles/${article.slug}`} className="block h-full flex flex-col justify-between">
                  <div>
                    {article.category?.name && (
                      <span className="text-[#e43f3e] text-[10px] font-black uppercase tracking-wider mb-1.5 block">
                        {article.category.name}
                      </span>
                    )}
                    <h4 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight group-hover:text-[#e43f3e] transition-colors mb-2 line-clamp-3">
                      {article.headline}
                    </h4>
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1.5 mt-auto pt-1">
                    <FaClock /> {formatDate(article.createdAt)}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="mb-6 flex relative">
            <h3 className="text-[15px] font-bold text-[#e43f3e] uppercase tracking-wider py-2 border-b-[2px] border-[#e43f3e] z-10">
              LATEST ARTICLES
            </h3>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-gray-800 -z-0"></div>
          </div>

          {/* Magazine Bento Layout for Latest Articles */}
          <div className="flex flex-col gap-8">

            {/* 1. Feature Horizontal Magazine Block (1 item) */}
            {bottomArticles[0] && (
              <div className="flex flex-col md:flex-row bg-white dark:bg-[#0a0a0a] group rounded-sm overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                <div className="md:w-[60%] relative h-64 md:h-[380px] overflow-hidden">
                  <Link href={`/articles/${bottomArticles[0].slug}`} className="block w-full h-full">
                    <Image src={bottomArticles[0].image || bottomArticles[0].thumbnail || ""} alt={bottomArticles[0].headline} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    {bottomArticles[0].category?.name && (
                      <span className="absolute top-4 left-4 bg-[#e43f3e] text-white text-[11px] font-black uppercase px-3 py-1.5 shadow-md">
                        {bottomArticles[0].category.name}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="md:w-[40%] p-6 md:p-8 flex flex-col justify-center text-gray-900 dark:text-white relative">
                  <div className="text-[#e43f3e] text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                    <FaBolt /> Featured
                  </div>
                  <Link href={`/articles/${bottomArticles[0].slug}`} className="block">
                    <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight group-hover:text-[#e43f3e] transition-colors tracking-tight">
                      {bottomArticles[0].headline}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-400 text-[15px] line-clamp-4 leading-relaxed mb-6">
                    {stripHtml(bottomArticles[0].content || "")}
                  </p>
                  <div className="flex items-center text-gray-500 text-[11px] font-bold uppercase tracking-wider gap-4 mt-auto">
                    <span className="flex items-center gap-1.5"><FaUser className="mb-[1px]" /> {bottomArticles[0].author || "Admin"}</span>
                    <span className="flex items-center gap-1.5"><FaClock className="mb-[1px]" /> {formatDate(bottomArticles[0].createdAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Dual Symmetrical Grid (2 items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bottomArticles.slice(1, 3).map((article) => (
                <div key={article._id} className="group border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col bg-white dark:bg-[#0a0a0a]">
                  <Link href={`/articles/${article.slug}`} className="block relative w-full h-56 overflow-hidden">
                    <Image src={article.image || article.thumbnail || ""} alt={article.headline} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    {article.category?.name && (
                      <span className="absolute bottom-0 left-0 bg-[#333] group-hover:bg-[#e43f3e] transition-colors text-white text-[10px] font-black uppercase px-2 py-1">
                        {article.category.name}
                      </span>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <Link href={`/articles/${article.slug}`} className="block mb-3">
                      <h3 className="text-[20px] font-black text-gray-900 dark:text-white leading-tight group-hover:text-[#e43f3e] transition-colors">
                        {article.headline}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 text-[14px] line-clamp-2 leading-relaxed mb-4">
                      {stripHtml(article.content)}
                    </p>
                    <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider gap-4 mt-auto">
                      <span className="flex items-center gap-1.5"><FaClock className="mb-[1px]" /> {formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Premium Editorial Stream (Dynamic Layout) for the rest (4+ items) */}
            <div className="flex flex-col gap-10 pt-8 border-t-[3px] border-black dark:border-white w-full">
              {bottomArticles.slice(3, 5).map((article, index) => {
                const isGiant = index % 5 === 4; // Every 5th item is a giant feature card to break visual monotony

                if (isGiant) {
                  return (
                    <div key={article._id} className="relative w-full h-[400px] group rounded-sm overflow-hidden shadow-md border border-gray-100 dark:border-[#222]">
                      <Link href={`/articles/${article.slug}`} className="block w-full h-full">
                        <Image src={article.image || article.thumbnail || ""} alt={article.headline} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                          {article.category?.name && (
                            <span className="inline-block bg-[#e43f3e] text-white text-[11px] font-black uppercase px-3 py-1.5 shadow-md mb-4">
                              {article.category.name}
                            </span>
                          )}
                          <h4 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-4 group-hover:text-[#e43f3e] transition-colors tracking-tight md:w-4/5">
                            {article.headline}
                          </h4>
                          <p className="text-gray-300 text-[15px] line-clamp-2 leading-relaxed md:w-3/4 mb-6">
                            {stripHtml(article.content || "").substring(0, 180) + "..."}
                          </p>
                          <div className="flex items-center text-gray-400 text-[11px] font-bold uppercase tracking-wider gap-6">
                            <span className="flex items-center gap-1.5"><FaUser className="mb-[1px]" /> {article.author || "Admin"}</span>
                            <span className="flex items-center gap-1.5"><FaClock className="mb-[1px]" /> {formatDate(article.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                }

                // Normal River Card
                return (
                  <div key={article._id} className="flex flex-col sm:flex-row gap-6 md:gap-8 group border-b border-gray-100 dark:border-[#222] pb-10 last:border-0">
                    <div className="w-full sm:w-[45%] h-60 relative overflow-hidden rounded-sm flex-shrink-0 shadow-sm">
                      <Link href={`/articles/${article.slug}`} className="block w-full h-full">
                        <Image src={article.image || article.thumbnail || ""} alt={article.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        {article.category?.name && (
                          <div className="absolute top-4 left-4 bg-[#333] text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 shadow-sm group-hover:bg-[#e43f3e] transition-colors">
                            {article.category.name}
                          </div>
                        )}
                      </Link>
                    </div>
                    <div className="w-full sm:w-[55%] flex flex-col justify-center text-gray-900 dark:text-gray-100 py-2">
                      <Link href={`/articles/${article.slug}`} className="block mb-4">
                        <h4 className="text-2xl md:text-[26px] font-black leading-tight group-hover:text-[#e43f3e] transition-colors tracking-tight line-clamp-3">
                          {article.headline}
                        </h4>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 text-[15px] line-clamp-3 md:line-clamp-4 leading-relaxed mb-6">
                        {stripHtml(article.content || "").substring(0, 180) + "..."}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><FaUser className="mb-[1px]" /> {article.author || "Admin"}</span>
                        <span className="flex items-center gap-1.5 text-[#e43f3e]"><FaClock className="mb-[1px]" /> {formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <PopularPosts />
          <FollowUs />
        </div>
      </div>

      <div className="w-full mt-10 mb-6">
        <AdSpace />
      </div>

      {/* Full-width dynamic magazine section to seamlessly expand into blank space */}
      {bottomArticles.length > 5 && (
        <div className="w-full mt-6 mb-12 border-t-[3px] border-black dark:border-white pt-10">
          <div className="flex flex-col gap-12">
            {(() => {
              const items = bottomArticles.slice(5);
              const layoutChunks = [];
              let index = 0;
              let pattern = 0;
              
              while (index < items.length) {
                // Determine the size needed for the current pattern in the loop
                // Pattern 0 needs 3 items, Pattern 1 needs 3 items, Pattern 2 needs 2 items.
                const chunkSize = (pattern % 3 === 2) ? 2 : 3;
                
                layoutChunks.push({
                  chunk: items.slice(index, index + chunkSize),
                  chunkIndex: pattern
                });
                
                index += chunkSize;
                pattern++;
              }
              return layoutChunks;
            })().map(({ chunk, chunkIndex }) => {

              // Layout Pattern 1: One huge majestic card on left, two beautiful smaller cards vertically stacked on right
              if (chunkIndex % 3 === 0 && chunk.length === 3) {
                return (
                  <div key={`pattern-1-${chunkIndex}`} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 h-[500px] relative group rounded-sm overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                      <Link href={`/articles/${chunk[0].slug}`} className="block w-full h-full">
                        <Image src={chunk[0].image || chunk[0].thumbnail || ""} alt={chunk[0].headline} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                          {chunk[0].category?.name && (
                            <span className="inline-block bg-[#e43f3e] text-white text-[11px] font-black uppercase px-3 py-1.5 shadow-md mb-4">{chunk[0].category.name}</span>
                          )}
                          <h4 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-[#e43f3e] transition-colors tracking-tight md:w-[85%]">{chunk[0].headline}</h4>
                          <p className="text-gray-300 text-[16px] line-clamp-2 leading-relaxed md:w-3/4 mb-6">{stripHtml(chunk[0].content || "").substring(0, 180) + "..."}</p>
                          <div className="flex items-center text-gray-400 text-[11px] font-bold uppercase tracking-wider gap-4">
                            <span className="flex items-center gap-1.5"><FaUser className="mb-[1px]" /> {chunk[0].author || "Admin"}</span>
                            <span className="flex items-center gap-1.5"><FaClock className="mb-[1px]" /> {formatDate(chunk[0].createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-6 h-[500px]">
                      {chunk.slice(1, 3).map(art => (
                        <div key={art._id} className="relative flex-1 group rounded-sm overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                          <Link href={`/articles/${art.slug}`} className="block w-full h-full">
                            <Image src={art.image || art.thumbnail || ""} alt={art.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              {art.category?.name && (
                                <span className="text-white bg-[#e43f3e] text-[10px] font-black uppercase tracking-wider mb-3 px-2 py-1 inline-block shadow-sm">{art.category.name}</span>
                              )}
                              <h4 className="text-xl font-bold text-white leading-tight group-hover:text-gray-300 transition-colors line-clamp-3">{art.headline}</h4>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Layout Pattern 2: 3 identical horizontal landscape cards (3-column pure grid)
              if (chunkIndex % 3 === 1 && chunk.length === 3) {
                return (
                  <div key={`pattern-2-${chunkIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {chunk.map(art => (
                      <div key={art._id} className="group flex flex-col gap-4">
                        <div className="relative w-full h-[260px] rounded-sm overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                          <Link href={`/articles/${art.slug}`} className="block w-full h-full">
                            <Image src={art.image || art.thumbnail || ""} alt={art.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            {art.category?.name && (
                              <div className="absolute top-3 left-3 bg-[#333] text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 shadow-sm group-hover:bg-[#e43f3e] transition-colors">{art.category.name}</div>
                            )}
                          </Link>
                        </div>
                        <div className="flex flex-col flex-grow pt-2">
                          <Link href={`/articles/${art.slug}`} className="block mb-3">
                            <h4 className="text-[22px] font-black leading-snug group-hover:text-[#e43f3e] transition-colors line-clamp-3 tracking-tight">{art.headline}</h4>
                          </Link>
                          <p className="text-gray-600 dark:text-gray-400 text-[15px] line-clamp-2 leading-relaxed mb-4 block">{stripHtml(art.content || "").substring(0, 150) + "..."}</p>
                          <div className="mt-auto text-[#e43f3e] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <FaClock className="mb-[1px]" /> {formatDate(art.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              // Layout Pattern 3: Compact 2-column list layout
              if (chunkIndex % 3 === 2) {
                return (
                <div key={`pattern-3-${chunkIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {chunk.map(art => (
                    <div key={art._id} className="flex flex-col sm:flex-row gap-6 group border border-gray-100 dark:border-[#222] rounded-sm overflow-hidden shadow-sm bg-white dark:bg-[#0a0a0a]">
                      <div className="w-full sm:w-[40%] h-48 relative overflow-hidden flex-shrink-0">
                        <Link href={`/articles/${art.slug}`} className="block w-full h-full">
                          <Image src={art.image || art.thumbnail || ""} alt={art.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          {art.category?.name && (
                            <div className="absolute bottom-0 left-0 bg-[#333] text-white text-[10px] font-black uppercase px-2 py-1 shadow-sm group-hover:bg-[#e43f3e] transition-colors">{art.category.name}</div>
                          )}
                        </Link>
                      </div>
                      <div className="w-full sm:w-[60%] flex flex-col justify-center p-4 md:p-6 text-gray-900 dark:text-gray-100">
                        <Link href={`/articles/${art.slug}`} className="block mb-3">
                          <h4 className="text-[18px] md:text-[20px] font-black leading-tight group-hover:text-[#e43f3e] tracking-tight transition-colors line-clamp-3">{art.headline}</h4>
                        </Link>
                        <div className="mt-auto flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider gap-4">
                          <span className="flex items-center gap-1.5"><FaClock className="mb-[1px]" /> {formatDate(art.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            
            return null;
          })}
        </div>
        </div>
      )}

      <TopWeek />

      <div className="w-full mt-12 pt-8 border-t-[3px] border-[#111] dark:border-[#222] px-0">
        <div className="mb-6 relative flex">
          <h3 className="text-[15px] font-bold text-[#e43f3e] uppercase tracking-wider bg-white dark:bg-[#0a0a0a] inline-block pr-6 z-10 relative">
            NEWS STORIES
          </h3>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 dark:bg-gray-800 -z-0"></div>
          <div className="ml-auto hidden sm:flex gap-1 z-10 items-center justify-center relative">
            <button className="bg-gray-100 dark:bg-gray-900 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#e43f3e] transition-colors text-xs">&lt;</button>
            <button className="bg-gray-100 dark:bg-gray-900 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#e43f3e] transition-colors text-xs">&gt;</button>
          </div>
        </div>
        <Stories />
      </div>
    </main>
  );
}
