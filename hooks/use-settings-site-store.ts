import api from "@/lib/axios";
import { create } from "zustand";

interface SettingsSiteStore {
    imageHeroUrl: string | null;
    getImageHeroUrl: () => Promise<void>
}

export const useSettingsSiteStore = create<SettingsSiteStore>((set, get) => ({
    imageHeroUrl: null,
    getImageHeroUrl: async () => {
        try {
            const { data } = await api('/api/v1/site_settings/show_hero_image');
            set({ imageHeroUrl: data.url })
        } catch (error) {
            console.log(error)
        }
    }
}))