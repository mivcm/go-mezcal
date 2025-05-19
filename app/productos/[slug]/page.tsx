import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge-special";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGallery } from "@/components/product-gallery";
import { ProductList } from "@/components/product-list";
import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/data/products";
import { formatPrice } from "@/lib/utils";
import Actions from "./_components/Actions";

// Genera rutas estáticas para export estático
export async function generateStaticParams() {
  // Espera (sincrónico) a tener todos los productos en 'products'
  return products.map((product) => ({ slug: product.slug }));
}

// Componente de servidor que espera antes de renderizar
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Obtener el producto por slug
  const product = getProductBySlug(slug);
  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
        <p className="mb-8">El producto que estás buscando no existe.</p>
        <Button asChild>
          <Link href="/productos">Ver todos los productos</Link>
        </Button>
      </div>
    );
  }

  // Obtener productos relacionados
  const relatedProducts = getRelatedProducts(product.id);

  return (
    <div className="container py-12">
      {/* Navegación */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
          <Link
            href="/productos"
            className="flex items-center text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver a productos
          </Link>
        </Button>
      </div>

      {/* Detalles del producto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant={product.category as any}>
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}
            </Badge>
            {product.new && <Badge variant="new">Nuevo</Badge>}
            {product.featured && <Badge variant="featured">Destacado</Badge>}
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            {product.name}
          </h1>

          <div className="flex items-center mb-6">
            <div className="flex text-yellow-500 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "fill-none"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              ({product.reviews.length} reseñas)
            </span>
          </div>

          <div className="text-3xl font-bold text-amber-600 dark:text-amber-500 mb-6">
            {formatPrice(product.price)}
          </div>

          <p className="text-muted-foreground mb-8">
            {product.shortDescription}
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-center">
              <span className="w-32 font-medium">Origen:</span>
              <span>{product.origin}</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 font-medium">Alcohol:</span>
              <span>{product.abv}% vol.</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 font-medium">Volumen:</span>
              <span>{product.volume} ml</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 font-medium">Agave:</span>
              <span>{product.ingredients.join(", ")}</span>
            </div>
          </div>

          {/* Acciones */}
          <Actions product={product}/>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="descripcion">
          <TabsList className="w-full grid grid-cols-3 max-w-2xl mb-8">
            <TabsTrigger value="descripcion">Descripción</TabsTrigger>
            <TabsTrigger value="caracteristicas">Características</TabsTrigger>
            <TabsTrigger value="resenas">
              Reseñas ({product.reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="descripcion" className="pt-4">
            <div className="prose prose-amber dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="caracteristicas" className="pt-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Especificaciones</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between py-2 border-b">
                    <span className="font-medium">Categoría</span>
                    <span className="text-muted-foreground">
                      {product.category.charAt(0).toUpperCase() +
                        product.category.slice(1)}
                    </span>
                  </li>
                  <li className="flex justify-between py-2 border-b">
                    <span className="font-medium">Tipo de agave</span>
                    <span className="text-muted-foreground">
                      {product.ingredients.join(", ")}
                    </span>
                  </li>
                  <li className="flex justify-between py-2 border-b">
                    <span className="font-medium">Alcohol por volumen</span>
                    <span className="text-muted-foreground">
                      {product.abv}%
                    </span>
                  </li>
                  <li className="flex justify-between py-2 border-b">
                    <span className="font-medium">Volumen</span>
                    <span className="text-muted-foreground">
                      {product.volume} ml
                    </span>
                  </li>
                  <li className="flex justify-between py-2 border-b">
                    <span className="font-medium">Región</span>
                    <span className="text-muted-foreground">
                      {product.origin}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Notas de Sabor</h3>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Aroma</h4>
                    <p className="text-muted-foreground">
                      Notas ahumadas dominantes, con sutiles toques de frutas
                      tropicales y hierbas frescas.
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Sabor</h4>
                    <p className="text-muted-foreground">
                      Complejo y equilibrado, con capas de agave cocido,
                      cítricos, especias y minerales.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Final</h4>
                    <p className="text-muted-foreground">
                      Largo y persistente, con un agradable calor y retrogusto
                      herbal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="resenas" className="pt-4">
            <div className="space-y-8">
              <h3 className="text-xl font-bold mb-6">Reseñas de Clientes</h3>

              {product.reviews.length > 0 ? (
                <div className="space-y-8">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center mb-4">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                          {review.userImage ? (
                            <Image
                              src={review.userImage}
                              alt={review.userName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="bg-amber-200 dark:bg-amber-800 h-full w-full flex items-center justify-center text-amber-800 dark:text-amber-200 font-medium">
                              {review.userName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {review.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex text-yellow-500 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-current" : "fill-none"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Este producto aún no tiene reseñas. ¡Sé el primero en
                    compartir tu experiencia!
                  </p>
                </div>
              )}

              <div className="mt-8 pt-8 border-t">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Escribir una reseña
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8">
            También te podría interesar
          </h2>
          <ProductList products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
