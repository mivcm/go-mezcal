import { SITE_SETTINGS, CATEGORIES } from "./data"

export function filterSettings(searchTerm: string, activeTab: string) {
    return SITE_SETTINGS.filter((setting) => {
    const matchesSearch =
      setting.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === "all" || setting.category === activeTab
    return matchesSearch && matchesCategory
  })
}

export function getActiveCategories() {
    return Object.entries(CATEGORIES).filter(([key, category]) => category.isActive)
}