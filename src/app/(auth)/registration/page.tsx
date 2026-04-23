"use client";

import { useState } from "react";
import RegistrationModal from "../../../../components/Login/RegistrationModal";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function RegistrationPageInner() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const router = useRouter();

  return (
    <div className="flex justify-center items-start pt-16 min-h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-950">
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => {
          setIsRegistrationOpen(false);
          router.push("/");
        }}
        onSwitchToLogin={() => {
          router.push("/login");
        }}
      />
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense>
      <RegistrationPageInner />
    </Suspense>
  );
}