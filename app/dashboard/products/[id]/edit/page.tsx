import { notFound, useParams } from "next/navigation";

import ProductEditForm from "./_components/ProductEditForm"



export default async function ProductEditPage() {
  const { id } = useParams();

  if (!id) {
    notFound();
  }

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar producto</h1>
      <ProductEditForm productId={Array.isArray(id) ? id[0] : id} />
    </div>
  );
}