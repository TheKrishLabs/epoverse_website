import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowRight, TrendingUp, Mail } from "lucide-react";
import Breadcrumb from "../../../components/CategoryPage.tsx/Breadcrumb";
import PopularPosts from "../../../components/CategoryPage.tsx/PopularPosts";
import { fetchArticlesByCategorySlug } from "@/services/articleService";
import { Article } from "@/types/article";

const CAT: Record<string, string> = {
  International: "#5B8DEF",
  Entertainment: "#FF5C8A",
  Education: "#2FC6A0",
  Sports: "#FFB238",
  Finance: "#4AD991",
  Technology: "#B18CFF",
  Home: "#FF4747",
};

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function timeAgo(dateString?: string) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

// ─── Ad Slot (matches homepage design) ─────────────────────────────────────
function AdSlot({
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
      className={`flex items-stretch border border-dashed border-[#33384A] dark:border-[#33384A] border-gray-200 rounded-lg overflow-hidden ${className}`}
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

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const articles: Article[] = await fetchArticlesByCategorySlug(params.slug);
  const publishedArticles = articles.filter((a) => a.status === "published");

  const categoryName = params.slug.replace(/-/g, " ");
  const matchedCatKey = Object.keys(CAT).find(
    (k) => k.toLowerCase() === categoryName.toLowerCase()
  );
  const categoryColor = matchedCatKey ? CAT[matchedCatKey] : "#FF4747";
  const displayCategoryName = matchedCatKey || categoryName;

  // Layout slicing exactly as in the reference:
  // Hero (1), Latest Stories grid (3), Section list articles, More Stories grid (4)
  const heroArticle = publishedArticles[0];
  const trendingArticles = publishedArticles.slice(0, 5);
  const latestStoriesArticles = publishedArticles.slice(1, 4);
  const sectionArticles = publishedArticles.slice(4, 10);
  const moreStoriesArticles = publishedArticles.slice(10, 14);

  return (
    <main
      className="min-h-screen bg-background w-full overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 w-full">
        {/* ── Breadcrumb ── */}
        <div className="pt-5 pb-2">
          <Breadcrumb category={params.slug} />
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1: Hero + Sidebar (Ad 300×250 + Trending Now)
            Matches: grid-cols-[1fr_300px] from reference
        ════════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 pb-5">
          {/* Hero Card */}
          {heroArticle ? (
            <Link
              href={`/articles/${heroArticle.slug}`}
              className="relative group cursor-pointer rounded-xl overflow-hidden bg-secondary block"
              style={{ minHeight: 440 }}
            >
              <Image
                src={heroArticle.image || heroArticle.thumbnail || ""}
                alt={heroArticle.headline}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top,rgba(10,11,16,0.97) 0%,rgba(10,11,16,0.55) 55%,rgba(10,11,16,0.1) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded"
                    style={{ background: categoryColor, color: "#000" }}
                  >
                    {displayCategoryName}
                  </span>
                  <span className="text-[#8A90A3] text-xs flex items-center gap-1">
                    <Clock size={10} /> {timeAgo(heroArticle.createdAt)}
                  </span>
                </div>
                <h1
                  className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-[#e43f3e] transition-colors"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {heroArticle.headline}
                </h1>
                <p className="text-[#8A90A3] text-sm md:text-base line-clamp-2 mb-4 max-w-xl">
                  {stripHtml(heroArticle.content || "").substring(0, 200)}...
                </p>
                <div className="flex items-center gap-4 text-xs text-[#565C70]">
                  <span className="text-[#D5D8E2] font-medium flex items-center gap-2">
                    {heroArticle.author || "Admin"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> ---
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-[#e43f3e] font-semibold text-sm hover:gap-2 transition-all">
                    Read full story <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl bg-secondary flex items-center justify-center min-h-[440px]">
              <p className="text-muted-foreground">No articles found</p>
            </div>
          )}

          {/* Sidebar: Ad + Trending Now */}
          <aside className="flex flex-col gap-4">
            <AdSlot size="rectangle" className="w-full" />
            <div className="bg-card rounded-xl p-4 border border-border h-full">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp size={11} /> Trending Now
              </h3>
              {trendingArticles.map((t, idx) => (
                <Link
                  key={t._id}
                  href={`/articles/${t.slug}`}
                  className="flex items-start gap-3 py-2.5 border-b border-border last:border-0 text-left w-full group"
                >
                  <span className="text-2xl font-bold text-border font-mono leading-none flex-shrink-0 w-7">
                    {idx + 1}
                  </span>
                  <div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: categoryColor }}
                    >
                      {displayCategoryName}
                    </span>
                    <p className="text-xs text-card-foreground group-hover:text-foreground transition-colors leading-snug line-clamp-2 mt-0.5">
                      {t.headline}
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Eye size={9} /> ---
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            Full-width Ad (leaderboard)
        ════════════════════════════════════════════════════════════════════ */}
        <AdSlot size="leaderboard" className="w-full mb-6" />

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2: LATEST STORIES — 3-column card grid
        ════════════════════════════════════════════════════════════════════ */}
        {latestStoriesArticles.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Latest Stories
              </h2>
              <button className="text-[#e43f3e] text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                All stories <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestStoriesArticles.map((article) => (
                <Link
                  key={article._id}
                  href={`/articles/${article.slug}`}
                  className="group cursor-pointer block"
                >
                  <div
                    className="relative rounded-lg overflow-hidden bg-secondary mb-3"
                    style={{ paddingTop: "62%" }}
                  >
                    <Image
                      src={article.image || article.thumbnail || ""}
                      alt={article.headline}
                      fill
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ background: categoryColor, color: "#000" }}
                    >
                      {displayCategoryName}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground group-hover:text-[#e43f3e] transition-colors line-clamp-2 leading-snug mb-1.5">
                    {article.headline}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{article.author || "Admin"}</span>
                    <span>·</span>
                    <span>{timeAgo(article.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3: Category Section Cards + Sidebar
            Left: category header + SectionCard list articles
            Right: Ad halfpage + Most Read + Newsletter + Ad rectangle
        ════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 mb-6">
          {/* Left column — Section list articles */}
          <div>
            {/* Category section header */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-1 h-5 rounded-full flex-shrink-0"
                style={{ background: categoryColor }}
              />
              <h2
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: categoryColor }}
              >
                {displayCategoryName}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* SectionCards — article list with thumbnail on right */}
            {sectionArticles.length > 0 ? (
              <div className="bg-card rounded-xl overflow-hidden border border-border mb-5">
                {sectionArticles.map((article) => (
                  <Link
                    key={article._id}
                    href={`/articles/${article.slug}`}
                    className="group cursor-pointer flex gap-4 py-4 px-4 border-b border-border last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest"
                        style={{ color: categoryColor }}
                      >
                        {displayCategoryName}
                      </span>
                      <h3
                        className="text-base font-semibold text-card-foreground group-hover:text-[#e43f3e] transition-colors leading-snug mt-1 mb-2 line-clamp-2"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {article.headline}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {stripHtml(article.content || "")}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{article.author || "Admin"}</span>
                        <span>·</span>
                        <span>{timeAgo(article.createdAt)}</span>
                        <span>·</span>
                        <span>
                          {Math.max(
                            2,
                            Math.ceil(
                              stripHtml(article.content || "").length / 1000
                            )
                          )}{" "}
                          min read
                        </span>
                      </div>
                    </div>
                    <div
                      className="relative flex-shrink-0 w-28 md:w-36 rounded-lg overflow-hidden bg-secondary"
                      style={{ minHeight: 90 }}
                    >
                      <Image
                        src={article.image || article.thumbnail || ""}
                        alt={article.headline}
                        fill
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            ) : publishedArticles.length <= 4 && publishedArticles.length > 0 ? (
              <p className="text-sm text-muted-foreground mb-5">
                More articles coming soon.
              </p>
            ) : null}

            {/* Inline leaderboard ad between section and more stories */}
            <AdSlot size="leaderboard" className="w-full mb-5" />
          </div>

          {/* Right sidebar */}
          <aside className="flex flex-col gap-5">
            <AdSlot size="halfpage" className="w-full" />

            {/* Most Read / Popular Posts */}
            <PopularPosts />

            {/* Newsletter */}
            <div
              className="rounded-xl p-5 border border-border"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,71,71,0.06) 0%, transparent 100%)",
              }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Mail size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                EpoVerse Newsletter
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Top stories delivered to your inbox every morning.
              </p>
              <input
                placeholder="your@email.com"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors mb-2"
              />
              <button className="w-full bg-[#e43f3e] hover:bg-[#c93534] text-white text-xs font-bold py-2 rounded-lg transition-colors">
                Subscribe Free
              </button>
            </div>

            <AdSlot size="rectangle" className="w-full" />
          </aside>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4: MORE STORIES — 4-column card grid
        ════════════════════════════════════════════════════════════════════ */}
        {moreStoriesArticles.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                More Stories
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moreStoriesArticles.map((article) => (
                <Link
                  key={article._id}
                  href={`/articles/${article.slug}`}
                  className="group cursor-pointer block"
                >
                  <div
                    className="relative rounded-lg overflow-hidden bg-secondary mb-3"
                    style={{ paddingTop: "62%" }}
                  >
                    <Image
                      src={article.image || article.thumbnail || ""}
                      alt={article.headline}
                      fill
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ background: categoryColor, color: "#000" }}
                    >
                      {displayCategoryName}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground group-hover:text-[#e43f3e] transition-colors line-clamp-2 leading-snug mb-1.5">
                    {article.headline}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{article.author || "Admin"}</span>
                    <span>·</span>
                    <span>{timeAgo(article.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Final leaderboard ad ── */}
        <AdSlot size="leaderboard" className="w-full mb-6" />

        {/* ════════════════════════════════════════════════════════════════════
            Empty state
        ════════════════════════════════════════════════════════════════════ */}
        {publishedArticles.length === 0 && (
          <div className="text-center py-20 bg-card rounded-xl border border-border mb-6">
            <h3 className="text-xl font-bold text-muted-foreground tracking-wide">
              No articles found in this category yet.
            </h3>
          </div>
        )}
      </div>
    </main>
  );
}
