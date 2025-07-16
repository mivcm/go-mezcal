"use client";
import Link from "next/link";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Link = {
  label: string;
  href: string;
  color: string;
}

export default function DashboardPage() {
  const { token } = useUserAuthStore();
  const LINKS: Link[] = [
    {
      label: "Gestionar productos",
      href: "/dashboard/products",
      color: "bg-amber-600 hover:bg-amber-700",
    },
    {
      label: "Ver órdenes",
      href: "/dashboard/orders",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Configuración del sitio",
      href: "/dashboard/site-config",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      label: "Blogs",
      href: "/dashboard/blogs",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "Estadísticas",
      href: "/dashboard/stats",
      color: "bg-yellow-600 hover:bg-yellow-700",
    },
    {
      label: "Mensajes de contacto",
      href: "/dashboard/contact-messages",
      color: "bg-red-600 hover:bg-red-700",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-2">
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-8 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Dashboard de Administrador</h1>
        <p className="mb-6 text-center text-sm sm:text-base">Bienvenido al panel de administración.</p>
        {token && (
          <div className="flex flex-col items-center gap-3 sm:gap-4 mt-6 w-full">
            {LINKS.map((link) => (
              <Link href={link.href} className={`w-full ${link.color}`}>
                <span className="block w-full text-white font-bold py-2 px-4 sm:px-6 rounded transition text-center text-sm sm:text-base">{link.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
