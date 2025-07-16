import { create } from "zustand";
import api from "@/lib/axios";

interface SiteSettingsState {
  // Estado
  currentImages: Record<string, string | null>;
  selectedFiles: Record<string, File | null>;
  previewUrls: Record<string, string | null>;
  isUploading: boolean;
  error: string | null;
  isLoading: boolean;

  // Acciones
  setSelectedFile: (settingKey: string, file: File | null) => void;
  setPreviewUrl: (settingKey: string, url: string | null) => void;
  setCurrentImage: (settingKey: string, url: string | null) => void;
  clearSelection: (settingKey: string) => void;
  uploadImage: (settingKey: string) => Promise<void>;
  getImage: (settingKey: string) => Promise<void>;
  validateFile: (file: File) => { isValid: boolean; error?: string };
}

export const useSiteSettingsStore = create<SiteSettingsState>((set, get) => ({
  // Estado inicial
  currentImages: {},
  selectedFiles: {},
  previewUrls: {},
  isUploading: false,
  error: null,
  isLoading: false,
  // Acciones
  setSelectedFile: (settingKey: string, file: File | null) => {
    set((state) => ({
      selectedFiles: {
        ...state.selectedFiles,
        [settingKey]: file
      }
    }));
  },

  setPreviewUrl: (settingKey: string, url: string | null) => {
    set((state) => ({
      previewUrls: {
        ...state.previewUrls,
        [settingKey]: url
      }
    }));
  },

  setCurrentImage: (settingKey: string, url: string | null) => {
    set((state) => ({
      currentImages: {
        ...state.currentImages,
        [settingKey]: url
      }
    }));
  },

  clearSelection: (settingKey: string) => {
    set((state) => ({ 
      selectedFiles: {
        ...state.selectedFiles,
        [settingKey]: null
      },
      previewUrls: {
        ...state.previewUrls,
        [settingKey]: null
      },
      error: null 
    }));
  },

  validateFile: (file: File) => {
    // Validar tipo de archivo - solo PNG, JPG, JPEG, GIF y WebP
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: "Solo se aceptan archivos PNG, JPG, JPEG, GIF y WebP" 
      };
    }

    return { isValid: true };
  },

  getImage: async (settingKey: string) => {
    try {
      set({ isLoading: true });
      const response = await api.get(`/api/v1/site_settings/image?setting_key=${settingKey}`);
      set((state) => ({
        currentImages: {
          ...state.currentImages,
          [settingKey]: response.data.url
        }
      }));
    } catch (error: any) {
      // Si no hay imagen, establecer como null
      set((state) => ({
        currentImages: {
          ...state.currentImages,
          [settingKey]: null
        }
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  uploadImage: async (settingKey: string) => {
    const { selectedFiles } = get();
    const selectedFile = selectedFiles[settingKey];
    
    if (!selectedFile) {
      set({ error: "Por favor selecciona una imagen primero" });
      return;
    }

    set({ isUploading: true, error: null });

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('setting_key', settingKey);

      const response = await api.patch('/api/v1/site_settings/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Actualizar la imagen actual y limpiar la selección
      set((state) => ({ 
        currentImages: {
          ...state.currentImages,
          [settingKey]: response.data.url
        },
        selectedFiles: {
          ...state.selectedFiles,
          [settingKey]: null
        },
        previewUrls: {
          ...state.previewUrls,
          [settingKey]: null
        },
        error: null
      }));

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