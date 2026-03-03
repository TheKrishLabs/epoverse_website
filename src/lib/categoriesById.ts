export async function fetchArticlesByCategoryId(categoryId: string) {
  const res = await fetch(
    `https://project-epoverse-backend.onrender.com/api/articles/fetch-by-category/${categoryId}`,
    {
      next: { revalidate: 60 }, // cache for 60 seconds
    }
  );
 console.log(res)
  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
}