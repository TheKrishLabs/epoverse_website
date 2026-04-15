export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-20 dark:bg-gray-950">
      {children}
    </div>
  );
}