"use client"
import { useEffect, useState } from "react";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { useCartStore } from "@/hooks/use-cart-store";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function AdminAbandonedCartsPage() {
  const { token, isAdmin } = useUserAuthStore();
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token || !isAdmin) return;
    const fetchAbandoned = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/v1/admin/carts/abandoned");
        setAbandonedCarts(res.data.carts || res.data);
      } catch (err: any) {
        setError(err.message || "Error al cargar carritos");
      } finally {
        setLoading(false);
      }
    };
    fetchAbandoned();
  }, [token, isAdmin]);

  if (!token || !isAdmin) return <div className="container py-16 text-center">Acceso restringido</div>;
  if (loading) return <div className="container py-16 text-center">Cargando carritos abandonados...</div>;
  if (error) return <div className="container py-16 text-center text-red-500">{error}</div>;

  if (abandonedCarts.length === 0) {
    return <div className="container py-16 text-center">No hay carritos abandonados.</div>;
  }


  return (
    <div className="container py-6 sm:py-12 px-2 max-w-4xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Carritos Abandonados</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8 w-full">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard/products")}>Ver productos</Button>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard/orders")}>Ver órdenes</Button>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard/carts")}>Ver carritos abandonados</Button>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard/stats")}>Ver estadísticas</Button>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard")}>Dashboard</Button>
      </div>
      <div className="space-y-8">
        {abandonedCarts.map((cart) => (
          <div key={cart.id} className="border rounded-lg p-4 sm:p-6 bg-white dark:bg-zinc-900 shadow flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex-1">
                <div className="mb-1 text-xs sm:text-sm"><span className="font-medium">ID Carrito:</span> {cart.id}</div>
                <div className="mb-1 text-xs sm:text-sm"><span className="font-medium">Usuario:</span> {cart.user?.email || "-"}</div>
                <div className="mb-1 text-xs sm:text-sm"><span className="font-medium">Estado:</span> {cart.status}</div>
                <div className="mb-1 text-xs sm:text-sm"><span className="font-medium">Creado:</span> {new Date(cart.created_at).toLocaleString("es-MX")}</div>
              </div>
              <div className="flex-1">
                <span className="font-medium text-xs sm:text-sm">Productos:</span>
                {cart.items && cart.items.length > 0 ? (
                  <ul className="list-disc ml-4 mt-1">
                    {cart.items.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 py-1 text-xs sm:text-sm">
                        {item.product?.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded" />
                        )}
                        <span>{item.product?.name || "-"} x{item.quantity}</span>
                        <span className="text-muted-foreground">${item.product?.price}</span>
                        <span className="text-muted-foreground">Stock: {item.product?.stock ?? '-'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground ml-2">Sin productos</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
