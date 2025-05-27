"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";

export default function AdminProductsPage() {
  const { token } = useUserAuthStore();
  const router = useRouter();
  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data: products, mutate, isLoading, error } = useSWR(
    "/api/v1/products",
    fetcher
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await api.delete(`/api/v1/products/${id}`);
      mutate();
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || "Error al eliminar producto");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos (Admin)</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/products/new">Crear producto</Link>
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/orders')}>
            Ver órdenes
          </Button>
        </div>
      </div>
      <div className="flex gap-4 mb-8">
        <Button variant="outline" onClick={() => router.push("/dashboard/products")}>Ver productos</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>Ver órdenes</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/carts")}>Ver carritos abandonados</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/stats")}>Ver estadísticas</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>Dashboard</Button>
      </div>
      {isLoading && <div>Cargando productos...</div>}
      {error && <div className="text-red-500">Error al cargar productos</div>}
      {deleteError && <div className="text-red-500 mb-4">{deleteError}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Categoría</th>
              <th className="p-2 border">Precio</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: any) => (
              <tr key={product.id} className="border-b">
                <td className="p-2 border font-medium">{product.name}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">${product.price}</td>
                <td className="p-2 border">{product.stock}</td>
                <td className="p-2 border space-x-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/products/${product.id}/edit`}>Editar</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                  </Button>
                </td>
              </tr>
            ))}
            {products?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
