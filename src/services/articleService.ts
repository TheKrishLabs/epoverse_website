import { publicApi } from "@/lib/axios";
import { Article } from "@/types/article";

// GET ALL ARTICLES
export const getArticles = async (): Promise<Article[]> => {
  try {
    const res = await publicApi.get("/articles");
    return res.data;
  } catch (err) {
    console.error("Error fetching articles:", err);
    return [];
  }
};

// GET SINGLE ARTICLE
export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const res = await publicApi.get(`/articles/${slug}`);
  return res.data;
};

// CREATE ARTICLE
export const createArticle = async (data: Partial<Article>) => {
  const res = await publicApi.post("/articles", data);
  return res.data;
};

// UPDATE ARTICLE
export const updateArticle = async (id: string, data: Partial<Article>) => {
  const res = await publicApi.put(`/articles/${id}`, data);
  return res.data;
};

// DELETE ARTICLE
export const deleteArticle = async (id: string) => {
  const res = await publicApi.delete(`/articles/${id}`);
  return res.data;
};
