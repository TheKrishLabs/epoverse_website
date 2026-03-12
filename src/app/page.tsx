import { getArticles } from "@/services/articleService";
import { Article } from "@/types/article";
import Image from "next/image";
import Link from "next/link";
import { FaBolt } from "react-icons/fa";

export default async function Home() {
  const articles: Article[] = (await getArticles()) || [];

  const published = articles.filter(
    (article) => article.status === "published",
  );

  const mainArticle = published[0];
  const sideArticles = published.slice(1, 4);
  const bottomArticles = published.slice(4, 10);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* BREAKING BAR */}
      {mainArticle && (
        <div className="flex justify-between items-center bg-gray-100 border rounded-md px-4 py-3 mb-8">
          <span className="flex justify-between items-center bg-red-500 text-white px-3 py-1 text-base font-semibold rounded mr-3 text-center">
            <FaBolt /> Breaking
          </span>
          <Link href={`/articles/${mainArticle.slug}`}>
            {mainArticle.headline}
          </Link>
        </div>
      )}

      {/* TOP SECTION */}
      <div className="grid grid-cols-12 gap-8">
        {/* LEFT BIG ARTICLE */}
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

        {/* RIGHT SIDE SMALL ARTICLES */}
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
        </div>
      </div>

      {/* BOTTOM GRID SECTION */}
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
    </main>
  );
}
