"use client";
import { notFound, useParams } from "next/navigation";

import ProductEditForm from "./_components/ProductEditForm"
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";



export default async function ProductEditPage() {
  const { id } = useParams();

  if (!id) {
    notFound();
  }

  return (
    <div className="container py-12 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">Editar producto</h1>
        <Link href="/dashboard/products">
          <Button variant="outline">
            <ArrowLeftIcon className="w-4 h-4" />
            Volver
          </Button>
        </Link>
      </div>
      <ProductEditForm productId={Array.isArray(id) ? id[0] : id} />
    </div>
  );
}