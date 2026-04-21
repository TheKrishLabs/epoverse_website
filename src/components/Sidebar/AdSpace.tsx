"use client";

export default function AdSpace() {
  return (
    <div className="w-full">
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden" style={{ height: 120 }}>
        <div className="absolute top-0 left-0 bottom-0 w-8 bg-[#e43f3e] flex items-center justify-center -rotate-180" style={{ writingMode: 'vertical-rl' as const }}>
          <span className="text-white text-[10px] font-bold tracking-widest">ADVERTISEMENT</span>
        </div>
        <div className="text-center ml-4">
          <div className="text-gray-400 dark:text-gray-500 text-sm md:text-base font-medium tracking-widest">ADVERTISEMENT SPACE</div>
          <div className="text-gray-300 dark:text-gray-600 text-xs mt-1">RESPONSIVE x 120</div>
        </div>
      </div>
    </div>
  );
}
