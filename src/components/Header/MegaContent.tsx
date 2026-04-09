import { Article } from "@/types/article";
import Link from "next/link";

export default function MegaContent({
  articles,
  closeMenu,
}: {
  articles: Article[];
  closeMenu: () => void;
}) {
  if (!articles?.length)
    return (
      <div className="text-center py-10 text-gray-400">No articles found</div>
    );
return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {articles.slice(0, 4).map((item) => (
      <Link
        key={item._id}
        href={`/articles/${item.slug}`}
        className="group cursor-pointer block"
        onClick={closeMenu}
      >
        <div className="overflow-hidden rounded-lg">
          <img
            src={item.image}
            alt={item.headline}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <h3 className="mt-4 font-bold text-lg group-hover:text-red-500 transition">
          {item.headline}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {item.category?.name}
        </p>
      </Link>
    ))}
  </div>
);
}
