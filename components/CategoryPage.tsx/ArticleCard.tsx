import { Article } from "@/types/article";
import Link from "next/link";

export default function ArticleCard(article: Article) {
  return (
    <>
      <Link
        key={article._id}
        href={`/articles/${article.slug}`}
        className="group cursor-pointer block"
      >
        <div className="overflow-hidden rounded-lg">
          <img
            src={article.image}
            alt={article.headline}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <h3 className="mt-4 font-bold text-lg group-hover:text-red-500 transition">
          {article.headline}
        </h3>

        <p className="text-xs text-gray-400 mt-1">{article.category?.name}</p>
      </Link>
    </>
  );
}
