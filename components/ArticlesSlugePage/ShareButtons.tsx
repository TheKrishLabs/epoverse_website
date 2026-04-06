"use client";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const whatsappShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      title + " " + url
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={whatsappShare}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Share WhatsApp
      </button>
    </div>
  );
}