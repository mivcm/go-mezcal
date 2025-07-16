"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
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
    <div className="container py-6 sm:py-12 px-2">
      <BackButton />
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Productos</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/products/new">Crear producto</Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push('/dashboard/orders')}>
            Ver órdenes
          </Button>
        </div>
      </div>
      {isLoading && <div>Cargando productos...</div>}
      {error && <div className="text-red-500">Error al cargar productos</div>}
      {deleteError && <div className="text-red-500 mb-4">{deleteError}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products?.map((product: any) => (
          <Card key={product.id} className="p-4 flex flex-col gap-2 h-full">
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} className="w-full sm:w-24 h-32 object-cover rounded" />
              <div className="flex-1 w-full">
                <h2 className="font-bold text-lg line-clamp-2">{product.name}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href={`/dashboard/products/${product.id}/edit`}>Editar</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
                {deleteError && <div className="text-red-500 text-xs mt-1">{deleteError}</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
