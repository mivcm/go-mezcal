"use client";
import Link from "next/link";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";

export default function DashboardPage() {
  const { token } = useUserAuthStore();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Dashboard de Administrador</h1>
        <p className="mb-6 text-center">Bienvenido al panel de administración.</p>
        {token && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <Link href="/dashboard/products">
              <span className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded transition">Gestionar productos</span>
            </Link>
            <Link href="/dashboard/orders">
              <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition">Ver órdenes</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
