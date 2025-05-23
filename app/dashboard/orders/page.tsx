"use client";

import { useEffect, useState } from "react";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

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

  console.log(orders);

  return (
    <div className="container py-12 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">Órdenes (Admin)</h1>
      <div className="flex gap-4 mb-8">
        {/* <Button
          variant="outline"
          onClick={() => router.push("/dashboard/users")}
        >
          Gestionar Usuarios
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/transactions")}
        >
          Ver Transacciones
        </Button> */}
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
        >
          Ver productos
        </Button>
      </div>
      {orders.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No hay órdenes registradas.
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 bg-white dark:bg-zinc-900 shadow"
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium">Orden #{order.id}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Usuario:</span>{" "}
                {order.user_email || order.user?.email || "-"}
              </div>
              <div className="mb-2">
                <span className="font-medium">Estado:</span>{" "}
                {order.status === "completed" ? "Completada" : order.status}
              </div>
              <div className="mb-2">
                <span className="font-medium">Total:</span> ${order.total}
              </div>
              <div className="mb-2">
                <span className="font-medium">Productos:</span>
                <ul className="list-disc ml-6">
                  {order.items?.map(
                    (item: {
                      product: Product;
                      quantity: number;
                      price: string;
                    }) => (
                      <li key={item.product.id}>
                        {item.product.name} x{item.quantity} - {item.price} MXN
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-medium">Transacción:</span>{" "}
                {order.transaction_id || order.transaction?.id || "-"}
              </div>
              {order.status === "pending" && (
                <div className="mb-2">
                  <span className="font-medium">Cambiar estado:</span>

                  <Button
                    size="sm"
                    className="ml-2"
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `http://localhost:3001/api/v1/orders/${order.id}/complete`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        if (!res.ok)
                          throw new Error("No se pudo completar la orden");
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === order.id
                              ? { ...o, status: "completed" }
                              : o
                          )
                        );
                      } catch (err) {
                        alert("Error al completar la orden");
                      }
                    }}
                  >
                    Marcar como completada
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
