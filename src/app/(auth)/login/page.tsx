"use client";
import { useState } from "react";
import LoginModal from "../../../../components/Login/LoginModal";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <LoginModal
        isOpen={isLoginOpen}
        onLogin={() => {
          setIsLogin(true)}}
        onClose={() => {
          setIsLoginOpen(false);
          router.push("/");
        }}
      />
    </div>
  );
}
