// src/lib/api.ts

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
  const res = await fetch(
    "https://project-epoverse-backend.onrender.com/api/categories",
    {
      next: { revalidate: 600 }, // cache 10 minutes
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}