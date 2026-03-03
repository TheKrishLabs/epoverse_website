"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSearch,
  FaSun,
  FaGlobe,
  FaClock,
} from "react-icons/fa";
import LoginModal from "../Login/LoginModal";
import Link from "next/link";

import { IoIosArrowForward } from "react-icons/io";
import { fetchArticlesByCategoryId } from "@/lib/categoriesById";
import SkeletonLoader from "./Skelton";
import MegaContent from "./MegaContent";

interface Category {
  _id: string;
  name: string;
}

interface HeaderProps {
  categories: Category[];
}

const Header: React.FC<HeaderProps> = ({ categories }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // ===== MEGA MENU STATES =====
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cache store
  const cacheRef = useRef<Record<string, any[]>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOuside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOuside);
    return () => {
      document.removeEventListener("mousedown", handleClickOuside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setHoveredCat(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Date
  const today: Date = new Date();

  const formattedDate: string = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleLandSelected = (lang: string) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
  };
// hover
 const handleHover = (categoryId: string) => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);

  timeoutRef.current = setTimeout(async () => {
    setHoveredCat(categoryId);

    // ✅ If cached
    if (cacheRef.current[categoryId]) {
      setArticles(cacheRef.current[categoryId]);
      return;
    }

    setLoading(true);

    try {
      const data = await fetchArticlesByCategoryId(categoryId);
      const fetchedArticles = data || [];

      cacheRef.current[categoryId] = fetchedArticles;
      console.log(data)
      setArticles(fetchedArticles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, 200);
};
  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="bg-gray-100 border-b text-sm">
        <div className="w-full flex items-center justify-between py-2 px-12">
          {/* Left - Date */}
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-gray-500 text-xs" />
            <span>{formattedDate}</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-gray-700">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="hover:text-black"
            >
              Login
            </button>
            <span>|</span>
            <Link href="/registration" className="hover:text-black">
              Registration
            </Link>

            {/* Theme Icon */}
            <FaSun
              size={20}
              className="text-orange-500 cursor-pointer shadow rounded-xl"
            />

            {/* Language */}

            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 border px-3 py-1 rounded-full text-xs cursor-pointer bg-white hover:bg-gray-50"
              >
                <FaGlobe />
                <span>{selectedLang}</span>
              </div>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg text-sm z-50">
                  <div
                    onClick={() => handleLandSelected("English")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    English
                  </div>
                  <div
                    onClick={() => handleLandSelected("Telugu")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Telugu
                  </div>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 ml-2">
              <div className="bg-blue-600 text-white p-2 rounded-full text-xs cursor-pointer">
                <FaFacebookF />
              </div>
              <div className="bg-sky-400 text-white p-2 rounded-full text-xs cursor-pointer">
                <FaTwitter />
              </div>
              <div className="bg-pink-500 text-white p-2 rounded-full text-xs cursor-pointer">
                <FaInstagram />
              </div>
              <div className="bg-red-600 text-white p-2 rounded-full text-xs cursor-pointer">
                <FaYoutube />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LOGO + AD SECTION ================= */}
      <div className="bg-white">
        <div className="w-full flex items-center justify-between py-3 px-10">
          {/* Logo */}
          <Link
            href="/"
            className="text-4xl font-bold flex items-center transition-all duration-300 hover:scale-50"
          >
            <span className="text-black">Epo</span>
            <span className="text-red-600">Verse.</span>
          </Link>

          {/* Ad Banner */}
          <div className="bg-gray-300 w-[771px] h-[90px] flex items-center justify-center text-gray-500 text-2xl font-semibold">
            Banner
          </div>
        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <div
        ref={navRef}
        onMouseLeave={() => {
          timeoutRef.current = setTimeout(() => {
            setHoveredCat(null);
          }, 150);
        }}
        onMouseEnter={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
        className="sticky top-0 z-50 bg-black relative"
      >
        <div className="w-full flex items-center justify-around">
          <ul className="flex items-center gap-8 text-white text-sm font-semibold py-4 ">
            <li className="relative group cursor-pointer">
              <span className="group-hover:text-red-500">HOME</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 group-hover:w-full transition-all duration-300"></span>
            </li>

            {categories.map((cat) => (
              <li
                key={cat._id}
                onMouseEnter={() => handleHover(cat._id)}
                className="relative group cursor-pointer"
              >
                <div className="flex items-center gap-1 group-hover:text-red-500">
                  {cat.name.toUpperCase()}
                  <IoIosArrowForward
                    className={`transition-transform duration-300 ${
                      hoveredCat === cat._id ? "rotate-90" : ""
                    }`}
                  />
                </div>

                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </li>
            ))}
          </ul>

          <div className="bg-gray-800 p-3 rounded-full text-white hover:bg-red-500 transition">
            <FaSearch />
          </div>
        </div>

        {/* GLOBAL DROPDOWN */}
        {hoveredCat && (
          <div className="absolute left-0 top-full w-full bg-white shadow-2xl animate-fadeIn">
            <div className="max-w-[1200px] mx-auto p-8">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <MegaContent articles={articles} />
              )}
            </div>
          </div>
        )}
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;
