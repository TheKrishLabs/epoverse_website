import Link from "next/link";
import Image from "next/image";
import { FaUser, FaClock, FaBolt } from "react-icons/fa";
import Breadcrumb from "../../../../components/CategoryPage.tsx/Breadcrumb";
import PopularPosts from "../../../../components/CategoryPage.tsx/PopularPosts";
import TopWeek from "@/components/ArticleSlugPage/TopWeek";
import AdSpace from "@/components/Sidebar/AdSpace";
import { fetchArticlesByCategorySlug } from "@/services/articleService";
import { Article } from "@/types/article";

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const articles: Article[] = await fetchArticlesByCategorySlug(params.slug);
  const publishedArticles = articles.filter((a) => a.status === "published");
  
  const categoryName = params.slug.replace(/-/g, ' ');

  const heroArticle = publishedArticles[0];
  const gridArticles = publishedArticles.slice(1, 3);
  const listArticles = publishedArticles.slice(3);

  return (
    <main className="max-w-[1360px] mx-auto px-4 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <Breadcrumb category={params.slug} />
        <div className="mt-4 flex relative">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight py-2 border-b-[3px] border-[#e43f3e] z-10">
            {categoryName}
          </h1>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-gray-800 -z-0"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Hero Article */}
          {heroArticle && (
            <div className="relative w-full h-[400px] md:h-[500px] group rounded-sm overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <Link href={`/articles/${heroArticle.slug}`} className="block w-full h-full">
                <Image 
                  src={heroArticle.image || heroArticle.thumbnail || ""} 
                  alt={heroArticle.headline} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="inline-flex items-center gap-1.5 bg-[#e43f3e] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 shadow-md mb-4">
                    <FaBolt /> Editor's Pick
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-gray-200 transition-colors tracking-tight">
                    {heroArticle.headline}
                  </h2>
                  <p className="text-gray-300 text-[15px] line-clamp-2 md:line-clamp-3 leading-relaxed mb-6 md:w-4/5">
                    {stripHtml(heroArticle.content || "").substring(0, 200)}...
                  </p>
                  <div className="flex items-center text-gray-300 text-[11px] font-bold uppercase tracking-wider gap-6">
                    <span className="flex items-center gap-1.5"><FaUser className="mb-[1px]" /> {heroArticle.author || "Admin"}</span>
                    <span className="flex items-center gap-1.5"><FaClock className="mb-[1px]" /> {formatDate(heroArticle.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid Articles */}
          {gridArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gridArticles.map((article) => (
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
                      {stripHtml(article.content || "")}
                    </p>
                    <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider gap-4 mt-auto">
                      <span className="flex items-center gap-1.5"><FaClock className="mb-[1px]" /> {formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* More Articles Grid */}
          {listArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t-[3px] border-black dark:border-white pt-8 mt-4">
              {listArticles.map((article, index) => {
                // Every 3rd article spans full width to break monotony and create a dynamic bento feel
                // If an article normally takes half width but is the very last item in the array, 
                // we force it to full width so it doesn't leave an empty gap.
                const isNaturallyFullWidth = index % 3 === 0;
                const isOrphanedLastItem = index === listArticles.length - 1 && index % 3 === 1;
                const isFullWidth = isNaturallyFullWidth || isOrphanedLastItem;

                return (
                  <div key={article._id} className={`group ${isFullWidth ? 'sm:col-span-2' : ''} flex flex-col ${isFullWidth ? 'sm:flex-row' : ''} gap-6 bg-white dark:bg-[#0a0a0a] rounded-sm`}>
                    <div className={`relative overflow-hidden rounded-sm flex-shrink-0 shadow-sm ${isFullWidth ? 'w-full sm:w-1/2 md:w-[55%] h-64 md:h-80' : 'w-full h-56'}`}>
                      <Link href={`/articles/${article.slug}`} className="block w-full h-full">
                        <Image src={article.image || article.thumbnail || ""} alt={article.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </Link>
                    </div>
                    <div className={`flex flex-col justify-center text-gray-900 dark:text-gray-100 ${isFullWidth ? 'w-full sm:w-1/2 md:w-[45%] py-4 sm:pr-4' : 'pt-4'}`}>
                      <Link href={`/articles/${article.slug}`} className="block mb-3">
                        <h4 className={`font-black leading-tight group-hover:text-[#e43f3e] transition-colors tracking-tight ${isFullWidth ? 'text-2xl md:text-[28px]' : 'text-xl md:text-[22px]'} line-clamp-3`}>
                          {article.headline}
                        </h4>
                      </Link>
                      <p className={`text-gray-600 dark:text-gray-400 leading-relaxed mb-4 ${isFullWidth ? 'text-[15px] line-clamp-4' : 'text-[14px] line-clamp-2'}`}>
                        {stripHtml(article.content || "")}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-gray-400 text-[11px] font-bold uppercase tracking-wider border-t border-gray-100 dark:border-[#222] pt-4">
                        <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400"><FaUser className="mb-[1px]" /> {article.author || "Admin"}</span>
                        <span className="flex items-center gap-1.5 text-[#e43f3e]"><FaClock className="mb-[1px]" /> {formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {publishedArticles.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-[#111] rounded-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 tracking-wide">No articles found in this category yet.</h3>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10 border-t border-gray-200 dark:border-gray-800 pt-8 lg:border-t-0 lg:pt-0 lg:sticky lg:top-24 lg:self-start lg:h-max lg:pb-8">
          <div className="hidden lg:block">
            <AdSpace />
          </div>
          <PopularPosts />
          <TopWeek />
        </div>
      </div>
    </main>
  );
}
