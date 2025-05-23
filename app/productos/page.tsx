"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { products, getProductsByCategory } from "@/data/products";
import { ProductList } from "@/components/product-list";
import { Badge } from "@/components/ui/badge-special";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Product } from "../../types/index";
import axios from "axios";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9000]);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categoryParam
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: "joven", name: "Joven" },
    { id: "reposado", name: "Reposado" },
    { id: "anejo", name: "Añejo" },
    { id: "ancestral", name: "Ancestral" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios("http://localhost:3001/api/v1/products");
        setProducts(data);
      } catch (err) {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected category and price range
  const filteredProducts = products?.filter((product: Product) => {
    const matchesCategory = activeCategory
      ? product.category === activeCategory
      : true;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    
    
    console.log(product.name);
    console.log(product.price);

    return matchesCategory && matchesPrice;
  });

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);

    // Update URL query params
    if (category) {
      router.push(`/productos?categoria=${category}`);
    } else {
      router.push("/productos");
    }
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  if (loading)
    return (
      <div className="container py-16 text-center">Cargando productos...</div>
    );
  if (error)
    return (
      <div className="container py-16 text-center text-red-500">
        Error al cargar productos
      </div>
    );

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
                className={
                  activeCategory === null
                    ? "bg-amber-600 hover:bg-amber-700 w-full justify-start"
                    : "w-full justify-start"
                }
                onClick={() => handleCategoryChange(null)}
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  className={
                    activeCategory === category.id
                      ? "bg-amber-600 hover:bg-amber-700 w-full justify-start"
                      : "w-full justify-start"
                  }
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
                  onChange={(e) =>
                    setPriceRange([
                      parseInt(e.target.value) || 0,
                      priceRange[1],
                    ])
                  }
                  className="w-20 h-8"
                />
                <span className="text-muted-foreground mx-2">a</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      parseInt(e.target.value) || 2000,
                    ])
                  }
                  className="w-20 h-8"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Filtros Activos</h3>
            <div className="flex flex-wrap gap-2">
              {activeCategory && (
                <Badge
                  variant={activeCategory as any}
                  className="flex items-center gap-1"
                >
                  {categories.find((c) => c.id === activeCategory)?.name}
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="ml-1"
                  >
                    ✕
                  </button>
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  ${priceRange[0]} - ${priceRange[1]}
                  <button
                    onClick={() => setPriceRange([0, 2000])}
                    className="ml-1"
                  >
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
              {filteredProducts?.length} producto
              {filteredProducts?.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product: any) => (
                <Card key={product.id} className="flex flex-col">
                  <Link href={`/productos/${product.id}`} className="flex-1">
                    <CardHeader>
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded"
                      />
                      <CardTitle className="mt-2 text-lg font-bold">
                        {product.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-amber-600 font-bold text-xl">
                          ${product.price}
                        </span>
                        {product.rating && (
                          <span className="flex items-center text-yellow-500 text-sm">
                            <Star className="h-4 w-4 mr-1" />
                            {product.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                  <div className="p-4 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/productos/${product.id}`}>
                        Ver detalles
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">
                No se encontraron productos
              </h3>
              <p className="text-muted-foreground mb-6">
                Intenta con otros filtros o categorías.
              </p>
              <Button
                onClick={() => {
                  setActiveCategory(null);
                  setPriceRange([0, 2000]);
                  router.push("/productos");
                }}
              >
                Ver todos los productos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
