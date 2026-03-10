import { Article } from "@/types/article";

export default function MegaContent({ articles }: { articles: Article[] }) {
  if (!articles?.length)
    return (
      <div className="text-center py-10 text-gray-400">No articles found</div>
    );

  return (
    <div className="grid grid-cols-4 gap-8">
      {/* BIG FEATURE */}

      {articles.slice(0, 4).map((item) => (
        <div key={item._id} className="group cursor-pointer mb-6">
          <div className="overflow-hidden rounded-lg">
            <img
              src={item.thumbnail}
              alt={item.headline}
              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <h3 className="mt-4 font-bold text-lg group-hover:text-red-500 transition">
            {item.headline}
          </h3>

          <p className="text-xs text-gray-400 mt-1">{item.category?.name}</p>
        </div>
      ))}
    </div>
  );
}
