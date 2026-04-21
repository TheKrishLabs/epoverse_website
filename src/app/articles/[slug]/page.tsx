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
          <p className="text-red-600 font-semibold text-sm uppercase tracking-wide mb-3">
            {article.category?.name}
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-5 text-gray-900 dark:text-gray-100">
            {article.headline}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{article.author || "Admin"}</span>
              <span className="text-gray-400 dark:text-gray-500">·</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {article.createdAt
                  ? new Date(article.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
                  : ""}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShareButtons url={articleUrl} title={article.headline} />
              <BookmarkButton postId={article._id} />
            </div>
          </div>

          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-lg overflow-hidden mb-8">
            <Image
              src={imageSrc}
              alt={article.headline}
              fill
              className="object-cover"
              priority
            />
          </div>

          <article
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-red-500 hover:prose-a:text-red-600 prose-img:rounded-lg prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-blockquote:border-l-red-500"
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
