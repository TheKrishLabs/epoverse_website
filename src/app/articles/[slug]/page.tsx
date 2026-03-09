import Image from "next/image";
import Breadcrumb from "../../../../components/ArticlesSlugePage/Breadcrumb";
import ShareButtons from "../../../../components/ArticlesSlugePage/ShareButtons";
import PopularPosts from "../../../../components/ArticlesSlugePage/PopularPosts";
import axios from "axios";

type Article = {
  _id: string;
  headline: string;
  content: string;
  image?: string;
  thumbnail?: string;
  slug: string;
  author?: string;
  createdAt?: string;
  category?: {
    name: string;
  };
};

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await axios.get(
      `https://project-epoverse-backend.onrender.com/api/articles/slug/${slug}`,
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

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

          {/* Share Buttons */}
          <ShareButtons />

          {/* Image */}
          <div className="relative w-full h-[420px] rounded-lg overflow-hidden mt-6 mb-8">
            <Image
              src={imageSrc}
              alt={article.headline}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose max-w-none">{article.content}</div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-4">
          <PopularPosts />
        </div>
      </div>
    </main>
  );
}
