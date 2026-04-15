import Link from "next/link";

export default function Breadcrumb({
  category,
  title,
}: {
  category?: string;
  title?: string;
}) {
  return (
    <div className="text-sm text-gray-500 mb-6 dark:text-gray-400">
      <Link href="/" className="hover:text-red-500">Home</Link>
      <span> / </span>
      <span className="text-red-500">{category}</span>
      <span> / </span>
      <span className="dark:text-gray-300">{title}</span>
    </div>
  );
}