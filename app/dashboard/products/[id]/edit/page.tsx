import { notFound } from "next/navigation";

import ProductEditForm from "./_components/ProductEditForm"
// Si quieres hacer un fetch server-side para verificar que el producto exista,
// puedes hacerlo aquí con fetch o axios, usando params.id.

interface Params {
  params: { id: string };
}

export async function generateStaticParams() {
  const res = await fetch("http://localhost:3001/api/v1/products");
  const products = await res.json();

  return products.map((product: { id: number | string }) => ({
    id: product.id.toString(),
  }));
}


export default async function ProductEditPage({ params }: Params) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar producto</h1>
      <ProductEditForm productId={id} />
    </div>
  );
}