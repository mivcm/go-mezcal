import { Product } from "@/types";
import dynamic from "next/dynamic";

// Lazy load del componente client para que solo se cargue en el cliente
const ProductClient = dynamic(() => import("./_components/ProductClient"), { ssr: false });

type PageProps = {
  params: {
    id: string;
  };
};

// Rutas estáticas
export async function generateStaticParams() {
  const res = await fetch("http://localhost:3001/api/v1/products");
  const products = await res.json();

  return products.map((product: any) => ({
    id: product.id.toString(),
  }));
}

// Página del producto (Server Component)
export default async function ProductPage({ params }: PageProps) {
  const res = await fetch(`http://localhost:3001/api/v1/products/${params.id}`);
  const product: Product = await res.json();

  if (!product) {
    return (
      <div className="container py-16 text-center text-red-500">
        Producto no encontrado
      </div>
    );
  }

  return <ProductClient product={product} />;
}
