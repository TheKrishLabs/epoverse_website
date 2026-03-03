export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-4 gap-8 animate-pulse">

      {/* Big Skeleton */}
      <div className="col-span-2">
        <div className="w-full h-72 bg-gray-800 rounded-lg"></div>
        <div className="mt-4 h-6 bg-gray-800 rounded w-3/4"></div>
      </div>

      {/* Small Skeletons */}
      <div className="col-span-2 flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-32 h-24 bg-gray-800 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}