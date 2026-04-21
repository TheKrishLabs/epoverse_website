export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col">
          {/* Image block */}
          <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          {/* Title lines */}
          <div className="mt-4 space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
          </div>
          {/* Category line */}
          <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
