"use client";
import { PayPalButtons, PayPalScriptProvider} from '@paypal/react-paypal-js'
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { useCartStore } from "@/hooks/use-cart-store";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/axios';
import { useRouter } from "next/navigation";

// PayPal Configuration
const PAYPAL_OPTIONS = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  "enable-funding": "venmo",
  "disable-funding": "",
  "buyer-country": "MX",
  currency: "MXN",
  "data-page-type": "product-details",
  components: "buttons",
  "data-sdk-integration-source": "developer-studio",
};

// Loading Component
const PaymentLoading = () => (
  <div className="space-y-4">
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">Procesando pago...</h3>
      <p className="text-sm text-muted-foreground">Por favor, no cierres esta ventana</p>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
    </div>
  </div>
);

// PayPal Button Component
const PayPalPaymentButton = ({ 
  createOrder, 
  onApprove 
}: { 
  createOrder: () => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
}) => (
  <PayPalScriptProvider options={PAYPAL_OPTIONS}>
    <PayPalButtons 
      style={{
        shape: 'pill',
        layout: 'vertical',
        color: 'gold',
        label: 'paypal'
      }}
      createOrder={createOrder}
      onApprove={onApprove}
    />
  </PayPalScriptProvider>
);

// Cart Item Component
const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}: { 
  item: any;
  onUpdateQuantity: (item: any, change: number) => void;
  onRemove: (id: string) => void;
}) => (
  <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
          onClick={() => onUpdateQuantity(item, -1)}
          disabled={item.quantity <= 1}
        >
          -
        </Button>
        <span className="px-2 font-semibold text-lg">{item.quantity}</span>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          onClick={() => onUpdateQuantity(item, 1)}
          disabled={item.quantity >= (item.stock ?? 99)}
        >
          +
        </Button>
        <span className="text-xs text-muted-foreground ml-2">
          Stock: {item.stock ?? "∞"}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 dark:text-red-400 flex items-center mt-2 text-sm"
      >
        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
      </button>
    </div>
  </div>
);

// Order Summary Component
const OrderSummary = ({ 
  items, 
  onCheckout, 
  isProcessingPayment,
  onApprove
}: { 
  items: any[];
  onCheckout: () => Promise<string>;
  isProcessingPayment: boolean;
  onApprove: (data: any, actions: any) => Promise<void>;
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="lg:w-80">
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Resumen del Pedido
        </h2>

        <div className="space-y-4 mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-stone-600 dark:text-stone-300">
              Productos
            </h3>
            <ul className="divide-y dark:divide-stone-700">
              {items.map((item) => (
                <li key={item.id} className="py-2 flex justify-between items-center text-sm">
                  <span className="flex-1 truncate">
                    {item.name}{" "}
                    <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                  </span>
                  <span className="mx-2 text-xs text-muted-foreground">${item.price} c/u</span>
                  <span className="font-medium">${item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-600 dark:text-stone-300">Subtotal</span>
            <span className="font-medium dark:text-white">${total} MXN</span>
          </div>
          
          <div className="border-t dark:border-stone-700 pt-4 flex justify-between">
            <span className="font-bold dark:text-white">Total</span>
            <span className="font-bold dark:text-white">${total} MXN</span>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center">
              <CreditCard className="mr-2 h-5 w-5" /> Proceder al Pago
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
            <div className="p-6">
              {isProcessingPayment ? (
                <PaymentLoading />
              ) : (
                                 <PayPalPaymentButton 
                   createOrder={onCheckout}
                   onApprove={onApprove}
                 />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => (
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
        <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
          <Link href="/productos">Explorar Productos</Link>
        </Button>
      </div>
    </div>
  </div>
);

// Main Cart Page Component
export default function CartPage() {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { token, user } = useUserAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const {
    items,
    status,
    fetchCart,
    addItem,
    removeItem,
    clear,
    abandonCart,
    convertToOrder,
    cartId,
  } = useCartStore();

  // Sync cart on load if token exists
  useEffect(() => {
    if (token) fetchCart();
  }, [token, fetchCart]);

  // Mark cart as abandoned when component unmounts
  useEffect(() => {
    const handleAbandon = () => {
      if (items.length > 0 && status === "active" && cartId) {
        abandonCart(cartId);
      }
    };
    return () => handleAbandon();
  }, []);

  // Create PayPal order
  const createPayPalOrder = async () => {
    if (!token) {
      throw new Error("Debes iniciar sesión para comprar.");
    }
    
    try {
      const data = await convertToOrder();
      if (data.id) {
        return data.id;
      } else {
        const errorDetails = data?.details?.[0];
        const errorMessage = errorDetails?.message || "No se pudo crear la orden";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.log('err', err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "No se pudo crear la orden",
        variant: "destructive",
      });
      throw new Error(err.message || "No se pudo crear la orden");
    }
  };

  // Handle PayPal payment approval
  const handlePayPalApproval = async (data: any, actions: any) => {
    setIsProcessingPayment(true);
    try {
      const { data: orderData } = await api.post(`/api/v1/orders/paypal/${data.orderID}/capture`);
      const errorDetail = orderData.details?.[0];
      
      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        setIsProcessingPayment(false);
        return actions.restart();
      } else if (errorDetail) {
        setIsProcessingPayment(false);
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        const transaction = orderData.purchase_units[0].payments.captures[0];
        toast({
          title: "Pago exitoso",
          description: `Transaction ${transaction.status}: ${transaction.id}`,
          variant: "default",
        });
        router.push(`/success?orderId=${data.orderID}`);
      }
    } catch (error: any) {
      console.log('error', error);
      setIsProcessingPayment(false);
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Error al procesar el pago",
        variant: "destructive",
      });
    }
  };

  // Handle quantity updates
  const handleQuantityUpdate = (item: any, change: number) => {
    if (change > 0) {
      const maxStock = item.stock ?? 99;
      if (item.quantity < maxStock) {
        addItem({ ...item, quantity: change });
      } else {
        toast({
          title: "Stock insuficiente",
          description: `Solo hay ${maxStock} unidades disponibles de este producto.`,
          variant: "destructive",
        });
      }
    } else {
      addItem({ ...item, quantity: change });
    }
  };

  if (items.length === 0) {
    return <EmptyCart />;
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
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b dark:border-stone-700">
                <h2 className="text-xl font-semibold dark:text-white">
                  Productos ({items.length})
                </h2>
              </div>

              <div className="divide-y dark:divide-stone-700">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleQuantityUpdate}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              <div className="p-6 border-t dark:border-stone-700">
                <Link href="/productos" className="text-amber-600 dark:text-amber-500 flex items-center hover:underline">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Continuar comprando
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <OrderSummary 
            items={items}
            onCheckout={createPayPalOrder}
            isProcessingPayment={isProcessingPayment}
            onApprove={handlePayPalApproval}
          />
        </div>
      </div>
    </div>
  );
}
