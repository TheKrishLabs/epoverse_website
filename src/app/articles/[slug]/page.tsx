import Image from "next/image";
import Breadcrumb from "../../../../components/ArticlesSlugePage/Breadcrumb";
import ShareButtons from "../../../../components/ArticlesSlugePage/ShareButtons";
import { getArticleBySlug } from "@/services/articleService";
import Comments from "@/components/ArticleSlugPage/Comments";
import BookmarkButton from "@/components/ArticleSlugPage/BookmarkButton";
import VotingPoll from "@/components/ArticleSlugPage/VotingPoll";
import PopularPosts from "../../../../components/CategoryPage.tsx/PopularPosts";
import TopWeek from "@/components/ArticleSlugPage/TopWeek";
import Report from "@/components/ArticleSlugPage/Report";

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${params.slug}`;

  if (!article) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-500">
        Article not found
      </div>
    );
  }

  const imageSrc =
    article.image || article.thumbnail || "https://via.placeholder.com/800x400";

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 dark:bg-gray-950">
      <Breadcrumb category={article.category?.name} title={article.headline} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="mb-4">
            <span className="inline-block bg-red-100 dark:bg-red-900/30 text-[#e43f3e] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {article.category?.name || "News"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight sm:leading-tight lg:leading-tight mb-6 text-gray-900 dark:text-white tracking-tight">
            {article.headline}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-gray-200 dark:border-gray-800 mb-8 lg:mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400">
                {(article.author || "A")[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{article.author || "Admin"}</span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })
                    : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-800">
              <ShareButtons url={articleUrl} title={article.headline} />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
              <BookmarkButton postId={article._id} />
            </div>
          </div>

          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10 shadow-xl border border-gray-100 dark:border-gray-800 group">
            <Image
              src={imageSrc}
              alt={article.headline}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>

          <article
            className="prose max-w-none editorial-prose"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Report articleId={article._id} />
            <div className="mt-8">
              <Comments articleId={article._id} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 mt-6 lg:mt-0">
          <div className="sticky top-20 space-y-6">
            <PopularPosts />
            <TopWeek />
            <VotingPoll />
          </div>
        </div>
      </div>
    </main>
  );
}
