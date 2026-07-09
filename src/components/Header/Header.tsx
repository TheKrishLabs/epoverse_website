"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Sun, Moon, Menu, X, Search, ArrowRight, Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { Category } from "@/types/category";
import { getCategories } from "@/services/categoryService";
import { fetchArticlesByCategoryId } from "@/services/articleService";
import { Article } from "@/types/article";
import LoginModal from "../../../components/Login/LoginModal";
import RegistrationModal from "../../../components/Login/RegistrationModal";
import { useToast } from "@/components/ui/ToastProvider";

const CAT: Record<string, string> = {
  International: "#5B8DEF",
  Entertainment: "#FF5C8A",
  Education: "#2FC6A0",
  Sports: "#FFB238",
  Finance: "#4AD991",
  Technology: "#B18CFF",
  Home: "#FF4747",
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

function AdSlot({ size = "leaderboard", className = "" }: { size?: "leaderboard" | "rectangle" | "halfpage" | "banner"; className?: string }) {
  const dims: Record<string, { label: string; minH: string }> = {
    leaderboard: { label: "728 × 90", minH: "72px" },
    rectangle: { label: "300 × 250", minH: "250px" },
    halfpage: { label: "300 × 600", minH: "280px" },
    banner: { label: "468 × 60", minH: "64px" },
  };
  const { label, minH } = dims[size];
  return (
    <div className={`flex items-stretch border border-dashed border-[#33384A] rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: minH, background: "repeating-linear-gradient(135deg,#14161F,#14161F 10px,#171926 10px,#171926 20px)" }}>
      <div className="flex items-center justify-center px-2 flex-shrink-0 text-white text-[10px] font-bold tracking-widest"
        style={{ writingMode: "vertical-rl", background: "#FF4747" }}>AD</div>
      <div className="flex-1 flex items-center justify-center text-[#565C70] text-xs tracking-widest select-none">
        Advertisement · {label}
      </div>
    </div>
  );
}

function NavDropdown({ categoryName, categoryId, onClose }: { categoryName: string; categoryId: string; onClose: () => void }) {
  const color = CAT[categoryName] || "#FF4747";
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchArticlesByCategoryId(categoryId).then(data => {
      setArticles(data.slice(0, 3));
      setLoading(false);
    });
  }, [categoryId]);

  return (
    <div className="hidden md:block absolute top-full left-0 right-0 z-50 bg-card shadow-2xl border-b border-border"
      style={{ borderTop: `3px solid ${color}` }}>
      <div className="max-w-[1400px] mx-auto px-7 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{categoryName}</span>
          </div>
          <Link href={`/${categoryName.toLowerCase()}`} onClick={onClose}
            className="text-[11px] text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            All {categoryName} <ArrowRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3 w-full animate-pulse">
                <div className="w-20 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : articles.map(article => (
            <Link key={article._id} href={`/articles/${article.slug}`} onClick={onClose}
              className="flex gap-3 text-left group w-full">
              <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                <img src={article.image || article.thumbnail || "/placeholder.jpg"} alt={article.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">{article.headline}</p>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock size={9} /> {formatDate(article.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<{ id: string, name: string } | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const toggleDark = () => setTheme(isDark ? "light" : "dark");
  const pathname = usePathname();

  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const { showConfirm } = useToast();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCatsLoading(true);
    getCategories()
      .then(data => setCategories(data || []))
      .catch(console.error)
      .finally(() => setCatsLoading(false));
    if (localStorage.getItem("token")) setIsLoggedIn(true);
  }, []);

  const logoutUser = async () => {
    if (await showConfirm({ title: "Logout", message: "Are you sure you want to logout?", confirmText: "Logout", cancelText: "Stay", variant: "danger" })) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  };

  const getCatColor = (name?: string) => {
    if (!name) return "#FF4747";
    const key = Object.keys(CAT).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? CAT[key] : "#FF4747";
  };

  const navItems = [
    { label: "Home", color: "#FF4747", slug: "" },
    ...categories.map(c => ({ label: c.name, color: getCatColor(c.name), slug: c.slug, id: c._id }))
  ];

  const enterNav = (item: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (item.label === "Home") setHoveredCat(null);
    else setHoveredCat({ id: item.id, name: item.label });
  };

  const leaveNav = () => {
    hoverTimer.current = setTimeout(() => setHoveredCat(null), 200);
  };

  const cancelLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      <header className="sticky top-0 z-50 bg-background" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        {/* Utility bar */}
        <div className="flex items-center justify-between px-5 md:px-7 py-1.5 bg-muted border-b border-border text-[12px]">
          <div className="flex items-center gap-1.5 text-muted-foreground">
              <svg className="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
              </svg>
              <span className="hidden sm:inline" suppressHydrationWarning>{today}</span>
              <span className="sm:hidden" suppressHydrationWarning>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-foreground font-bold">
                {!isLoggedIn ? (
                  <>
                    <button onClick={() => setIsLoginOpen(true)} className="hover:text-[#e43f3e] transition-colors">Login</button>
                    <span className="text-border font-normal">/</span>
                    <button onClick={() => setIsRegistrationOpen(true)} className="hover:text-[#e43f3e] transition-colors">Register</button>
                  </>
                ) : (
                  <>
                    <Link href="/profile" className="hover:text-[#e43f3e] transition-colors">Profile</Link>
                    <span className="text-border font-normal">/</span>
                    <button onClick={logoutUser} className="hover:text-[#e43f3e] transition-colors">Logout</button>
                  </>
                )}
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 border border-border bg-background rounded-full text-muted-foreground text-[11px]">
                <Globe size={11} /><span>English</span>
              </div>
              {/* Dark/Light toggle */}
              <button onClick={toggleDark}
                className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-background/80 transition-all"
                aria-label="Toggle theme">
                {mounted ? (isDark ? <Sun size={13} /> : <Moon size={13} />) : <div className="w-[13px] h-[13px]" />}
              </button>
              {/* Socials */}
              <div className="flex items-center gap-1.5">
                {([
                  ["Facebook", "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12"],
                  ["Twitter", "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1"],
                  ["Instagram", "M12 2.2c2.7 0 3 0 4.1.1 1 .1 1.7.2 2.3.5.6.2 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.3.6.4 1.3.5 2.3.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 1-.2 1.7-.5 2.3-.2.6-.6 1.1-1.1 1.6-.5.5-1 .8-1.6 1.1-.6.3-1.3.4-2.3.5-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1-.1-1.7-.2-2.3-.5-.6-.2-1.1-.6-1.6-1.1-.5-.5-.8-1-1.1-1.6-.3-.6-.4-1.3-.5-2.3C2.2 15 2.2 14.7 2.2 12s0-3 .1-4.1c.1-1 .2-1.7.5-2.3.2-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2.3-.5C9 2.2 9.3 2.2 12 2.2M12 0C9.3 0 8.9 0 7.8.1c-1.2.1-2 .3-2.7.6a5.9 5.9 0 0 0-2.1 1.4A5.9 5.9 0 0 0 1.6 4.2c-.3.7-.5 1.5-.6 2.7C.9 8 .9 8.3.9 11s0 3 .1 4.1c.1 1.2.3 2 .6 2.7.3.7.7 1.4 1.4 2.1.6.6 1.3 1 2.1 1.4.7.3 1.5.5 2.7.6C8.9 22 9.3 22 12 22s3.1 0 4.2-.1c1.2-.1 2-.3 2.7-.6a5.9 5.9 0 0 0 2.1-1.4 5.9 5.9 0 0 0 1.4-2.1c.3-.7.5-1.5.6-2.7.1-1.1.1-1.5.1-4.1s0-3.1-.1-4.2c-.1-1.2-.3-2-.6-2.7a5.9 5.9 0 0 0-1.4-2.1A5.9 5.9 0 0 0 18.9.7c-.7-.3-1.5-.5-2.7-.6C15.1 0 14.7 0 12 0Z M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z"],
                ] as [string, string][]).map(([name, d]) => (
                  <a key={name} href="#" aria-label={name}
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-background border border-border text-muted-foreground hover:bg-[#e43f3e] hover:text-white transition-all duration-150">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d={d} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

        {/* Masthead */}
        <div className="flex items-center justify-between gap-6 px-5 md:px-7 py-3 md:py-4 bg-background border-b border-border">
          <Link href="/" className="flex-shrink-0 block">
            <div className="flex items-end" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>
              <span className="text-foreground">Epo</span>
                <span className="text-[#e43f3e]">Verse.</span>
              </div>
              <div className="mt-1 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                EVERY WORLD <span className="text-[#e43f3e] font-bold">·</span> ONE PAGE
              </div>
            </Link>
            <div className="hidden lg:flex flex-1 max-w-[560px]">
              <AdSlot size="leaderboard" className="w-full h-[74px]" />
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-secondary text-card-foreground">
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
        </div>

        {/* Nav bar */}
        <nav className="bg-muted border-b border-border relative" onMouseLeave={leaveNav}>
          <div className="flex items-center justify-between px-5 md:px-7">
            <ul className={`${mobileOpen ? "flex flex-col absolute top-full left-0 right-0 bg-muted border-b border-border z-50 px-5 py-2" : "hidden md:flex"} items-stretch flex-wrap`}>
              {navItems.map((item) => {
                  const isActive = hoveredCat?.name === item.label || (pathname === "/" && item.label === "Home" && !hoveredCat) || (pathname === `/${item.slug}`);
                  return (
                    <li key={item.label} onMouseEnter={() => enterNav(item)}>
                      <Link
                        href={item.label === "Home" ? "/" : `/${item.slug}`}
                        onClick={() => { setMobileOpen(false); setHoveredCat(null); }}
                        className={`flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-3 text-[13px] font-semibold tracking-wide uppercase relative transition-colors duration-150 w-full md:w-auto ${isActive ? "text-foreground" : "text-card-foreground hover:text-foreground"}`}
                      >
                        {item.label !== "Home" && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />}
                        {item.label}
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 transition-transform duration-200 origin-left"
                          style={{ background: item.color, transform: isActive ? "scaleX(1)" : "scaleX(0)" }} />
                      </Link>
                    </li>
                  );
                })}
                {catsLoading && Array(6).fill(0).map((_, i) => (
                  <li key={`nav-skeleton-${i}`} className="flex items-center px-3 md:px-4 py-3 md:py-4">
                    <div className="h-4 w-16 md:w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  </li>
                ))}
              </ul>
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-card-foreground hover:bg-primary hover:text-white transition-all duration-150 flex-shrink-0 ml-2">
                <Search size={14} />
              </button>
            </div>

            {/* Category hover dropdown */}
            {hoveredCat && (
              <div onMouseEnter={cancelLeave} onMouseLeave={leaveNav}>
                <NavDropdown categoryName={hoveredCat.name} categoryId={hoveredCat.id} onClose={() => setHoveredCat(null)} />
              </div>
            )}

            {searchOpen && (
              <div className="px-5 md:px-7 pb-3">
                <input autoFocus placeholder="Search EpoVerse..."
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
              </div>
            )}
          </nav>

          {/* Mobile ad slot */}
          <div className="lg:hidden px-5 py-2 bg-background border-b border-border">
            <AdSlot size="banner" className="w-full" />
          </div>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onLogin={() => setIsLoggedIn(true)}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegistrationOpen(true);
        }}
      />
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSwitchToLogin={() => {
          setIsRegistrationOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default Header;
