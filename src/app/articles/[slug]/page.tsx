import Image from "next/image";
import Breadcrumb from "../../../../components/ArticlesSlugePage/Breadcrumb";
import ShareButtons from "../../../../components/ArticlesSlugePage/ShareButtons";
import PopularPosts from "../../../../components/ArticlesSlugePage/PopularPosts";
import { getArticleBySlug } from "@/services/articleService";
import Comments from "@/components/ArticleSlugPage/Comments";
import BookmarkButton from "@/components/ArticleSlugPage/BookmarkButton";
import VotingPoll from "@/components/ArticleSlugPage/VotingPoll";

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  console.log("  article after slug ", article);
  if (!article) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Article not found
      </div>
    );
  }

  const imageSrc =
    article.image || article.thumbnail || "https://via.placeholder.com/800x400";

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <Breadcrumb category={article.category?.name} title={article.headline} />

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT ARTICLE CONTENT */}
        <div className="col-span-8">
          <p className="text-red-500 font-semibold mb-2">
            {article.category?.name}
          </p>

          <h1 className="text-4xl font-bold leading-snug mb-4">
            {article.headline}
          </h1>

          {/* Author + Date */}
          <div className="flex items-center gap-4 text-gray-500 mb-4">
            <span>{article.author || "Admin"}</span>
            <span>
              {article.createdAt
                ? new Date(article.createdAt).toDateString()
                : ""}
            </span>
          </div>

          
          {/* Share Buttons and bookmark */}
<div className="flex items-center gap-4">
  <ShareButtons />
  <BookmarkButton postId={article._id} />
</div>

          {/* Image */}
          <div className="relative w-full h-[420px] rounded-lg overflow-hidden mt-6 mb-8">
            <Image
              src={imageSrc}
              alt={article.headline}
              fill
              className="object-cover"
            />
          </div>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-4">
          <PopularPosts />
          <VotingPoll />
        </div>
      </div>

      {/* Comment on Articles */}
      <Comments articleId={article._id} />
    </main>
  );
}
