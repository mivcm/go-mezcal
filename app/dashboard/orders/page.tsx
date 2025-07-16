"use client";

import { useEffect, useState } from "react";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import api from "@/lib/axios"; // Asegúrate de que esta sea la ruta correcta a tu instancia de axios

export default function AdminOrdersPage() {
  const { token, isAdmin } = useUserAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !isAdmin) {
      router.push("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/v1/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudieron cargar las órdenes");
        const data = await res.json();
        setOrders(data.orders || data); // Ajusta según respuesta backend
      } catch (err: any) {
        setError(err.message || "Error al cargar órdenes");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token, isAdmin, router]);

  if (loading)
    return (
      <div className="container py-16 text-center">Cargando órdenes...</div>
    );
  if (error)
    return (
      <div className="container py-16 text-center text-red-500">{error}</div>
    );

  return (
    <div className="container py-6 sm:py-12 px-2 max-w-5xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
        Órdenes (Admin)
      </h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8 w-full">
        <Button
          className="w-full sm:w-auto"
          onClick={() => router.push("/dashboard/products")}
        >
          Ver productos
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => router.push("/dashboard/carts")}
        >
          Ver carritos abandonados
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => router.push("/dashboard/stats")}
        >
          Ver estadísticas
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2">ID</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Total</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2 text-center">{order.id}</td>
                <td className="p-2 text-center">{order.user?.email || "-"}</td>
                <td className="p-2 text-center">${order.total}</td>
                <td className="p-2 text-center">{order.status}</td>
                <td className="p-2 text-center">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 text-center">
                  {(order.status === "pending" || order.status === "paid") ? (
                    <Button
                      size="sm"
                      className="w-full sm:w-auto mt-2"
                      onClick={async () => {
                        try {
                          const res = await api.patch(
                            `/api/v1/orders/${order.id}/complete`
                          );
                          if (res.status !== 200 && res.status !== 201)
                            throw new Error("No se pudo completar la orden");
                          setOrders((prev) =>
                            prev.map((o) =>
                              o.id === order.id ? { ...o, status: "completed" } : o
                            )
                          );
                        } catch (err: any) {
                          alert((err as any).message || "Error al completar la orden");
                        }
                      }}
                    >
                      Completar orden
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
