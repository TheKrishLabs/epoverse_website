interface Article {
  _id: string;
  headline: string;
  thumbnail: string;
  image?: string;
  slug: string;
  createdAt: string;
  category?: {
    _id: string;
    name: string;
  };
}

export default function MegaContent({ articles }: { articles: Article[] }) {
  if (!articles?.length)
    return (
      <div className="text-center py-10 text-gray-400">
        No articles found
      </div>
    );

  return (
    <div className="grid grid-cols-4 gap-8">

      {/* BIG FEATURE */}
      <div className="col-span-2 group cursor-pointer">
        <div className="overflow-hidden rounded-lg">
          <img
            src={articles[0]?.thumbnail}
            alt={articles[0]?.headline}
            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <h3 className="mt-4 font-bold text-lg group-hover:text-red-500 transition">
          {articles[0]?.headline}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {articles[0]?.category?.name}
        </p>
      </div>

      {/* SMALL ARTICLES */}
      <div className="col-span-2 flex flex-col gap-6">
        {articles.slice(1, 4).map((item) => (
          <div key={item._id} className="flex gap-4 group cursor-pointer">

            <div className="overflow-hidden rounded-md w-32 h-24 flex-shrink-0">
              <img
                src={item.thumbnail}
                alt={item.headline}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold group-hover:text-red-500 transition">
                {item.headline}
              </h4>

              <p className="text-xs text-gray-400 mt-1">
                {item.category?.name}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}