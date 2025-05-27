import { create } from "zustand";
import type { BlogPost } from "@/types";
import api from "@/lib/axios";

interface BlogStore {
  blogs: BlogPost[];
  loading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  getBlogBySlug: (slug: string) => Promise<BlogPost | null>;
  createBlog: (data: FormData) => Promise<BlogPost | null>;
  updateBlog: (id: string, data: FormData) => Promise<BlogPost | null>;
  deleteBlog: (id: string) => Promise<boolean>;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  loading: false,
  error: null,

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/api/v1/blog_posts");
      set({ blogs: res.data, loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Error al cargar blogs", loading: false });
    }
  },

  getBlogBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/api/v1/blog_posts/${slug}`);
      set({ loading: false });
      return res.data;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Error al cargar blog", loading: false });
      return null;
    }
  },

  createBlog: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/api/v1/blog_posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({ blogs: [res.data, ...state.blogs], loading: false }));
      return res.data;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Error al crear blog", loading: false });
      return null;
    }
  },

  updateBlog: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.patch(`/api/v1/blog_posts/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? res.data : b)),
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Error al actualizar blog", loading: false });
      return null;
    }
  },

  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/v1/blog_posts/${id}`);
      set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id), loading: false }));
      return true;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Error al eliminar blog", loading: false });
      return false;
    }
  },
}));
