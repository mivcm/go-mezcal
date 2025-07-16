'use client'
import Link from "next/link";
import { ProductList } from "./product-list";
import { useProductsStore } from "@/hooks/use-products-store";
import { useEffect } from "react";

export default function FeaturedProducts() {
    const { products, getFeaturedProducts } = useProductsStore();

    useEffect(() => {
        getFeaturedProducts();
    }, [getFeaturedProducts]);

    return (
        <section className="py-16 bg-amber-50/50 dark:bg-stone-900">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8">
            <h2 className="text-3xl font-bold">Mezcales Destacados</h2>
            <Link href="/productos" className="text-amber-600 hover:text-amber-700 font-medium">
              Ver todos los mezcales
            </Link>
          </div>
          <ProductList products={products} />
        </div>
      </section>
    )
}