"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { useCartStore } from "@/hooks/use-cart-store";

export default function CartPage() {
  const { token, user } = useUserAuthStore();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const { items, status, fetchCart, addItem, removeItem, clear, abandonCart, convertToOrder } = useCartStore();

  // Sincronizar carrito al cargar si hay token
  useEffect(() => {
    if (token) fetchCart();
  }, [token, fetchCart]);

  const handleCheckout = async () => {
    if (!token) {
      toast({ title: "Debes iniciar sesión para comprar." });
      return;
    }
    try {
      const data = await convertToOrder();
      clear();
      window.location.href = data.checkout_url;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo procesar el pago",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 bg-stone-50 dark:bg-stone-900 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-md p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-stone-400 dark:text-stone-500" />
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
              Tu carrito está vacío
            </h1>
            <p className="text-stone-600 dark:text-stone-300 mb-8">
              Parece que aún no has añadido ningún producto a tu carrito.
            </p>
            <Button
              asChild
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Link href="/productos">Explorar Productos</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-stone-50 dark:bg-stone-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Tu Carrito</h1>
        <div className="mb-8 flex gap-4">
          {token && user && (
            <Link href="/orders">
              <Button variant="outline" className="text-amber-600 border-amber-600">
                Ver mis órdenes
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1">
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b dark:border-stone-700">
                <h2 className="text-xl font-semibold dark:text-white">
                  Productos ({items.length})
                </h2>
              </div>

              <div className="divide-y dark:divide-stone-700">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white">{item.name}</h3>
                      <p className="text-amber-600 dark:text-amber-500 font-bold">
                        ${item.price} MXN
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => item.quantity > 1 && addItem({ ...item, quantity: -1 })}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="px-2 font-semibold text-lg">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => {
                            const maxStock = item.stock ?? 99;
                            if (item.quantity < maxStock) {
                              addItem({ ...item, quantity: 1 });
                            } else {
                              toast({
                                title: "Stock insuficiente",
                                description: `Solo hay ${maxStock} unidades disponibles de este producto.`,
                                variant: "destructive",
                              });
                            }
                          }}
                          disabled={item.quantity >= (item.stock ?? 99)}
                        >
                          +
                        </Button>
                        <span className="text-xs text-muted-foreground ml-2">Stock: {item.stock ?? '∞'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 dark:text-red-400 flex items-center mt-2 text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t dark:border-stone-700">
                <Link
                  href="/productos"
                  className="text-amber-600 dark:text-amber-500 flex items-center hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Continuar comprando
                </Link>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:w-80">
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {/* Desglose de productos */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-stone-600 dark:text-stone-300">Productos</h3>
                  <ul className="divide-y dark:divide-stone-700">
                    {items.map((item) => (
                      <li key={item.id} className="py-2 flex justify-between items-center text-sm">
                        <span className="flex-1 truncate">{item.name} <span className="text-xs text-muted-foreground">x{item.quantity}</span></span>
                        <span className="mx-2 text-xs text-muted-foreground">${item.price} c/u</span>
                        <span className="font-medium">${item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Subtotal y total */}
                <div className="flex justify-between">
                  <span className="text-stone-600 dark:text-stone-300">
                    Subtotal
                  </span>
                  <span className="font-medium dark:text-white">
                    ${items.reduce((total, item) => total + item.price * item.quantity, 0)} MXN
                  </span>
                </div>
                <div className="border-t dark:border-stone-700 pt-4 flex justify-between">
                  <span className="font-bold dark:text-white">Total</span>
                  <span className="font-bold dark:text-white">
                    ${items.reduce((total, item) => total + item.price * item.quantity, 0)} MXN
                  </span>
                </div>
              </div>

              {/* <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Código de descuento"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="dark:bg-stone-700 dark:border-stone-600"
                  />
                  <Button
                    variant="outline"
                    className="dark:border-stone-600 dark:text-white"
                  >
                    Aplicar
                  </Button>
                </div>
              </div> */}

              <Button
                onClick={handleCheckout}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center"
              >
                <CreditCard className="mr-2 h-5 w-5" /> Proceder al Pago
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
