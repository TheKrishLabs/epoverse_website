import { useState, useRef } from "react";
import {
  Menu, X, Search, ChevronRight, Clock, Eye,
  Share2, Bookmark, Facebook, Twitter, Calendar,
  Globe, ArrowRight, TrendingUp, Tag, Mail, MessageCircle,
  ThumbsUp, Sun, Moon,
} from "lucide-react";

const CAT: Record<string, string> = {
  International: "#5B8DEF",
  Entertainment: "#FF5C8A",
  Education: "#2FC6A0",
  Sports: "#FFB238",
  Finance: "#4AD991",
  Technology: "#B18CFF",
  Home: "#FF4747",
};

interface Article {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  time: string;
  date: string;
  readTime: string;
  views: string;
  image: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: 1, category: "International",
    title: "G20 Leaders Reach Historic Climate Agreement Ahead of 2030 Deadline",
    excerpt: "World leaders have agreed on a binding framework to cut emissions by 45% before 2030, marking the most ambitious multilateral climate deal since the Paris Accord.",
    author: "Lena Marchetti", authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=60&h=60&fit=crop&auto=format",
    time: "2 hours ago", date: "July 8, 2026", readTime: "6 min read", views: "142K",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=700&fit=crop&auto=format", featured: true,
  },
  {
    id: 2, category: "Technology",
    title: "NVIDIA Unveils Next-Gen AI Chip That Processes 10× Faster Than Its Predecessor",
    excerpt: "The new Blackwell Ultra architecture promises to reshape data center economics and accelerate the timeline for AGI research by a decade.",
    author: "Priya Nair", authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&auto=format",
    time: "4 hours ago", date: "July 8, 2026", readTime: "4 min read", views: "98K",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 3, category: "Sports",
    title: "Brazil Clinches Copa América Title in Extra-Time Thriller Against Argentina",
    excerpt: "A 94th-minute Vinicius header sealed a legendary 3–2 victory in Buenos Aires, sparking nationwide celebrations across Brazil.",
    author: "Rafael Santos", authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format",
    time: "6 hours ago", date: "July 8, 2026", readTime: "3 min read", views: "217K",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 4, category: "Finance",
    title: "Federal Reserve Signals Three Rate Cuts for Q3 as Inflation Hits Two-Year Low",
    excerpt: "Markets surged after Fed Chair Powell confirmed that core PCE dropping to 2.1% opens the door for sustained monetary easing through autumn.",
    author: "Claire Oduya", authorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&auto=format",
    time: "8 hours ago", date: "July 8, 2026", readTime: "5 min read", views: "76K",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 5, category: "Entertainment",
    title: "Adele's Farewell World Tour Breaks All-Time Ticket Sales Record in Under 4 Minutes",
    excerpt: "Over 12 million ticket requests crashed the Ticketmaster platform as fans worldwide scrambled for a seat at what the singer calls her last major tour.",
    author: "Zara Williams", authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&auto=format",
    time: "10 hours ago", date: "July 7, 2026", readTime: "3 min read", views: "341K",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 6, category: "Education",
    title: "UNESCO Report: 200 Million Children Still Lack Access to Basic Digital Learning Tools",
    excerpt: "A new global study reveals a widening gap in digital education infrastructure between high-income and low-income nations, calling for emergency UN funding.",
    author: "Amara Diallo", authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=60&h=60&fit=crop&auto=format",
    time: "12 hours ago", date: "July 7, 2026", readTime: "7 min read", views: "54K",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 7, category: "International",
    title: "South Korea and Japan Sign Landmark Defense Treaty After Decades of Tensions",
    excerpt: "The historic pact allows joint military exercises and intelligence sharing — a seismic shift in East Asian geopolitics driven by North Korean missile escalations.",
    author: "Jin-ho Park", authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&auto=format",
    time: "1 day ago", date: "July 7, 2026", readTime: "5 min read", views: "89K",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 8, category: "Technology",
    title: "Apple Intelligence Now Runs Fully On-Device for Privacy-First AI Features",
    excerpt: "iOS 21 ships with a local large language model that handles email, photos, and health summaries without any data leaving the device.",
    author: "Priya Nair", authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&auto=format",
    time: "1 day ago", date: "July 7, 2026", readTime: "4 min read", views: "203K",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 9, category: "Sports",
    title: "Serena Williams Foundation Opens 50 New Tennis Academies Across Sub-Saharan Africa",
    excerpt: "The initiative aims to identify and develop the next generation of Grand Slam champions from underrepresented communities.",
    author: "Fatima Adeyemi", authorAvatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=60&h=60&fit=crop&auto=format",
    time: "1 day ago", date: "July 7, 2026", readTime: "4 min read", views: "67K",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 10, category: "Finance",
    title: "Bitcoin Breaks $200,000 Barrier as Institutional Demand Hits Record Highs",
    excerpt: "Spot ETF inflows topped $4.2 billion in a single week as pension funds and sovereign wealth funds increased their crypto allocations significantly.",
    author: "Marcus Cole", authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&auto=format",
    time: "2 days ago", date: "July 6, 2026", readTime: "5 min read", views: "412K",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 11, category: "Entertainment",
    title: "Christopher Nolan's 'Meridian' Shatters Opening Weekend Box Office Record",
    excerpt: "The sci-fi epic earned $540 million globally in its first three days, dethroning Avatar's 15-year record with a visually stunning narrative.",
    author: "Zara Williams", authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&auto=format",
    time: "2 days ago", date: "July 6, 2026", readTime: "3 min read", views: "289K",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: 12, category: "Education",
    title: "Harvard Study: Four-Day School Week Improves Student Performance by 18%",
    excerpt: "Results from 400 pilot schools across 12 countries suggest shorter weeks with longer daily sessions boost attention, retention, and teacher satisfaction.",
    author: "Dr. Samuel Hughes", authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&auto=format",
    time: "2 days ago", date: "July 6, 2026", readTime: "6 min read", views: "134K",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop&auto=format",
  },
];

