"use client";

import { useEffect, useState } from "react";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OrderDetailClient({ id }: { id: string }) {
  const { token } = useUserAuthStore();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo cargar la orden");
        const data = await res.json();
        setOrder(data.order || data); // Ajusta según backend
      } catch (err: any) {
        setError(err.message || "Error al cargar la orden");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [token, id, router]);

  if (loading) return <div className="container py-16 text-center">Cargando orden...</div>;
  if (error) return <div className="container py-16 text-center text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Detalle de Orden #{order.id}</h1>
      <div className="mb-4"><span className="font-medium">Fecha:</span> {new Date(order.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</div>
      <div className="mb-4"><span className="font-medium">Estado:</span> {order.status}</div>
      <div className="mb-4"><span className="font-medium">Total:</span> ${order.total}</div>
      <div className="mb-4">
        <span className="font-medium">Productos:</span>
        <ul className="list-disc ml-6">
          {order.items?.map((item: any) => (
            <li key={item.product_id}>
              {item.product_name || item.name} x{item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Button variant="outline" size="sm" onClick={() => router.push("/orders")}>Volver a mis órdenes</Button>
    </div>
  );
}
