import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";

interface ProductListProps {
  title?: string;
  products: Product[];
  className?: string;
}

export function ProductList({ title, products, className }: ProductListProps) {
  return (
    <div className={className}>
      {title && (
        <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}