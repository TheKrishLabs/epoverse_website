// Category type
export type Category = {
  _id?: string;
  name: string;
};

// Main Article type
export type Article = {
  _id: string;
  headline: string;
  content: string;
  image?: string;
  thumbnail?: string;
  slug: string;
  author: string;
  status: "draft" | "published";
  isLatest: boolean;
  category: Category;
  createdAt?: string;
  updatedAt?: string;
};

// Response when fetching all articles
export type GetArticlesResponse = Article[];

// Response when fetching single article
export type GetArticleResponse = Article;
