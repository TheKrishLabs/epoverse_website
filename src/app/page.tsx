"use client";
import { getArticles } from "@/services/articleService";
import { Article } from "@/types/article";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Clock, Eye, ArrowRight, TrendingUp, Mail } from "lucide-react";
import TopWeek from "@/components/ArticleSlugPage/TopWeek";
import PopularPosts from "../../components/CategoryPage.tsx/PopularPosts";
import FollowUs from "@/components/Sidebar/FollowUs";
import Stories from "@/components/ArticleSlugPage/Stories";

const CAT: Record<string, string> = {
  International: "#5B8DEF",
  Entertainment: "#FF5C8A",
  Education: "#2FC6A0",
  Sports: "#FFB238",
  Finance: "#4AD991",
  Technology: "#B18CFF",
  Home: "#FF4747",
};

const getCatColor = (name?: string) => {
  if (!name) return "#FF4747";
  const key = Object.keys(CAT).find(k => k.toLowerCase() === name.toLowerCase());
  return key ? CAT[key] : "#FF4747";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
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

function NewsTicker({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const items = articles.slice(0, 8);
  return (
    <div className="flex items-stretch bg-muted border-b border-border text-xs overflow-hidden mt-1 group">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="flex-shrink-0 flex items-center px-3 py-2 bg-primary text-primary-foreground font-bold text-[10px] tracking-widest uppercase gap-1 whitespace-nowrap z-10 shadow-[5px_0_10px_rgba(0,0,0,0.1)] relative">
        <TrendingUp size={10} /> Latest News
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee py-2 text-muted-foreground font-mono text-[11px]">
          {[...items, ...items, ...items, ...items].map((a, i) => (
            <React.Fragment key={i}>
              <Link href={`/articles/${a.slug}`} className="hover:text-[#e43f3e] transition-colors hover:underline mx-4">
                {a.headline}
              </Link>
              <span className="text-[#4AD991] font-bold">● LIVE</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroCard({ article }: { article: Article }) {
  if (!article) return null;
  const categoryName = article.category?.name || "News";
  const color = getCatColor(categoryName);
  const imageUrl = article.image || article.thumbnail || "/placeholder.jpg";

  return (
    <Link href={`/articles/${article.slug}`} className="relative group cursor-pointer rounded-xl overflow-hidden bg-secondary block h-full" style={{ minHeight: 440 }}>
      <img src={imageUrl} alt={article.headline} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(10,11,16,0.97) 0%,rgba(10,11,16,0.55) 55%,rgba(10,11,16,0.1) 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ background: color, color: "#000" }}>{categoryName}</span>
          <span className="text-[#8A90A3] text-xs flex items-center gap-1"><Clock size={10} /> {formatDate(article.createdAt)}</span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-[#e43f3e] transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {article.headline}
        </h1>
        <p className="text-[#8A90A3] text-sm md:text-base line-clamp-2 mb-4 max-w-xl">{stripHtml(article.content || "")}</p>
        <div className="flex items-center gap-4 text-xs text-[#565C70]">
          <span className="text-[#D5D8E2] font-medium flex items-center"><FaUser className="mr-1" /> {article.author || "Admin"}</span>
          <span className="flex items-center gap-1"><Eye size={11} /> ---</span>
          <span className="ml-auto flex items-center gap-1 text-[#e43f3e] font-semibold text-sm hover:gap-2 transition-all">
            Read full story <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function StandardCard({ article, horizontal = false }: { article: Article; horizontal?: boolean }) {
  if (!article) return null;
  const categoryName = article.category?.name || "News";
  const color = getCatColor(categoryName);
  const imageUrl = article.image || article.thumbnail || "/placeholder.jpg";

  if (horizontal) {
    return (
      <Link href={`/articles/${article.slug}`} className="flex gap-3 group cursor-pointer py-3 border-b border-border last:border-0 block">
        <div className="relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-secondary">
          <img src={imageUrl} alt={article.headline} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{categoryName}</span>
          <h4 className="text-sm font-semibold text-card-foreground group-hover:text-[#e43f3e] transition-colors line-clamp-2 leading-snug mt-0.5">{article.headline}</h4>
          <span className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1"><Clock size={9} /> {formatDate(article.createdAt)}</span>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/articles/${article.slug}`} className="group cursor-pointer block h-full flex flex-col">
      <div className="relative rounded-lg overflow-hidden bg-secondary mb-3 flex-shrink-0" style={{ paddingTop: "62%" }}>
        <img src={imageUrl} alt={article.headline} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: color, color: "#000" }}>{categoryName}</span>
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-card-foreground group-hover:text-[#e43f3e] transition-colors line-clamp-3 leading-snug mb-1.5">{article.headline}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{stripHtml(article.content)}</p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-auto">
          <span>{article.author || "Admin"}</span><span>·</span><span>{formatDate(article.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

function SectionCard({ article }: { article: Article }) {
  if (!article) return null;
  const categoryName = article.category?.name || "News";
  const color = getCatColor(categoryName);
  const imageUrl = article.image || article.thumbnail || "/placeholder.jpg";

  return (
    <Link href={`/articles/${article.slug}`} className="group cursor-pointer flex gap-4 py-4 border-b border-border last:border-0 block px-4">
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{categoryName}</span>
        <h3 className="text-base md:text-lg font-semibold text-card-foreground group-hover:text-[#e43f3e] transition-colors leading-snug mt-1 mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {article.headline}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{stripHtml(article.content || "")}</p>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{article.author || "Admin"}</span><span>·</span><span>{formatDate(article.createdAt)}</span>
        </div>
      </div>
      <div className="relative flex-shrink-0 w-28 md:w-36 rounded-lg overflow-hidden bg-secondary" style={{ minHeight: 90 }}>
        <img src={imageUrl} alt={article.headline} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
    </Link>
  );
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then(data => {
      setArticles(data || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Loading EpoVerse</p>
        </div>
      </div>
    );
  }

  const published = articles.filter(article => article.status === "published");
  const featured = published[0];
  const secondRow = published.slice(1, 4);
  const latestArticles = published.slice(8, 12);
  const trending = published.slice(0, 5);

  // Remaining articles for longer layout
  const deeperArticles = published.slice(12, 32);

  const filterCat = (catName: string) => published.filter(a => a.category?.name?.toLowerCase() === catName.toLowerCase()).slice(0, 4);

  return (
    <main className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="pt-3 bg-background" />
      <NewsTicker articles={published} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-5">
        {/* Top Hero + Sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 pb-5">
          {featured && <HeroCard article={featured} />}
          <aside className="flex flex-col gap-4">
            <AdSlot size="rectangle" className="w-full" />
            <div className="bg-card rounded-xl p-4 border border-border h-full">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp size={11} /> Trending Now
              </h3>
              {trending.map((t, idx) => (
                <Link key={t._id} href={`/articles/${t.slug}`} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0 text-left w-full group">
                  <span className="text-2xl font-bold text-border font-mono leading-none flex-shrink-0 w-7">{idx + 1}</span>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: getCatColor(t.category?.name) }}>{t.category?.name || "News"}</span>
                    <p className="text-xs text-card-foreground group-hover:text-foreground transition-colors leading-snug line-clamp-2 mt-0.5">{t.headline}</p>
                    <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1"><Eye size={9} /> ---</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <AdSlot size="leaderboard" className="w-full mb-8 hidden md:flex" />

        {/* Highlight Row */}
        {secondRow.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Editor's Picks</h2>
              <button className="text-[#e43f3e] text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">All stories <ArrowRight size={12} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondRow.map(a => <StandardCard key={a._id} article={a} />)}
            </div>
          </section>
        )}

        {/* Main Double Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-10">
          <div>
            {/* All Category Sections — fills the full height alongside sidebar */}
            {[
              { name: "International", data: filterCat("International") },
              { name: "Technology", data: filterCat("Technology") },
            ].map(({ name, data }) => data.length > 0 && (
              <div key={name} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: getCatColor(name) }} />
                  <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: getCatColor(name) }}>{name}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                  {data.map(a => <SectionCard key={a._id} article={a} />)}
                </div>
              </div>
            ))}

            {/* Ad between categories */}
            <AdSlot size="leaderboard" className="w-full mb-8 hidden md:flex" />

            {/* Sports + Entertainment */}
            {[
              { name: "Sports", data: filterCat("Sports") },
              { name: "Entertainment", data: filterCat("Entertainment") },
            ].map(({ name, data }) => data.length > 0 && (
              <div key={name} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: getCatColor(name) }} />
                  <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: getCatColor(name) }}>{name}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                  {data.map(a => <SectionCard key={a._id} article={a} />)}
                </div>
              </div>
            ))}

            {/* Ad */}
            <AdSlot size="leaderboard" className="w-full mb-8 hidden md:flex" />

            {/* Finance + Education */}
            {[
              { name: "Finance", data: filterCat("Finance") },
              { name: "Education", data: filterCat("Education") },
            ].map(({ name, data }) => data.length > 0 && (
              <div key={name} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: getCatColor(name) }} />
                  <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: getCatColor(name) }}>{name}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                  {data.map(a => <SectionCard key={a._id} article={a} />)}
                </div>
              </div>
            ))}

            {/* Latest Stories grid */}
            {published.slice(4, 12).length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Latest Stories</h2>
                  <button className="text-[#e43f3e] text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight size={12} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {published.slice(4, 12).map(a => <StandardCard key={a._id} article={a} />)}
                </div>
              </div>
            )}

            {/* You May Have Missed — list portion stays in column */}
            {published.slice(12, 14).length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">You May Have Missed</h2>
                </div>
                <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                  {published.slice(12, 14).map(a => <SectionCard key={a._id} article={a} />)}
                </div>
              </div>
            )}
          </div>

          {/* Extended Sidebar */}
          <aside className="flex flex-col gap-6">
            <AdSlot size="halfpage" className="w-full hidden md:flex" />

            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Popular Posts</h3>
              <PopularPosts />
            </div>

            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Follow Us</h3>
              <FollowUs />
            </div>

            {/* Most Read — pulled from backend */}
            <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Most Read</h3>
              {published.slice(9, 12).map(a => <StandardCard key={a._id} article={a} horizontal />)}
            </div>

            <div className="rounded-xl p-6 border border-border shadow-sm relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(255,71,71,0.06) 0%, transparent 100%)" }}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Mail size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">EpoVerse Newsletter</h3>
              <p className="text-xs text-muted-foreground mb-3">Top stories delivered to your inbox every morning.</p>
              <input placeholder="your@email.com" className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors mb-2" />
              <button className="w-full bg-[#e43f3e] hover:bg-[#c93534] text-white text-xs font-bold py-2 rounded-lg transition-colors">Subscribe Free</button>
            </div>

            <AdSlot size="rectangle" className="w-full" />

            {/* Discover More — Grid layout in sidebar to fill vertical space */}
            {published.slice(18, 38).length > 0 && (
              <div className="bg-card rounded-xl p-4 border border-border shadow-sm sticky top-[190px] mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Discover</h3>
                <div className="grid grid-cols-2 gap-x-3 gap-y-6">
                  {published.slice(18, 38).map(a => (
                    <Link key={a._id} href={`/articles/${a.slug}`} className="group cursor-pointer block">
                      <div className="relative rounded-lg overflow-hidden bg-secondary mb-2" style={{ paddingTop: "140%" }}>
                        <img src={a.image || a.thumbnail || "/placeholder.jpg"} alt={a.headline} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <span className="absolute top-1 left-1 text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded shadow-sm" style={{ background: getCatColor(a.category?.name), color: "#000" }}>
                          {a.category?.name?.slice(0, 4) || "News"}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-semibold text-card-foreground group-hover:text-[#e43f3e] transition-colors line-clamp-3 leading-snug">{a.headline}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* You May Have Missed — 2x2 full-width grid */}
        {published.slice(14, 18).length > 0 && (
          <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {published.slice(14, 18).map(a => <StandardCard key={a._id} article={a} />)}
            </div>
          </section>
        )}

        <AdSlot size="leaderboard" className="w-full mb-10 hidden md:flex" />

        {/* Deep Dive Grid (making the page much longer) */}
        {deeperArticles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-3">
              <h2 className="text-lg font-bold uppercase tracking-widest text-foreground">Deep Dive</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deeperArticles.slice(0, 8).map(a => (
                <StandardCard key={a._id} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* 3-Column Minor Categories */}
        <section className="mb-12 border-t border-border pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { category: "Finance", articles: filterCat("Finance") },
              { category: "Entertainment", articles: filterCat("Entertainment") },
              { category: "Education", articles: filterCat("Education") },
            ].filter(col => col.articles.length > 0).map(({ category, articles }) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: CAT[category] || "#FF4747" }} />
                  <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: CAT[category] || "#FF4747" }}>{category}</h2>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
                  {articles.map((a) => <StandardCard key={a._id} article={a} horizontal />)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top of the Week */}
        <section className="mb-12">
          <div className="flex items-center mb-6 border-b border-border pb-3">
            <h2 className="text-lg font-bold uppercase tracking-widest text-foreground">Top of the Week</h2>
          </div>
          <div className="bg-card rounded-xl p-1 border border-border shadow-sm">
            <TopWeek />
          </div>
        </section>

        <AdSlot size="leaderboard" className="w-full mb-10 hidden md:flex" />

        {/* The rest of the articles in a long scroll layout */}
        {deeperArticles.slice(8).length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6 border-b border-border pb-3">
              <h2 className="text-lg font-bold uppercase tracking-widest text-foreground">More News</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deeperArticles.slice(8).map(a => (
                <StandardCard key={a._id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
