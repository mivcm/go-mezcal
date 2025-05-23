"use client";
import { useState } from "react";
import { QuantityInput } from "@/components/quantity-input";
import { Button } from "@/components/ui/button";
import { Share2, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
type Props = {
  product: Product;
};

const Actions = (props: Props) => {
  const { product } = props;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <span className="font-medium">Cantidad:</span>
        <QuantityInput
          initialValue={quantity}
          min={1}
          max={10}
          onChange={setQuantity}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          className="flex-1 md:flex-none bg-amber-600 hover:bg-amber-700"
          size="lg"
          onClick={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              quantity,
            });
            toast({
              title: "Producto añadido",
              description: `${product.name} se ha añadido a tu carrito.`,
            });
          }}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Añadir al carrito
        </Button>
        <Button variant="secondary" size="lg" className="flex-1 md:flex-none">
          Comprar ahora
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={isWishlisted ? "text-rose-500" : ""}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
          <span className="sr-only">Añadir a favoritos</span>
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Compartir</span>
        </Button>
      </div>
    </>
  );
};

export default Actions;
