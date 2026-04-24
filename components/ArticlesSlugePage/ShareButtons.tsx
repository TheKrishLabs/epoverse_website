"use client";

import { FaWhatsapp } from 'react-icons/fa';

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
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors font-medium shadow-sm text-sm"
      >
        <FaWhatsapp size={18} />
        <span>WhatsApp</span>
      </button>
    </div>
  );
}