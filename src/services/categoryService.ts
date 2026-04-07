import { publicApi } from "@/lib/axios";
import { Category, CategoryResponse } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await publicApi.get<CategoryResponse>("/categories");
    return res.data.categories;
  } catch (err) {
    console.error("Category API error:", err);
    return [];
  }
}
