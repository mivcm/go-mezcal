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
import api from "@/lib/axios";
import { useCartStore } from "@/hooks/use-cart-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

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

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  const categories = [
    { id: "joven", name: "Joven" },
    { id: "reposado", name: "Reposado" },
    { id: "anejo", name: "Añejo" },
    { id: "ancestral", name: "Ancestral" },
  ];

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api("/api/v1/products");
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
      {/* Quick View Modal */}
      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="max-w-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-none shadow-xl">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-stone-900 dark:text-stone-100">{quickViewProduct.name}</DialogTitle>
              </DialogHeader>
              <img
                src={quickViewProduct.images?.[0] || "/placeholder.svg"}
                alt={quickViewProduct.name}
                className="w-full h-56 object-cover rounded mb-4 bg-stone-200 dark:bg-stone-800"
              />
              <div className="mb-2 text-amber-600 font-bold text-2xl">
                ${quickViewProduct.price}
              </div>
              <div className="flex gap-2 text-xs text-stone-600 dark:text-stone-300 mb-2">
                <span>{quickViewProduct.volume}ml</span>
                <span>·</span>
                <span>{quickViewProduct.abv}% vol.</span>
                <span>·</span>
                <span>{quickViewProduct.origin}</span>
              </div>
              <div className="mb-2 text-sm text-stone-700 dark:text-stone-300">
                {quickViewProduct.shortDescription}
              </div>
              <div className="mb-2 text-xs">
                Stock: <span className={quickViewProduct.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>{quickViewProduct.stock > 0 ? quickViewProduct.stock : "Agotado"}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm font-medium">{quickViewProduct.rating}</span>
                <span className="ml-2 text-xs text-stone-500 dark:text-stone-400">({quickViewProduct.reviews?.length || 0} reseñas)</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setQuickViewQty(q => Math.max(1, q - 1))}
                  disabled={quickViewQty <= 1}
                >-</Button>
                <span className="px-2 font-semibold text-lg">{quickViewQty}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setQuickViewQty(q => quickViewProduct.stock && q < quickViewProduct.stock ? q + 1 : q)}
                  disabled={quickViewProduct.stock ? quickViewQty >= quickViewProduct.stock : false}
                >+</Button>
              </div>
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={quickViewProduct.stock === 0}
                onClick={() => {
                  addItem({
                    id: quickViewProduct.id,
                    name: quickViewProduct.name,
                    price: quickViewProduct.price,
                    image: quickViewProduct.images?.[0] || "",
                    stock: quickViewProduct.stock,
                    quantity: quickViewQty,
                  });
                  setQuickViewProduct(null);
                  setQuickViewQty(1);
                }}
              >
                Agregar al carrito
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" className="w-full mt-2">Cerrar</Button>
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>

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
                      <div className="flex gap-2 text-xs text-muted-foreground mb-1">
                        <span>{product.volume}ml</span>
                        <span>·</span>
                        <span>{product.abv}% vol.</span>
                        <span>·</span>
                        <span>{product.origin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span>Stock: {product.stock > 0 ? product.stock : "Agotado"}</span>
                        <span>|</span>
                        <span>{product.reviews?.length || 0} reseñas</span>
                      </div>
                    </CardContent>
                  </Link>
                  <div className="p-4 pt-0 flex gap-2">
                    <Button asChild className="w-full">
                      <Link href={`/productos/${product.id}`}>Ver detalles</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setQuickViewProduct(product);
                        setQuickViewQty(1);
                      }}
                    >
                      Vista rápida
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
