"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSearch,
  FaGlobe,
  FaClock,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { CircleUser } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import SkeletonLoader from "./Skelton";
import MegaContent from "./MegaContent";
import { fetchArticlesByCategoryId } from "@/services/articleService";
import { Article } from "@/types/article";
import LoginModal from "../../../components/Login/LoginModal";
import { LogOut } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { Category } from "@/types/category";
import { getCategories } from "@/services/categoryService";

interface HeaderProps {
  categories: any[];
}

const Header = () => {
  const router = useRouter();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef<Record<string, Article[]>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats: Category[] = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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

  const handleCategoryClick = (slug: string) => {
    setHoveredCat(null);
    setMobileMenuOpen(false);
    router.push(`/category/${slug}`);
  };

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

  const handleHover = (categoryId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setHoveredCat(categoryId);

      if (cacheRef.current[categoryId]) {
        setArticles(cacheRef.current[categoryId]);
        return;
      }

      setLoading(true);

      try {
        const fetchedArticles: Article[] =
          await fetchArticlesByCategoryId(categoryId);
        cacheRef.current[categoryId] = fetchedArticles;
        setArticles(fetchedArticles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  const logoutUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      alert("Are you sure want to logout");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      router.push("/");
    }
  };

  return (
    <>
      <div className="bg-white border-b text-sm dark:bg-[#0a0a0a] dark:border-gray-800">
        <div className="w-full max-w-[1360px] mx-auto flex items-center justify-between py-2 px-4">
          <div className="hidden sm:flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-medium">
            <FaClock className="text-xs text-gray-400" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 md:gap-4 text-gray-700 dark:text-gray-300 flex-wrap">
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link href="/registration" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  Registration
                </Link>
              </>
            )}

            <ThemeToggle />

            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 border px-3 py-1 rounded text-xs cursor-pointer bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <FaGlobe />
                <span>{selectedLang}</span>
              </div>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg text-sm z-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                  <div
                    onClick={() => handleLandSelected("English")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                  >
                    English
                  </div>
                  <div
                    onClick={() => handleLandSelected("Telugu")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                  >
                    Telugu
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 ml-2">
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

            {isLoggedIn && (
              <>
                <div className="ml-2 md:ml-10">
                  <button onClick={logoutUser} className="hover:text-red-500 transition-colors cursor-pointer">
                    <LogOut size={20} />
                  </button>
                </div>
                <div className="ml-2 md:ml-4">
                  <Link href="/profile">
                    <button className="hover:text-red-500 transition-colors cursor-pointer">
                      <CircleUser size={20} />
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border-b-2 border-black dark:border-white">
        <div className="w-full max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4">
          <Link
            href="/"
            className="text-4xl md:text-5xl font-black tracking-tight flex items-center transition-transform hover:scale-[1.02] duration-300 mb-4 md:mb-0"
          >
            <span className="text-black dark:text-white">Epo</span>
            <span className="text-[#e43f3e]">Verse.</span>
          </Link>

          <div className="hidden lg:flex bg-gray-100 dark:bg-gray-800 w-[728px] h-[90px] items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium tracking-widest border border-gray-200 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-8 bg-[#e43f3e] flex items-center justify-center -rotate-180" style={{ writingMode: 'vertical-rl' }}>
              <span className="text-white text-[10px] font-bold tracking-widest">AD</span>
            </div>
            <span className="ml-6">ADVERTISEMENT SPACE / 728 x 90</span>
          </div>

          <button
            className="lg:hidden absolute top-14 right-4 text-2xl text-gray-700 dark:text-gray-200 p-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

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
        <div className="w-full max-w-[1360px] mx-auto hidden lg:flex items-center justify-between px-4">
          <ul className="flex items-center text-white text-[13px] font-bold py-0 h-14">
            <Link href="/" className="relative group cursor-pointer h-full flex items-center px-4 hover:bg-[#e43f3e] transition-colors">
              <span className="tracking-wider">HOME</span>
            </Link>

            {categories.map((cat) => (
              <li
                key={cat._id}
                onMouseEnter={() => handleHover(cat._id)}
                onClick={() => handleCategoryClick(cat.slug)}
                className="relative group cursor-pointer h-full flex items-center px-4 hover:bg-[#e43f3e] transition-colors border-l border-gray-800/50"
              >
                <div className="flex items-center gap-1">
                  <span className="tracking-wider">{cat.name.toUpperCase()}</span>
                  <IoIosArrowForward
                    className={`text-[10px] ml-1 transition-transform duration-300 ${hoveredCat === cat._id ? "rotate-90" : ""
                      }`}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="w-14 h-14 border-l border-gray-800/50 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#e43f3e] transition-colors cursor-pointer">
            <FaSearch size={16} />
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-black border-t border-gray-800">
            <ul className="flex flex-col text-white text-sm font-semibold">
              <Link
                href="/"
                className="px-6 py-3 border-b border-gray-800 hover:bg-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>

              {categories.map((cat) => (
                <li
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="px-6 py-3 border-b border-gray-800 hover:bg-gray-900 cursor-pointer flex items-center justify-between transition-colors"
                >
                  {cat.name.toUpperCase()}
                  <IoIosArrowForward />
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-800">
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
        )}

        {hoveredCat && (
          <div className="absolute left-0 top-full w-full bg-white shadow-2xl animate-fadeIn dark:bg-gray-900 dark:text-white">
            <div className="max-w-[1200px] mx-auto p-4 md:p-8">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <MegaContent
                  articles={articles}
                  closeMenu={() => setHoveredCat(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <LoginModal isOpen={isLoginOpen} onLogin={() => setIsLoggedIn(true)} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;
