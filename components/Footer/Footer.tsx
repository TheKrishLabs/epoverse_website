"use client";

import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowUp,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-black text-white mt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>

      <div className="relative max-w-[1300px] mx-auto px-6 py-14">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
          <h2 className="text-4xl font-bold">
            <span className="text-white">Epo</span>
            <span className="text-red-500">Verse.</span>
          </h2>

          <div className="flex gap-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map(
              (Icon, index: number) => (
                <div
                  key={index}
                  className="w-10 h-10 flex items-center justify-center border border-gray-600 rounded-full hover:border-red-500 hover:text-red-500 transition cursor-pointer"
                >
                  <Icon />
                </div>
              )
            )}
          </div>
        </div>

        <hr className="border-gray-700 mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-6 md:border-r md:border-gray-700 md:pr-8">
            <h3 className="text-xl font-semibold">About Us</h3>

            <p className="text-gray-400">
              Epoverse © 2026. All Rights Reserved.
            </p>

            <div className="space-y-4 text-gray-300 text-sm">
              <p className="flex items-center gap-3">
                <FaMapMarkerAlt /><span>Hindupur, Andhra Pradesh</span>
              </p>
              <p className="flex items-center gap-3">
                <FaPhoneAlt /><span>+880 123 4567890</span>
              </p>
              <p className="flex items-center gap-3">
                <FaEnvelope /><span>hello@epoverse.com</span>
              </p>
            </div>
          </div>

          <div className="space-y-6 md:border-r md:border-gray-700 md:px-8">
            <h3 className="text-xl font-semibold">Categories</h3>

            <div className="grid grid-cols-2 gap-3 text-gray-300 text-sm">
              <p className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 cursor-pointer">Health</p>
              <p className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 cursor-pointer">International</p>
              <p className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 cursor-pointer">Investing</p>
              <p className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 cursor-pointer">Finance</p>
              <p className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 cursor-pointer">Technology</p>
              <p className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 cursor-pointer">Sports</p>
              <p className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 cursor-pointer">Movies</p>
            </div>
          </div>

          <div className="space-y-6 md:border-r md:border-gray-700 md:px-8">
            <h3 className="text-xl font-semibold">Company</h3>
            <p className="text-gray-300 text-sm hover:text-red-500 transition-all duration-300 hover:translate-x-1 cursor-pointer">Privacy and Policies</p>
          </div>

          <div className="space-y-6 md:pl-8">
            <h3 className="text-xl font-semibold">
              Sign Up For Our Newsletter
            </h3>

            <p className="text-gray-400 text-sm">
              Subscribe to our newsletter to get our newest articles instantly!
            </p>

            <div className="flex mt-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-l-md text-black outline-none"
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-r-md font-semibold transition"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400 gap-4">
          <p className="text-center sm:text-left">Designed and Developed By krishlabs</p>
          <p>Business</p>
        </div>
      </div>

      {showButton && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-red-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition z-50 text-white cursor-pointer"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;