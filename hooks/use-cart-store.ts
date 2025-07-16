import { create } from "zustand";
import api from "@/lib/axios";
import { Product } from "@/types";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
};

export type CartState = {
  items: CartItem[];
  status: "active" | "abandoned" | "converted";
  cartId?: string;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  abandonCart: (cartId?: string) => Promise<void>;
  convertToOrder: () => Promise<any>;
  clear: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  status: "active",
  cartId: undefined,
  async fetchCart() {
    const { data } = await api.get("/api/v1/cart");
    const items = Array.isArray(data.items)
      ? data.items.map((item: any) => ({
          id: item.product.id.toString(),
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.image,
          quantity: item.quantity,
          stock: item.product.stock,
        }))
      : [];
    set({ items, status: data.status, cartId: data.id?.toString() });
  },
  async addItem(item) {
    await api.post(
      "/api/v1/cart/add_item",
      { product_id: item.id, quantity: item.quantity }
    );
    await get().fetchCart();
  },
  async removeItem(productId) {
    await api.delete("/api/v1/cart/remove_item", {
      data: { product_id: productId },
    });
    await get().fetchCart();
  },
  async abandonCart(cartId?: string) {
    if (!cartId) return;
    await api.post(
      `/api/v1/cart/abandon`,
      { cart_id: cartId }
    );
    set({ status: "abandoned" });
  },
  async convertToOrder() {
    const { data } = await api.post(
      "/api/v1/cart/convert_to_order",
      {
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/carrito`,
      }
    );
    set({ status: "converted" });
    return data;
  },
  clear() {
    set({ items: [], status: "active" });
  },
}));