const TRENDING = [
  { id: 1, rank: 1, title: "Pope Francis Meets Xi Jinping in Unprecedented Vatican Summit", category: "International", views: "1.2M" },
  { id: 2, rank: 2, title: "SpaceX Starship Completes First Crewed Moon Landing", category: "Technology", views: "987K" },
  { id: 3, rank: 3, title: "World Cup 2030 Host Cities Announced — Shock Inclusions Revealed", category: "Sports", views: "834K" },
  { id: 4, rank: 4, title: "Nvidia Stock Hits $2,000 Per Share After AI Chip Reveal", category: "Finance", views: "712K" },
  { id: 5, rank: 5, title: "Netflix's Most-Watched Series of All Time Drops Season 4 Finale", category: "Entertainment", views: "653K" },
];

// ─── Ad Slot ─────────────────────────────────────────────────────────────────
function AdSlot({ size = "leaderboard", className = "" }: { size?: "leaderboard" | "rectangle" | "halfpage" | "banner"; className?: string }) {
  const dims: Record<string, { label: string; minH: string }> = {
    leaderboard: { label: "728 × 90", minH: "72px" },
    rectangle:   { label: "300 × 250", minH: "250px" },
    halfpage:    { label: "300 × 600", minH: "280px" },
    banner:      { label: "468 × 60", minH: "64px" },
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

// ─── Nav Dropdown ─────────────────────────────────────────────────────────────
function NavDropdown({ category, onNavigate, onClose }: { category: string; onNavigate: (p: "home" | "article", id?: number) => void; onClose: () => void }) {
  const color = CAT[category] || "#FF4747";
  const articles = ARTICLES.filter(a => a.category === category).slice(0, 3);
  return (
    <div className="hidden md:block absolute top-full left-0 right-0 z-50 bg-card shadow-2xl border-b border-border"
      style={{ borderTop: `3px solid ${color}` }}>
      <div className="max-w-[1400px] mx-auto px-7 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{category}</span>
          </div>
          <button onClick={() => { onNavigate("home"); onClose(); }}
            className="text-[11px] text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            All {category} <ArrowRight size={11} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {articles.map(article => (
            <button key={article.id} onClick={() => { onNavigate("article", article.id); onClose(); }}
              className="flex gap-3 text-left group w-full">
              <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">{article.title}</p>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock size={9} /> {article.time}</span>
              </div>
            </button>
          ))}
        </div>
        {/* Trending mini-strip */}
        <div className="mt-4 pt-3 border-t border-border flex items-center gap-6 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex-shrink-0">Also trending</span>
          {TRENDING.slice(0, 3).map(t => (
            <button key={t.id} onClick={() => { onNavigate("article", 1); onClose(); }}
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors whitespace-nowrap flex-shrink-0">
              {t.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ isDark, toggleDark, onNavigate, currentPage }: {
  isDark: boolean; toggleDark: () => void;
  onNavigate: (p: "home" | "article", id?: number) => void; currentPage: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = [
    { label: "Home",          color: "#FF4747" },
    { label: "International", color: "#5B8DEF" },
    { label: "Entertainment", color: "#FF5C8A" },
    { label: "Education",     color: "#2FC6A0" },
    { label: "Sports",        color: "#FFB238" },
    { label: "Finance",       color: "#4AD991" },
    { label: "Technology",    color: "#B18CFF" },
  ];

  const enterNav = (label: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredCat(label === "Home" ? null : label);
  };
  const leaveNav = () => {
    hoverTimer.current = setTimeout(() => setHoveredCat(null), 200);
  };
  const cancelLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <header className="sticky top-0 z-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Utility bar */}
      <div className="flex items-center justify-between px-5 md:px-7 py-2 bg-muted border-b border-border text-[12px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <svg className="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
          </svg>
          <span className="hidden sm:inline">Tuesday, 08 July 2026</span>
          <span className="sm:hidden">08 Jul 2026</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-card-foreground">
            <button className="hover:text-primary transition-colors">Login</button>
            <span className="text-border">/</span>
            <button className="hover:text-primary transition-colors">Register</button>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 border border-border rounded-full text-muted-foreground text-[11px]">
            <Globe size={11} /><span>English</span>
          </div>
          {/* Dark/Light toggle */}
          <button onClick={toggleDark}
            className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
            aria-label="Toggle theme">
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          {/* Socials */}
          <div className="flex items-center gap-1.5">
            {([
              ["Facebook", "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12"],
              ["Twitter", "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1"],
              ["Instagram", "M12 2.2c2.7 0 3 0 4.1.1 1 .1 1.7.2 2.3.5.6.2 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.3.6.4 1.3.5 2.3.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 1-.2 1.7-.5 2.3-.2.6-.6 1.1-1.1 1.6-.5.5-1 .8-1.6 1.1-.6.3-1.3.4-2.3.5-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1-.1-1.7-.2-2.3-.5-.6-.2-1.1-.6-1.6-1.1-.5-.5-.8-1-1.1-1.6-.3-.6-.4-1.3-.5-2.3C2.2 15 2.2 14.7 2.2 12s0-3 .1-4.1c.1-1 .2-1.7.5-2.3.2-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2.3-.5C9 2.2 9.3 2.2 12 2.2M12 0C9.3 0 8.9 0 7.8.1c-1.2.1-2 .3-2.7.6a5.9 5.9 0 0 0-2.1 1.4A5.9 5.9 0 0 0 1.6 4.2c-.3.7-.5 1.5-.6 2.7C.9 8 .9 8.3.9 11s0 3 .1 4.1c.1 1.2.3 2 .6 2.7.3.7.7 1.4 1.4 2.1.6.6 1.3 1 2.1 1.4.7.3 1.5.5 2.7.6C8.9 22 9.3 22 12 22s3.1 0 4.2-.1c1.2-.1 2-.3 2.7-.6a5.9 5.9 0 0 0 2.1-1.4 5.9 5.9 0 0 0 1.4-2.1c.3-.7.5-1.5.6-2.7.1-1.1.1-1.5.1-4.1s0-3.1-.1-4.2c-.1-1.2-.3-2-.6-2.7a5.9 5.9 0 0 0-1.4-2.1A5.9 5.9 0 0 0 18.9.7c-.7-.3-1.5-.5-2.7-.6C15.1 0 14.7 0 12 0Z M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z"],
            ] as [string, string][]).map(([name, d]) => (
              <a key={name} href="#" aria-label={name}
                className="w-5 h-5 rounded-full flex items-center justify-center bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all duration-150">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d={d} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="flex items-center justify-between gap-6 px-5 md:px-7 py-4 md:py-5 bg-background border-b border-border">
        <button onClick={() => onNavigate("home")} className="flex-shrink-0">
          <div className="flex items-end" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>
            <span className="text-foreground">Epo</span>
            <span className="text-primary">Verse</span>
            <span className="text-primary">.</span>
          </div>
          <div className="mt-1 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
            Every world<span className="text-primary"> · </span>one page
          </div>
        </button>
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
          <ul className={`${mobileOpen ? "flex flex-col absolute top-full left-0 right-0 bg-muted border-b border-border z-50 px-5 py-2" : "hidden md:flex"} items-stretch`}>
            {navItems.map((item) => {
              const isActive = hoveredCat === item.label || (currentPage === "home" && item.label === "Home" && !hoveredCat);
              return (
                <li key={item.label} onMouseEnter={() => enterNav(item.label)}>
                  <button
                    onClick={() => { onNavigate("home"); setMobileOpen(false); setHoveredCat(null); }}
                    className={`flex items-center gap-1.5 px-3 md:px-4 py-3 md:py-4 text-[13px] font-semibold tracking-wide uppercase relative transition-colors duration-150 w-full md:w-auto ${isActive ? "text-foreground" : "text-card-foreground hover:text-foreground"}`}
                  >
                    {item.label !== "Home" && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />}
                    {item.label}
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 transition-transform duration-200 origin-left"
                      style={{ background: item.color, transform: isActive ? "scaleX(1)" : "scaleX(0)" }} />
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => setSearchOpen(!searchOpen)}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-card-foreground hover:bg-primary hover:text-white transition-all duration-150 flex-shrink-0 ml-2">
            <Search size={14} />
          </button>
        </div>

        {/* Category hover dropdown */}
        {hoveredCat && (
          <div onMouseEnter={cancelLeave} onMouseLeave={leaveNav}>
            <NavDropdown category={hoveredCat} onNavigate={onNavigate} onClose={() => setHoveredCat(null)} />
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
  );
}

// ─── Article Cards ────────────────────────────────────────────────────────────
function HeroCard({ article, onClick }: { article: Article; onClick: () => void }) {
  const color = CAT[article.category] || "#FF4747";
  return (
    <article onClick={onClick} className="relative group cursor-pointer rounded-xl overflow-hidden bg-secondary" style={{ minHeight: 440 }}>
      <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(10,11,16,0.97) 0%,rgba(10,11,16,0.55) 55%,rgba(10,11,16,0.1) 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ background: color, color: "#000" }}>{article.category}</span>
          <span className="text-[#8A90A3] text-xs flex items-center gap-1"><Clock size={10} /> {article.time}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {article.title}
        </h1>
        <p className="text-[#8A90A3] text-sm md:text-base line-clamp-2 mb-4 max-w-xl">{article.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-[#565C70]">
          <img src={article.authorAvatar} alt={article.author} className="w-7 h-7 rounded-full object-cover border border-[#262B38]" />
          <span className="text-[#D5D8E2] font-medium">{article.author}</span>
          <span className="flex items-center gap-1"><Eye size={11} /> {article.views}</span>
          <span className="ml-auto flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
            Read full story <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

function StandardCard({ article, onClick, horizontal = false }: { article: Article; onClick: () => void; horizontal?: boolean }) {
  const color = CAT[article.category] || "#FF4747";
  if (horizontal) {
    return (
      <article onClick={onClick} className="flex gap-3 group cursor-pointer py-3 border-b border-border last:border-0">
        <div className="relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-secondary">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{article.category}</span>
          <h4 className="text-sm font-semibold text-card-foreground group-hover:text-foreground transition-colors line-clamp-2 leading-snug mt-0.5">{article.title}</h4>
          <span className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1"><Clock size={9} /> {article.time}</span>
        </div>
      </article>
    );
  }
  return (
    <article onClick={onClick} className="group cursor-pointer">
      <div className="relative rounded-lg overflow-hidden bg-secondary mb-3" style={{ paddingTop: "62%" }}>
        <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: color, color: "#000" }}>{article.category}</span>
      </div>
      <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1.5">{article.title}</h3>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>{article.author}</span><span>·</span><span>{article.time}</span>
      </div>
    </article>
  );
}

function SectionCard({ article, onClick }: { article: Article; onClick: () => void }) {
  const color = CAT[article.category] || "#FF4747";
  return (
    <article onClick={onClick} className="group cursor-pointer flex gap-4 py-4 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{article.category}</span>
        <h3 className="text-base font-semibold text-card-foreground group-hover:text-primary transition-colors leading-snug mt-1 mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.excerpt}</p>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{article.author}</span><span>·</span><span>{article.time}</span><span>·</span><span>{article.readTime}</span>
        </div>
      </div>
      <div className="relative flex-shrink-0 w-28 md:w-36 rounded-lg overflow-hidden bg-secondary" style={{ minHeight: 90 }}>
        <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
    </article>
  );
}

// ─── Live scores ticker ───────────────────────────────────────────────────────
function NewsTicker() {
  const scores = [
    { label: "🏏 ENG vs IND — Test Day 3", score: "IND 387/6  ·  ENG 241 all out", status: "LIVE" },
    { label: "🏏 AUS vs SA — 2nd ODI", score: "AUS 298/4 (45 ov)  ·  SA need 103 off 30", status: "LIVE" },
    { label: "⚽ Man City vs Real Madrid — UCL QF", score: "2 – 1  ·  67'", status: "LIVE" },
    { label: "⚽ Barcelona vs PSG — UCL SF", score: "1 – 1  ·  HT", status: "LIVE" },
    { label: "⚽ Arsenal vs Liverpool — PL", score: "0 – 0  ·  KO 20:00", status: "TODAY" },
    { label: "🏏 NZ vs WI — T20I", score: "NZ 178/5 (20 ov)  ·  WI 142/8 (18.3 ov)", status: "FT" },
    { label: "⚽ Brazil vs Argentina — Copa América", score: "3 – 2  ·  FT (AET)", status: "FT" },
    { label: "🏏 SL vs PAK — 1st Test", score: "PAK 312 & 188/3  ·  SL 275 all out", status: "LIVE" },
  ];

  const itemStr = scores.map(s =>
    `${s.label}  ${s.score}  [${s.status}]          `
  ).join("   ·   ");

  return (
    <div className="flex items-stretch bg-muted border-b border-border text-xs overflow-hidden mt-1">
      <div className="flex-shrink-0 flex items-center px-3 py-2 bg-primary text-white font-bold text-[10px] tracking-widest uppercase gap-1 whitespace-nowrap">
        <TrendingUp size={10} /> Live Scores
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-2 text-muted-foreground font-mono text-[11px]">
          {(itemStr + itemStr).split("[LIVE]").map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}<span className="text-[#4AD991] font-bold mx-1">● LIVE</span>
              </span>
            ) : <span key={i}>{part}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared footer ────────────────────────────────────────────────────────────
function SharedFooter({ onNavigate }: { onNavigate: (p: "home" | "article", id?: number) => void }) {
  const cols = [
    { label: "Sections",  links: ["International", "Entertainment", "Education", "Sports", "Finance", "Technology"] },
    { label: "Company",   links: ["About Us", "Our Authors", "Advertise", "Careers", "Press Kit", "Contact"] },
    { label: "Legal",     links: ["Privacy Policy", "Terms of Service", "Cookie Settings", "Corrections", "Editorial Standards"] },
  ];

  return (
    <footer className="bg-background border-t border-border overflow-hidden">

      {/* ── Top row ── */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-12 pb-10 flex flex-col md:flex-row gap-12 md:gap-20">

        {/* Left — tagline + newsletter */}
        <div className="flex-shrink-0 md:max-w-[260px]">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-4">
            Every world · One page
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Independent multi-author journalism covering politics, culture, technology, sports, and finance from bureaus across six continents.
          </p>
          <div className="flex gap-2">
            <input
              placeholder="your@email.com"
              className="flex-1 min-w-0 bg-secondary border border-border rounded px-3 py-2 text-xs text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Right — nav columns */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-8">
          {cols.map(({ label, links }) => (
            <div key={label}>
              <p className="text-xs font-bold text-foreground mb-4">{label}</p>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors leading-none">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Giant full-bleed wordmark ── */}
      <div className="overflow-hidden select-none" style={{ lineHeight: 0.82 }}>
        <p
          className="text-center whitespace-nowrap"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "20.5vw",
            letterSpacing: "-0.035em",
            lineHeight: 0.82,
          }}
        >
          <span className="text-foreground">Epo</span>
          <span className="text-primary">Verse.</span>
        </p>
      </div>

      {/* ── Bottom strip ── */}
      <div className="border-t border-border px-5 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span
          className="text-muted-foreground text-[12px]"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          EpoVerse Media Group &nbsp;·&nbsp; © 2026
        </span>
        <div className="flex flex-wrap gap-5 justify-center sm:justify-end">
          {["Sitemap", "RSS Feed", "Accessibility", "Cookie Preferences", "Do Not Sell My Data"].map(l => (
            <a key={l} href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ onNavigate }: { onNavigate: (p: "home" | "article", id?: number) => void }) {
  const featured = ARTICLES[0];
  const secondRow = ARTICLES.slice(1, 4);
  const latestArticles = ARTICLES.slice(8, 12);

  return (
    <main className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="pt-3 bg-background" />
      <NewsTicker />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

        {/* Hero + sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 pt-6 pb-5">
          <HeroCard article={featured} onClick={() => onNavigate("article", featured.id)} />
          <aside className="flex flex-col gap-4">
            <AdSlot size="rectangle" className="w-full" />
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp size={11} /> Trending Now
              </h3>
              {TRENDING.map((t) => (
                <button key={t.id} onClick={() => onNavigate("article", 1)}
                  className="flex items-start gap-3 py-2.5 border-b border-border last:border-0 text-left w-full group">
                  <span className="text-2xl font-bold text-border font-mono leading-none flex-shrink-0 w-7">{t.rank}</span>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: CAT[t.category] }}>{t.category}</span>
                    <p className="text-xs text-card-foreground group-hover:text-foreground transition-colors leading-snug line-clamp-2 mt-0.5">{t.title}</p>
                    <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1"><Eye size={9} /> {t.views}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </section>

        {/* Ad 1 */}
        <AdSlot size="leaderboard" className="w-full mb-6" />

        {/* Second row */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Latest Stories</h2>
            <button className="text-primary text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">All stories <ArrowRight size={12} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {secondRow.map((a) => <StandardCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} />)}
          </div>
        </section>

        {/* Main content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 mb-6">
          <div>
            {/* International */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: CAT.International }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: CAT.International }}>International</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="bg-card rounded-xl overflow-hidden border border-border mb-5">
              {ARTICLES.filter(a => a.category === "International").map((a) => (
                <SectionCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} />
              ))}
            </div>

            {/* Ad 3 */}
            <AdSlot size="leaderboard" className="w-full mb-5" />

            {/* Technology */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: CAT.Technology }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: CAT.Technology }}>Technology</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="bg-card rounded-xl overflow-hidden border border-border mb-5">
              {ARTICLES.filter(a => a.category === "Technology").map((a) => (
                <SectionCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} />
              ))}
            </div>

            {/* Sports */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: CAT.Sports }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: CAT.Sports }}>Sports</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="bg-card rounded-xl overflow-hidden border border-border">
              {ARTICLES.filter(a => a.category === "Sports").map((a) => (
                <SectionCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            <AdSlot size="halfpage" className="w-full" />
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Most Read</h3>
              {ARTICLES.slice(9, 12).map((a) => <StandardCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} horizontal />)}
            </div>
            {/* Newsletter */}
            <div className="rounded-xl p-5 border border-border" style={{ background: "linear-gradient(135deg, rgba(255,71,71,0.06) 0%, transparent 100%)" }}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Mail size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">EpoVerse Newsletter</h3>
              <p className="text-xs text-muted-foreground mb-3">Top stories delivered to your inbox every morning.</p>
              <input placeholder="your@email.com" className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors mb-2" />
              <button className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 rounded-lg transition-colors">Subscribe Free</button>
            </div>
            <AdSlot size="rectangle" className="w-full" />
          </aside>
        </div>

        {/* Ad 6 */}
        <AdSlot size="leaderboard" className="w-full mb-6" />

        {/* Finance / Entertainment / Education */}
        <section className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { category: "Finance", articles: ARTICLES.filter(a => a.category === "Finance") },
              { category: "Entertainment", articles: ARTICLES.filter(a => a.category === "Entertainment") },
              { category: "Education", articles: ARTICLES.filter(a => a.category === "Education") },
            ].map(({ category, articles }) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-4 rounded-full" style={{ background: CAT[category] }} />
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: CAT[category] }}>{category}</h2>
                </div>
                <div className="bg-card rounded-xl overflow-hidden border border-border">
                  {articles.map((a) => <StandardCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} horizontal />)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* More stories */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">More Stories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestArticles.map((a) => <StandardCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} />)}
          </div>
        </section>

        {/* Ad 7 */}
        <AdSlot size="leaderboard" className="w-full mb-6" />
      </div>

      <SharedFooter onNavigate={onNavigate} />
    </main>
  );
}

// ─── ARTICLE PAGE ─────────────────────────────────────────────────────────────
function ArticlePage({ articleId, onNavigate }: { articleId: number; onNavigate: (p: "home" | "article", id?: number) => void }) {
  const article = ARTICLES.find(a => a.id === articleId) || ARTICLES[0];
  const related = ARTICLES.filter(a => a.id !== articleId).slice(0, 4);
  const color = CAT[article.category] || "#FF4747";

  const body = [
    `The announcement came at the close of a marathon two-day summit in Rio de Janeiro, where heads of state from 20 of the world's largest economies gathered under the shadow of the most recent IPCC report — a document that described the current trajectory of global warming as "catastrophically irreversible" without immediate structural change.`,
    `At the heart of the agreement is a binding commitment to reduce net carbon emissions by 45% from 2019 baseline levels before the calendar turns to 2031. What makes this deal materially different from its predecessors is the enforcement mechanism: for the first time, member nations have agreed to submit to annual independent audits conducted by a newly formed body, the International Climate Compliance Board (ICCB), whose findings will be made publicly available and tied to trade concessions.`,
    `"We have signed agreements before and watched them gather dust," said German Chancellor Kristin Meier at the closing press conference. "This time, every nation at this table has put their market access on the line. That is the difference between a promise and a commitment."`,
    `The deal was not without its tensions. India and Brazil — both nations with rapidly expanding industrial sectors — pushed back on the 2030 deadline throughout the negotiations, arguing it placed an asymmetric burden on developing economies that have historically contributed far less to cumulative global emissions. The final text includes a "differentiated responsibility clause" that grants emerging economies an additional 18-month ramp-up window, and allocates $320 billion in green technology transfer funding from G7 nations through 2028.`,
    `Climate scientists cautiously welcomed the agreement. Dr. Amara Osei of the Potsdam Institute for Climate Impact Research called it "the most operationally concrete multilateral climate deal we have seen," while noting that meeting the 45% target will require every signatory to accelerate their current domestic policy timelines significantly. "The gap between what nations have pledged and what their current policies deliver is still enormous. This agreement is the architecture — now the construction has to begin."`,
    `Markets responded positively to the news. Shares in renewable energy companies surged, with solar panel manufacturers and grid-scale battery producers seeing double-digit gains across European and Asian exchanges. Oil futures fell more than 3% in early trading as analysts revised long-term demand forecasts downward.`,
    `The agreement will be formally ratified at the United Nations General Assembly in September, where it will require endorsement from at least 75% of the signatory nations to take legal effect. Diplomats expressed cautious confidence that the threshold will be met, though observers noted that legislative approval in several key democracies — including the United States, where climate legislation has historically struggled in Congress — remains uncertain.`,
  ];

  return (
    <main className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[55vh] overflow-hidden bg-secondary">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(16,18,26,0.3) 0%,rgba(16,18,26,0.92) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 max-w-[1400px] mx-auto px-4 md:px-8 pb-6 md:pb-10">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => onNavigate("home")} className="text-[#8A90A3] text-xs hover:text-white transition-colors">Home</button>
            <ChevronRight size={12} className="text-[#565C70]" />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{article.category}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* Body */}
          <article>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 pb-5 mb-5 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={article.authorAvatar} alt={article.author} className="w-9 h-9 rounded-full object-cover border-2 border-primary" />
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{article.author}</p>
                  <p className="text-[11px] text-muted-foreground">Senior Correspondent</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground ml-auto">
                <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
                <span className="flex items-center gap-1"><Eye size={11} /> {article.views}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> {article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
                  <Share2 size={13} />
                </button>
                <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                  <Bookmark size={13} />
                </button>
              </div>
            </div>

            <p className="text-lg md:text-xl text-card-foreground font-medium leading-relaxed mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {article.excerpt}
            </p>

            {body.slice(0, 2).map((p, i) => <p key={i} className="text-base text-muted-foreground leading-relaxed mb-5">{p}</p>)}

            <AdSlot size="leaderboard" className="w-full my-6" />

            {body.slice(2, 5).map((p, i) => <p key={i} className="text-base text-muted-foreground leading-relaxed mb-5">{p}</p>)}

            <blockquote className="border-l-4 pl-5 py-1 my-6 bg-card rounded-r-lg pr-4" style={{ borderColor: color }}>
              <p className="text-lg text-card-foreground italic leading-relaxed" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                "We have signed agreements before and watched them gather dust. This time, every nation at this table has put their market access on the line."
              </p>
              <cite className="text-xs text-muted-foreground mt-2 block not-italic">— German Chancellor Kristin Meier</cite>
            </blockquote>

            <AdSlot size="leaderboard" className="w-full my-6" />

            {body.slice(5).map((p, i) => <p key={i} className="text-base text-muted-foreground leading-relaxed mb-5">{p}</p>)}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-5 mt-5 border-t border-border">
              <Tag size={12} className="text-muted-foreground" />
              {["Climate", "G20", "Geopolitics", "Environment", "Policy", "2026"].map(tag => (
                <span key={tag} className="px-2 py-1 bg-secondary border border-border rounded text-[11px] text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer">{tag}</span>
              ))}
            </div>

            {/* Author bio */}
            <div className="bg-card rounded-xl p-5 mt-6 flex gap-4 border border-border">
              <img src={article.authorAvatar} alt={article.author} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground mb-0.5">{article.author}</p>
                <p className="text-[11px] text-muted-foreground mb-2">Senior International Correspondent · EpoVerse</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Award-winning journalist covering geopolitics and climate policy for over 12 years. Based in Brussels, reporting from global summits and conflict zones.</p>
              </div>
            </div>

            {/* Social share */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
              <span className="text-xs text-muted-foreground font-semibold">Share</span>
              {[
                { label: "Facebook", bg: "#1877F2", icon: <Facebook size={13} /> },
                { label: "Twitter", bg: "#1DA1F2", icon: <Twitter size={13} /> },
              ].map(({ label, bg, icon }) => (
                <button key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-semibold transition-opacity hover:opacity-80" style={{ background: bg }}>
                  {icon} {label}
                </button>
              ))}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-xs font-semibold ml-auto hover:text-foreground transition-colors">
                <ThumbsUp size={12} /> 4.2K
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors">
                <MessageCircle size={12} /> 186
              </button>
            </div>

            <AdSlot size="leaderboard" className="w-full mt-6" />
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            <AdSlot size="rectangle" className="w-full" />
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color }}>
                <span className="w-1 h-3 rounded-full inline-block" style={{ background: color }} />
                More in {article.category}
              </h3>
              {ARTICLES.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3).map((a) => (
                <StandardCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} horizontal />
              ))}
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp size={11} /> Trending
              </h3>
              {TRENDING.slice(0, 4).map((t) => (
                <button key={t.id} onClick={() => onNavigate("article", 1)}
                  className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-0 text-left w-full group">
                  <span className="text-xl font-bold text-border font-mono leading-none flex-shrink-0 w-6">{t.rank}</span>
                  <p className="text-xs text-card-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">{t.title}</p>
                </button>
              ))}
            </div>
            <div className="rounded-xl p-4 border border-border" style={{ background: "linear-gradient(135deg, rgba(255,71,71,0.06) 0%, transparent 100%)" }}>
              <Mail size={14} className="text-primary mb-2" />
              <h3 className="text-sm font-bold text-foreground mb-1">Daily Briefing</h3>
              <p className="text-xs text-muted-foreground mb-3">Top stories each morning. Free, no spam.</p>
              <input placeholder="your@email.com" className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors mb-2" />
              <button className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 rounded-lg transition-colors">Subscribe</button>
            </div>
          </aside>
        </div>

        {/* Related */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-5 rounded-full" style={{ background: "#FF4747" }} />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">You May Also Like</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((a) => <StandardCard key={a.id} article={a} onClick={() => onNavigate("article", a.id)} />)}
          </div>
        </section>
      </div>

      <SharedFooter onNavigate={onNavigate} />
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<"home" | "article">("home");
  const [articleId, setArticleId] = useState<number>(1);
  const [isDark, setIsDark] = useState(true);

  function navigate(p: "home" | "article", id?: number) {
    setPage(p);
    if (id !== undefined) setArticleId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <style>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 45s linear infinite; will-change: transform; }
          ::-webkit-scrollbar { display: none; }
          * { scrollbar-width: none; }
        `}</style>
        <Header isDark={isDark} toggleDark={() => setIsDark(d => !d)} onNavigate={navigate} currentPage={page} />
        {page === "home"
          ? <HomePage onNavigate={navigate} />
          : <ArticlePage articleId={articleId} onNavigate={navigate} />
        }
      </div>
    </div>
  );
}
