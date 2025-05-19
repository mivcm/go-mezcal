"use client";

import { useState } from "react";
import { products, getProductsByCategory } from "@/data/products";
import { ProductList } from "@/components/product-list";
import { Badge } from "@/components/ui/badge-special";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  
  const categories = [
    { id: "joven", name: "Joven" },
    { id: "reposado", name: "Reposado" },
    { id: "anejo", name: "Añejo" },
    { id: "ancestral", name: "Ancestral" },
  ];

  // Filter products based on selected category and price range
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory ? product.category === activeCategory : true;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    
    // Update URL query params
    if (category) {
      router.push(`/productos?categoria=${category}`);
    } else {
      router.push('/productos');
    }
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Categorías</h3>
            <div className="space-y-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                className={activeCategory === null ? "bg-amber-600 hover:bg-amber-700 w-full justify-start" : "w-full justify-start"}
                onClick={() => handleCategoryChange(null)}
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id ? "bg-amber-600 hover:bg-amber-700 w-full justify-start" : "w-full justify-start"}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Precio</h3>
            <div className="space-y-6">
              <Slider
                defaultValue={[0, 2000]}
                max={2000}
                step={50}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceChange}
                className="mt-6"
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-20 h-8"
                />
                <span className="text-muted-foreground mx-2">a</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
                  className="w-20 h-8"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Filtros Activos</h3>
            <div className="flex flex-wrap gap-2">
              {activeCategory && (
                <Badge variant={activeCategory as any} className="flex items-center gap-1">
                  {categories.find(c => c.id === activeCategory)?.name}
                  <button onClick={() => handleCategoryChange(null)} className="ml-1">
                    ✕
                  </button>
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  ${priceRange[0]} - ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 2000])} className="ml-1">
                    ✕
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Nuestros Mezcales</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-6">
                Intenta con otros filtros o categorías.
              </p>
              <Button onClick={() => {
                setActiveCategory(null);
                setPriceRange([0, 2000]);
                router.push('/productos');
              }}>
                Ver todos los productos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}