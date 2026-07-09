export default function AdSlot({
  size = "leaderboard",
  className = "",
}: {
  size?: "leaderboard" | "rectangle" | "halfpage" | "banner";
  className?: string;
}) {
  const dims: Record<string, { label: string; minH: string }> = {
    leaderboard: { label: "728 × 90", minH: "72px" },
    rectangle: { label: "300 × 250", minH: "250px" },
    halfpage: { label: "300 × 600", minH: "280px" },
    banner: { label: "468 × 60", minH: "64px" },
  };
  const { label, minH } = dims[size];
  
  return (
    <div
      className={`flex items-stretch border border-dashed border-[#33384A] rounded-lg overflow-hidden ${className}`}
      style={{
        minHeight: minH,
        background:
          "repeating-linear-gradient(135deg,#14161F,#14161F 10px,#171926 10px,#171926 20px)",
      }}
    >
      <div
        className="flex items-center justify-center px-2 flex-shrink-0 text-white text-[10px] font-bold tracking-widest"
        style={{ writingMode: "vertical-rl", background: "#FF4747" }}
      >
        AD
      </div>
      <div className="flex-1 flex items-center justify-center text-[#565C70] text-xs tracking-widest select-none">
        Advertisement · {label}
      </div>
    </div>
  );
}
