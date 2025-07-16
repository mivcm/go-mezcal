import api from "@/lib/axios";
import { Product } from "@/types";
import { create } from "zustand";

interface ProductStore {
    products: Product[];
    getFeaturedProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductStore>((set) => ({
    products: [],
    getFeaturedProducts: async () => {
        try {
            const { data } = await api('/api/v1/products/featured')
            set({ products: data })
        } catch (error) {
            console.error('Error fetching featured products:', error);
        }
    },
}))