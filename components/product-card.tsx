import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge-special";
import { cn, formatPrice } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

// Función para renderizar las estrellas según el rating
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  // Estrellas llenas
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    );
  }
  
  // Estrella media si es necesario
  if (hasHalfStar) {
    stars.push(
      <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    );
  }
  
  // Estrellas vacías para completar 5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
    );
  }
  
  return stars;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link href={`/productos/${product.id}`} className={cn("group relative", className)}>
      <div className="overflow-hidden rounded-lg bg-stone-900 dark:bg-card aspect-[3/4]">
        <div className="h-full w-full relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <p className="text-sm text-white/90 line-clamp-2">
                {product.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        {product.new && (
          <Badge variant="new">Nuevo</Badge>
        )}
        {product.featured && (
          <Badge variant="featured">Destacado</Badge>
        )}
        {product.category && (
          <Badge variant={product.category as "joven" | "reposado" | "anejo" | "ancestral"}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Badge>
        )}
      </div>
      <div className="mt-3 flex flex-col">
        <h3 className="text-lg font-semibold">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-medium text-lg text-amber-600 dark:text-amber-500">
            {formatPrice(product.price)}
          </span>
          {product.stock === 0 && (
            <span className="ml-2 text-xs font-bold text-red-600 bg-red-100 rounded px-2 py-1">Agotado</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-muted-foreground">({product.rating})</span>
        </div>
      </div>
    </Link>
  );
}