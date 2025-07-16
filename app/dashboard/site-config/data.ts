import {
  Settings,
  Palette,
  Globe,
  Mail,
  Phone,
  Search,
  Type,
  Hash,
  Link,
  ToggleRightIcon as Toggle,
  ImageIcon,
} from "lucide-react"

// Tipos de configuración soportados
export type ConfigType = "text" | "textarea" | "number" | "boolean" | "color" | "url" | "email" | "image"

export interface ConfigSetting {
  key: string
  displayName: string
  description?: string
  type: ConfigType
  category: string
  placeholder?: string
  required?: boolean
  isActive?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface CategoryConfig {
  label: string
  icon: any
  description: string
  isActive: boolean
}

// Configuraciones organizadas por categorías
export const SITE_SETTINGS: ConfigSetting[] = [
  // Configuración General
  {
    key: "site_title",
    displayName: "Título del Sitio",
    description: "Nombre principal que aparece en el navegador",
    type: "text",
    category: "general",
    placeholder: "Mi Sitio Web",
    required: true,
    isActive: true,
  },
  {
    key: "site_description",
    displayName: "Descripción del Sitio",
    description: "Descripción breve para SEO y redes sociales",
    type: "textarea",
    category: "general",
    placeholder: "Descripción de tu sitio web...",
    isActive: true,
  },
  {
    key: "site_url",
    displayName: "URL del Sitio",
    description: "URL principal del sitio web",
    type: "url",
    category: "general",
    placeholder: "https://misitio.com",
    isActive: true,
  },
  {
    key: "maintenance_mode",
    displayName: "Modo Mantenimiento",
    description: "Activar para mostrar página de mantenimiento",
    type: "boolean",
    category: "general",
    isActive: true,
  },

  // Imágenes y Branding
  {
    key: "hero_image",
    displayName: "Imagen del Hero",
    description: "Imagen principal de la página de inicio",
    type: "image",
    category: "branding",
    isActive: true,
  },
  {
    key: "our_philosophy_image",
    displayName: "Imagen de Nuestra Filosofía",
    description: "Imagen para la sección de filosofía",
    type: "image",
    category: "branding",
    isActive: true,
  },

  // Colores y Tema
  {
    key: "primary_color",
    displayName: "Color Primario",
    description: "Color principal del tema",
    type: "color",
    category: "theme",
    isActive: true,
  },
  {
    key: "secondary_color",
    displayName: "Color Secundario",
    description: "Color secundario del tema",
    type: "color",
    category: "theme",
    isActive: true,
  },
  {
    key: "accent_color",
    displayName: "Color de Acento",
    description: "Color para elementos destacados",
    type: "color",
    category: "theme",
    isActive: true,
  },

  // Información de Contacto
  {
    key: "contact_email",
    displayName: "Email de Contacto",
    description: "Email principal para contacto",
    type: "email",
    category: "contact",
    placeholder: "contacto@misitio.com",
    isActive: true,
  },
  {
    key: "contact_phone",
    displayName: "Teléfono de Contacto",
    description: "Número de teléfono principal",
    type: "text",
    category: "contact",
    placeholder: "+52 55 1234 5678",
    isActive: true,
  },
  {
    key: "contact_address",
    displayName: "Dirección",
    description: "Dirección física del negocio",
    type: "textarea",
    category: "contact",
    placeholder: "Calle, Ciudad, Estado, CP",
    isActive: true,
  },

  // Redes Sociales
  {
    key: "facebook_url",
    displayName: "Facebook",
    description: "URL de la página de Facebook",
    type: "url",
    category: "social",
    placeholder: "https://facebook.com/mipagina",
    isActive: true,
  },
  {
    key: "twitter_url",
    displayName: "Twitter/X",
    description: "URL del perfil de Twitter",
    type: "url",
    category: "social",
    placeholder: "https://twitter.com/miperfil",
    isActive: true,
  },
  {
    key: "instagram_url",
    displayName: "Instagram",
    description: "URL del perfil de Instagram",
    type: "url",
    category: "social",
    placeholder: "https://instagram.com/miperfil",
    isActive: true,
  },

  // SEO y Analytics
  {
    key: "google_analytics_id",
    displayName: "Google Analytics ID",
    description: "ID de seguimiento de Google Analytics",
    type: "text",
    category: "seo",
    placeholder: "GA-XXXXXXXXX-X",
    isActive: true,
  },
  {
    key: "meta_keywords",
    displayName: "Palabras Clave Meta",
    description: "Palabras clave para SEO (separadas por comas)",
    type: "textarea",
    category: "seo",
    placeholder: "palabra1, palabra2, palabra3",
    isActive: true,
  },
]

// Categorías con sus iconos y descripciones
export const CATEGORIES: Record<string, CategoryConfig> = {
  general: {
    label: "General",
    icon: Settings,
    description: "Configuración básica del sitio",
    isActive: false, // Desactivada
  },
  branding: {
    label: "Marca e Imágenes",
    icon: ImageIcon,
    description: "Logos, imágenes y elementos visuales",
    isActive: true, // Solo esta activa
  },
  theme: {
    label: "Tema y Colores",
    icon: Palette,
    description: "Personalización visual y colores",
    isActive: false, // Desactivada
  },
  contact: {
    label: "Contacto",
    icon: Phone,
    description: "Información de contacto y ubicación",
    isActive: false, // Desactivada
  },
  social: {
    label: "Redes Sociales",
    icon: Globe,
    description: "Enlaces a redes sociales",
    isActive: false, // Desactivada
  },
  seo: {
    label: "SEO y Analytics",
    icon: Search,
    description: "Optimización y seguimiento",
    isActive: false, // Desactivada
  },
}
