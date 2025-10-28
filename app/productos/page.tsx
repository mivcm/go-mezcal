"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardTitle } from "@/components/ui/card"
import { Star, Filter, X, Eye, ShoppingCart, Grid, List } from "lucide-react"
import type { Product } from "../../types/index"
import api from "@/lib/axios"
import { useCartStore } from "@/hooks/use-cart-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useUserAuthStore } from "@/hooks/use-user-auth-store"
import { useToast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("categoria")

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9000])
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewQty, setQuickViewQty] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: "joven", name: "Joven", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { id: "reposado", name: "Reposado", color: "bg-amber-100 text-amber-800 border-amber-200" },
    { id: "anejo", name: "Añejo", color: "bg-orange-100 text-orange-800 border-orange-200" },
    { id: "ancestral", name: "Ancestral", color: "bg-purple-100 text-purple-800 border-purple-200" },
  ]

  const { addItem } = useCartStore()
  const { token } = useUserAuthStore()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api("/api/v1/products")
        setProducts(data)
      } catch (err) {
        setError("Error al cargar productos")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on selected category and price range
  const filteredProducts = products?.filter((product: Product) => {
    const matchesCategory = activeCategory ? product.category === activeCategory : true
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

    return matchesCategory && matchesPrice
  })

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category)

    // Update URL query params
    if (category) {
      router.push(`/productos?categoria=${category}`)
    } else {
      router.push("/productos")
    }
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const clearAllFilters = () => {
    setActiveCategory(null)
    setPriceRange([0, 9000])
    router.push("/productos")
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando productos</h2>
          <p className="text-gray-600">Descubriendo los mejores destilados para ti...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-6">Hubo un problema al cargar los productos. Por favor, intenta de nuevo.</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            Reintentar
          </Button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Quick View Modal */}
      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
          {quickViewProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img
                  src={quickViewProduct.images?.[0] || "/placeholder.svg"}
                  alt={quickViewProduct.name}
                  className="w-full h-64 md:h-80 object-cover rounded-xl bg-gray-100"
                />
              </div>
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">{quickViewProduct.name}</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-amber-600">${quickViewProduct.price.toLocaleString()}</span>
                  {quickViewProduct.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{quickViewProduct.rating}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded">{quickViewProduct.volume}ml</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{quickViewProduct.abv}% vol.</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{quickViewProduct.origin}</span>
                </div>

                <p className="text-gray-700 leading-relaxed">{quickViewProduct.shortDescription}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Stock:{" "}
                    <span
                      className={quickViewProduct.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}
                    >
                      {quickViewProduct.stock > 0 ? quickViewProduct.stock : "Agotado"}
                    </span>
                  </span>
                  <span className="text-sm text-gray-500">({quickViewProduct.reviews?.length || 0} reseñas)</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                    disabled={quickViewQty <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 bg-gray-50 rounded-lg font-semibold min-w-[60px] text-center">
                    {quickViewQty}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full"
                    onClick={() =>
                      setQuickViewQty((q) => (quickViewProduct.stock && q < quickViewProduct.stock ? q + 1 : q))
                    }
                    disabled={quickViewProduct.stock ? quickViewQty >= quickViewProduct.stock : false}
                  >
                    +
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 rounded-xl font-semibold"
                    disabled={quickViewProduct.stock === 0}
                    onClick={() => {
                      if (!token) {
                        toast({
                          title: "Debes iniciar sesión",
                          description: "Inicia sesión para agregar productos al carrito.",
                          variant: "destructive",
                        })
                        return
                      }
                      addItem({
                        id: quickViewProduct.id,
                        name: quickViewProduct.name,
                        price: quickViewProduct.price,
                        image: quickViewProduct.images?.[0] || "",
                        stock: quickViewProduct.stock,
                        quantity: quickViewQty,
                      })
                      setQuickViewProduct(null)
                      setQuickViewQty(1)
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al carrito
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full h-12 rounded-xl">
                      Cerrar
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="container py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Nuestros destilados</h1>
              <p className="text-lg text-gray-600">Descubre la tradición y sabor auténtico de México</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-md"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-md"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden bg-white">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Results count and active filters */}
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-600 font-medium">
              {filteredProducts?.length} producto{filteredProducts?.length !== 1 ? "s" : ""} encontrado
              {filteredProducts?.length !== 1 ? "s" : ""}
            </p>
            {(activeCategory || priceRange[0] > 0 || priceRange[1] < 9000) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Filtros activos:</span>
                {activeCategory && (
                  <Badge
                    variant="secondary"
                    className={`${categories.find((c) => c.id === activeCategory)?.color} flex items-center gap-1`}
                  >
                    {categories.find((c) => c.id === activeCategory)?.name}
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 9000) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    <button
                      onClick={() => setPriceRange([0, 9000])}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Limpiar todo
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6 space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Categorías</h3>
                <div className="space-y-3">
                  <Button
                    variant={activeCategory === null ? "default" : "outline"}
                    className={`w-full justify-start h-11 rounded-xl font-medium ${
                      activeCategory === null
                        ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleCategoryChange(null)}
                  >
                    Todos los destilados
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      className={`w-full justify-start h-11 rounded-xl font-medium ${
                        activeCategory === category.id
                          ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Rango de Precio</h3>
                <div className="space-y-6">
                  <Slider
                    defaultValue={[0, 9000]}
                    max={9000}
                    step={100}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceChange}
                    className="mt-6"
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 mb-1 block">Mínimo</label>
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                        className="h-10 rounded-lg"
                        placeholder="$0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 mb-1 block">Máximo</label>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 9000])}
                        className="h-10 rounded-lg"
                        placeholder="$9,000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts && filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {filteredProducts.map((product: any) => (
                  <Card
                    key={product.id}
                    className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white rounded-2xl overflow-hidden ${
                      viewMode === "list" ? "flex flex-row" : "flex flex-col h-full"
                    }`}
                  >
                    <div className={viewMode === "list" ? "w-48 flex-shrink-0" : "relative"}>
                      <Link href={`/productos/${product.id}`}>
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className={`object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-300 ${
                            viewMode === "list" ? "w-full h-full" : "w-full h-56"
                          }`}
                        />
                      </Link>
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={`p-6 flex flex-col ${viewMode === "list" ? "flex-1" : "flex-1"}`}>
                      <Link href={`/productos/${product.id}`} className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </CardTitle>

                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl font-bold text-amber-600">${product.price.toLocaleString()}</span>
                          {product.rating && (
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mb-3 flex-wrap">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {product.volume}ml
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {product.abv}% vol.
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {product.origin}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span>
                            Stock:{" "}
                            <span
                              className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}
                            >
                              {product.stock > 0 ? product.stock : "Agotado"}
                            </span>
                          </span>
                          <span>{product.reviews?.length || 0} reseñas</span>
                        </div>
                      </Link>

                      <div className="flex gap-2 mt-auto">
                        <Button asChild className="flex-1 bg-amber-600 hover:bg-amber-700 rounded-xl h-11">
                          <Link href={`/productos/${product.id}`}>Ver detalles</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 rounded-xl border-amber-200 hover:bg-amber-50"
                          onClick={() => {
                            setQuickViewProduct(product)
                            setQuickViewQty(1)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <Filter className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No se encontraron productos</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  No hay productos que coincidan con los filtros seleccionados. Intenta ajustar tus criterios de
                  búsqueda.
                </p>
                <Button onClick={clearAllFilters} className="bg-amber-600 hover:bg-amber-700 rounded-xl h-12 px-8">
                  Ver todos los productos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
