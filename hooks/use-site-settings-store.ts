import { create } from "zustand";
import api from "@/lib/axios";

interface SiteSettingsState {
  // Estado
  currentHeroImage: string | null;
  selectedFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  error: string | null;

  // Acciones
  setSelectedFile: (file: File | null) => void;
  setPreviewUrl: (url: string | null) => void;
  setCurrentHeroImage: (url: string | null) => void;
  clearSelection: () => void;
  uploadHeroImage: () => Promise<void>;
  validateFile: (file: File) => { isValid: boolean; error?: string };
}

export const useSiteSettingsStore = create<SiteSettingsState>((set, get) => ({
  // Estado inicial
  currentHeroImage: null,
  selectedFile: null,
  previewUrl: null,
  isUploading: false,
  error: null,

  // Acciones
  setSelectedFile: (file: File | null) => {
    set({ selectedFile: file });
  },

  setPreviewUrl: (url: string | null) => {
    set({ previewUrl: url });
  },

  setCurrentHeroImage: (url: string | null) => {
    set({ currentHeroImage: url });
  },

  clearSelection: () => {
    set({ 
      selectedFile: null, 
      previewUrl: null,
      error: null 
    });
  },

  validateFile: (file: File) => {
    // Validar tipo de archivo - solo PNG, JPG, JPEG y WebP
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: "Solo se aceptan archivos PNG, JPG, JPEG y WebP" 
      };
    }

    return { isValid: true };
  },

  uploadHeroImage: async () => {
    const { selectedFile } = get();
    
    if (!selectedFile) {
      set({ error: "Por favor selecciona una imagen primero" });
      return;
    }

    set({ isUploading: true, error: null });

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await api.patch('/api/v1/admin/site_settings/update_hero_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Actualizar la imagen actual
      set({ 
        currentHeroImage: response.data.url,
        selectedFile: null,
        previewUrl: null,
        error: null
      });

      return response.data;

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al subir la imagen";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isUploading: false });
    }
  },
})); 