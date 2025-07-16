import { Product } from "@/types";
import dynamic from "next/dynamic";

const ProductClient = dynamic(() => import("./_components/ProductClient"), { ssr: false });

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/products`);
  
  if (!res.ok) {
    return [];
  }

  const products: Product[] = await res.json();

  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: PageProps) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/products/${params.id}`);

  if (!res.ok) {
    return (
      <div className="container py-16 text-center text-red-500">
        Producto no encontrado
      </div>
    );
  }

  const product: Product = await res.json();

  return <ProductClient product={product} />;
}
