"use client";
import Link from "next/link";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { token } = useUserAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-2">
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-8 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Dashboard de Administrador</h1>
        <p className="mb-6 text-center text-sm sm:text-base">Bienvenido al panel de administración.</p>
        {token && (
          <div className="flex flex-col items-center gap-3 sm:gap-4 mt-6 w-full">
            <Link href="/dashboard/products" className="w-full">
              <span className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 sm:px-6 rounded transition text-center text-sm sm:text-base">Gestionar productos</span>
            </Link>
            <Link href="/dashboard/orders" className="w-full">
              <span className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:px-6 rounded transition text-center text-sm sm:text-base">Ver órdenes</span>
            </Link>
            <Link href="/dashboard/carts" className="w-full">
              <span className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 sm:px-6 rounded transition text-center text-sm sm:text-base">Carritos abandonados</span>
            </Link>
            <Link href="/dashboard/stats" className="w-full">
              <span className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 sm:px-6 rounded transition text-center text-sm sm:text-base">Estadísticas</span>
            </Link>
            <Link href="/dashboard/site-config" className="w-full">
              <span className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 sm:px-6 rounded transition text-center text-sm sm:text-base">Configuración del sitio</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
