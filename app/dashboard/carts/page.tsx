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

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Carritos Abandonados</h1>
      <div className="flex gap-4 mb-8">
        <Button variant="outline" onClick={() => router.push("/dashboard/products")}>Ver productos</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>Ver órdenes</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/carts")}>Ver carritos abandonados</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/stats")}>Ver estadísticas</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>Dashboard</Button>
      </div>
      {abandonedCarts.length === 0 ? (
        <div className="text-center text-muted-foreground">No hay carritos abandonados.</div>
      ) : (
        <div className="space-y-8">
          {abandonedCarts.map((cart) => (
            <div key={cart.id} className="border rounded-lg p-6 bg-white dark:bg-zinc-900 shadow">
              <div className="mb-2">
                <span className="font-medium">Usuario:</span> {cart.user_email || cart.user?.email || "-"}
              </div>
              <div className="mb-2">
                <span className="font-medium">Estado:</span> {cart.status}
              </div>
              <div className="mb-2">
                <span className="font-medium">Productos:</span>
                <ul className="list-disc ml-6">
                  {cart.items?.map((item: any) => (
                    <li key={item.product_id}>
                      {item.product_name || item.name} x{item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-medium">Última actualización:</span> {new Date(cart.updated_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
