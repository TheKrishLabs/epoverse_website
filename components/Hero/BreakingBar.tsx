export default function BreakingBar() {
  return (
    <div className="bg-gray-100 border rounded-md px-4 py-3 mb-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded">
          ⚡ Trending News
        </span>
        <p className="font-medium">
          Mass Gainer Benefits Uses & Muscle Growth Guide
        </p>
      </div>

      <div className="flex gap-2">
        <button className="bg-red-200 px-2 py-1 rounded">&lt;</button>
        <button className="bg-red-200 px-2 py-1 rounded">&gt;</button>
      </div>
    </div>
  );
}