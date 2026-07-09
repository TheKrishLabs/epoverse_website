import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, Clock, Eye } from "lucide-react";
import { getArticleBySlug } from "@/services/articleService";
import Comments from "@/components/ArticleSlugPage/Comments";
import BookmarkButton from "@/components/ArticleSlugPage/BookmarkButton";
import VotingPoll from "@/components/ArticleSlugPage/VotingPoll";
import TopWeek from "@/components/ArticleSlugPage/TopWeek";
import Report from "@/components/ArticleSlugPage/Report";
import ShareButtons from "../../../../components/ArticlesSlugePage/ShareButtons";
import MoreInCategory from "@/components/ArticleSlugPage/MoreInCategory";
import PopularPosts from "../../../../components/CategoryPage.tsx/PopularPosts";
import AdSlot from "@/components/AdSlot";
import YouMayAlsoLike from "@/components/ArticleSlugPage/YouMayAlsoLike";

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${params.slug}`;

  if (!article) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-muted-foreground">
        Article not found
      </div>
    );
  }

  const imageSrc =
    article.image || article.thumbnail || "https://via.placeholder.com/800x400";

  const CATEGORY_COLORS: Record<string, string> = {
    International: "#5B8DEF",
    Entertainment: "#FF5C8A",
    Education: "#2FC6A0",
    Sports: "#FFB238",
    Finance: "#4AD991",
    Technology: "#B18CFF",
    Home: "#FF4747",
  };

  const categoryName = article.category?.name || "News";
  const color = CATEGORY_COLORS[categoryName] || "#FF4747";

  return (
    <main className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hero ── (ref lines 735-748) */}
      <div className="relative h-[40vh] md:h-[55vh] overflow-hidden bg-secondary">
        <Image src={imageSrc} alt={article.headline} fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(16,18,26,0.3) 0%,rgba(16,18,26,0.92) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 max-w-[1400px] mx-auto px-4 md:px-8 pb-6 md:pb-10">
          {/* Breadcrumb: ref line 740-742 */}
          <div className="flex items-center gap-2 mb-3 z-10 relative">
            <Link href="/" className="text-[#8A90A3] text-xs hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} className="text-[#565C70]" />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{article.category?.name || "News"}</span>
          </div>
          {/* Title: ref line 744 */}
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl z-10 relative" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {article.headline}
          </h1>
        </div>
      </div>

      {/* ── Content area ── (ref line 750-751) */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* ── Main body ── (ref line 754) */}
          <article>
            {/* Meta bar: ref lines 756-777 */}
            <div className="flex flex-wrap items-center gap-4 pb-5 mb-5 border-b border-border">
              {/* Author avatar + name: ref 757-762 */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-secondary border-2 border-primary flex items-center justify-center font-bold text-muted-foreground text-sm">
                  {(article.author || "A")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{article.author || "Admin"}</p>
                  <p className="text-[11px] text-muted-foreground">Author</p>
                </div>
              </div>

              {/* Date/views meta: ref 764-768 */}
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground ml-auto">
                {article.views !== undefined && (
                  <span className="flex items-center gap-1"><Eye size={11} /> {article.views?.toLocaleString()}</span>
                )}
                {article.createdAt && (
                  <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(article.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                )}
              </div>

              {/* Share/Bookmark: ref 769-776 */}
              <div className="flex items-center gap-2">
                <ShareButtons url={articleUrl} title={article.headline} />
                <BookmarkButton postId={article._id} />
              </div>
            </div>

            {/* Article content: ref 779-798 — body paragraphs use text-muted-foreground, excerpt uses text-card-foreground */}
            <div
              className="prose max-w-none editorial-prose"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Author bio: ref 808-816 */}
            <div className="bg-card rounded-xl p-5 mt-6 flex gap-4 border border-border">
              <div className="w-14 h-14 rounded-full bg-secondary border-2 border-primary flex items-center justify-center font-bold text-muted-foreground flex-shrink-0 text-xl">
                {(article.author || "A")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground mb-0.5">{article.author || "Admin"}</p>
                <p className="text-[11px] text-muted-foreground mb-2">Author · EpoVerse</p>
              </div>
            </div>

            {/* Social share: ref 818-835 */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
              <span className="text-xs text-muted-foreground font-semibold">Share</span>
              <ShareButtons url={articleUrl} title={article.headline} />
            </div>

            <AdSlot size="leaderboard" className="w-full mt-6" />

            {/* Report + Comments */}
            <div className="mt-12 pt-6 border-t border-border">
              <Report articleId={article._id} />
              <div className="mt-8">
                <Comments articleId={article._id} />
              </div>
            </div>
          </article>

          {/* ── Sidebar ── (ref lines 841-871) */}
          <aside className="flex flex-col gap-5">
            <AdSlot size="rectangle" className="w-full" />
            {article.category?._id && (
              <MoreInCategory
                categoryId={article.category._id}
                categoryName={article.category.name || "News"}
                currentArticleId={article._id}
              />
            )}
            <PopularPosts />
            <TopWeek />
            <VotingPoll />
          </aside>

        </div>

        {/* ── Related section ── (ref lines 874-884) */}
        <YouMayAlsoLike currentArticleId={article._id} />
      </div>
    </main>
  );
}
