"use client";

import { useState, useEffect } from "react";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AdminAbandonedCartsPage() {
  const { token } = useUserAuthStore();
  const router = useRouter();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await api.get("/api/v1/carts/abandoned", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCarts(response.data.carts || response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar carritos");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCarts();
    }
  }, [token]);

  if (loading) return <div className="container py-12 text-center">Cargando carritos...</div>;
  if (error) return <div className="container py-12 text-center text-red-600">{error}</div>;

  return (
    <div className="container py-6 sm:py-12 px-2 max-w-4xl">
      <BackButton />
      
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Carritos Abandonados</h1>
      <div className="space-y-4">
        {carts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay carritos abandonados
          </div>
        ) : (
          carts.map((cart: any) => (
            <div key={cart.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Carrito #{cart.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Usuario: {cart.user?.email || "Anónimo"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Creado: {new Date(cart.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${cart.total}</p>
                  <p className="text-sm text-muted-foreground">
                    {cart.items?.length || 0} productos
                  </p>
                </div>
              </div>
              
              {cart.items && cart.items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Productos:</h4>
                  <div className="space-y-1">
                    {cart.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.product?.name || "Producto desconocido"}</span>
                        <span className="text-muted-foreground">
                          {item.quantity} x ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
