"use client";
import { useState } from "react";
import LoginModal from "../../../../components/Login/LoginModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginPageInner() {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <LoginModal
        isOpen={isLoginOpen}
        redirectTo={redirectPath}
        onLogin={() => {
          setIsLogin(true)}}
        onClose={() => {
          setIsLoginOpen(false);
          router.push(redirectPath);
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
