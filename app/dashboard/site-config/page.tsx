"use client"

import React from "react"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSiteSettingsStore } from "@/hooks/use-site-settings-store"
import { BackButton } from "@/components/ui/back-button"
import {
  AlertCircle,
  Settings,
  Search,
} from "lucide-react"
import { SITE_SETTINGS } from "./data"
import { renderSettingInput } from "./components/render-settings-input"
import { filterSettings, getActiveCategories } from "./utils"

export default function SiteConfigPage() {
  const { toast } = useToast()
  const {
    currentImages,
    selectedFiles,
    previewUrls,
    isUploading,
    error,
    setSelectedFile,
    setPreviewUrl,
    clearSelection,
    uploadImage,
    getImage,
    validateFile,
  } = useSiteSettingsStore()

  const [activeTab, setActiveTab] = useState("general")
  const [searchTerm, setSearchTerm] = useState("")
  const [settings, setSettings] = useState<Record<string, any>>({})
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // Cargar configuraciones al montar
  useEffect(() => {
    SITE_SETTINGS.forEach((setting) => {
      if (setting.type === "image") {
        getImage(setting.key)
      }
    })
  }, [getImage])

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, settingKey: string) => {
    const file = event.target.files?.[0]
    if (file) {
      const validation = validateFile(file)
      if (!validation.isValid) {
        toast({
          title: "Error",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      setSelectedFile(settingKey, file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(settingKey, e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async (settingKey: string) => {
    try {
      await uploadImage(settingKey)
      toast({
        title: "Éxito",
        description: "Imagen actualizada correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al subir la imagen",
        variant: "destructive",
      })
    }
  }

  const filteredSettings = filterSettings(searchTerm, activeTab)

  // Solo mostrar categorías activas
  const activeCategories = getActiveCategories()

  // Si no hay categoría activa seleccionada, seleccionar la primera activa
  useEffect(() => {
    if (activeCategories.length > 0 && !activeCategories.find(([key]) => key === activeTab)) {
      setActiveTab(activeCategories[0][0])
    }
  }, [activeCategories, activeTab])

  const settingsByCategory = activeCategories.map(([key, category]) => ({
    key,
    ...category,
    settings: filteredSettings.filter((setting) => setting.category === key),
  }))

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Configuración del Sitio</h1>
              <p className="text-muted-foreground">Gestiona la configuración general del sitio web</p>
              {activeCategories.length === 1 && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Solo mostrando: {activeCategories[0][1].label}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Búsqueda */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar configuraciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Tabs por categoría */}
        {activeCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No hay categorías activas</h3>
              <p className="text-sm">Activa al menos una categoría para ver las configuraciones.</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 lg:grid-cols-1">
              {activeCategories.map(([key, category]) => {
                const Icon = category.icon
                const count = SITE_SETTINGS.filter((s) => s.category === key).length
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {settingsByCategory.map((category) => (
              <TabsContent key={category.key} value={category.key} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className="h-5 w-5" />
                      {category.label}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {category.settings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No se encontraron configuraciones en esta categoría
                      </div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2">
                        {category.settings.map((setting) => (
                          <Card key={setting.key} className="p-4">
                            {renderSettingInput(setting, settings, handleSettingChange, currentImages, selectedFiles, previewUrls, isUploading, fileInputRefs, clearSelection, handleUpload, handleFileSelect)}
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Mensajes de estado */}
        {error && (
          <div className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}
