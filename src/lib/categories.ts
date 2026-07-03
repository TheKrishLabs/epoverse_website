import { publicApi } from "@/lib/axios";

export interface Category {
  _id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export async function getCategories(): Promise<Category[]> {

  try {

    const res = await publicApi.get("/categories/user");

    return res.data;

  } catch (error) {

    console.error("Fetch categories error:", error);
    throw error;

  }

}