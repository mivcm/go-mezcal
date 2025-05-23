"use client";

import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useUserAuthStore();
  
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  // Mientras no haya token, no renderizar nada (evita parpadeo)
  if (!token) return null;

  return <>{children}</>;
}
