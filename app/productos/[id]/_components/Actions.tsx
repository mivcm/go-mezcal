"use client";
import { useState } from "react";
import { QuantityInput } from "@/components/quantity-input";
import { Button } from "@/components/ui/button";
import { Share2, Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
type Props = {
  product: Product;
};

const Actions = (props: Props) => {
  const { product } = props;
  const { token } = useUserAuthStore();
  const { addItem } = useCartStore();
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
          max={product.stock}
          onChange={setQuantity}
          disabled={product.stock === 0}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          className="flex-1 md:flex-none bg-amber-600 hover:bg-amber-700"
          size="lg"
          onClick={async () => {
            if (!token) {
              toast({ title: "Debes iniciar sesión para comprar." });
              return;
            }
            try {
              await addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity,
                stock: product.stock,
              });
              toast({
                title: "Producto añadido",
                description: `${product.name} se ha añadido a tu carrito.`,
              });
            } catch (err: any) {
              toast({
                title: "Error",
                description: err.message || "No se pudo añadir al carrito",
                variant: "destructive",
              });
            }
          }}
          disabled={product.stock === 0 || quantity > product.stock}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {product.stock === 0 ? "Agotado" : "Añadir al carrito"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 md:flex-none"
          onClick={async () => {
            if (!token) {
              toast({ title: "Debes iniciar sesión para comprar." });
              return;
            }
            try {
              await addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity,
                stock: product.stock,
              });
              // Checkout directo
              const data = await useCartStore.getState().convertToOrder();
              window.location.href = data.checkout_url;
            } catch (err: any) {
              toast({
                title: "Error",
                description: err.message || "No se pudo procesar el pago",
                variant: "destructive",
              });
            }
          }}
          disabled={product.stock === 0 || quantity > product.stock}
        >
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
