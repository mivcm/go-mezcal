"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, ImageIcon } from "lucide-react"
import { ConfigSetting, ConfigType } from "../data"

interface RenderSettingsInputProps {
  setting: ConfigSetting
  settings: Record<string, any>
  handleSettingChange: (key: string, value: any) => void
  currentImages: Record<string, string | null>
  selectedFiles: Record<string, File | null>
  previewUrls: Record<string, string | null>
  isUploading: boolean
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>
  clearSelection: (settingKey: string) => void
  handleUpload: (settingKey: string) => void
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, settingKey: string) => void
}

const getTypeIcon = (type: ConfigType) => {
  switch (type) {
    case "text":
    case "textarea":
      return "Type"
    case "number":
      return "Hash"
    case "boolean":
      return "Toggle"
    case "color":
      return "Palette"
    case "url":
      return "Link"
    case "email":
      return "Mail"
    case "image":
      return ImageIcon
    default:
      return "Settings"
  }
}

export function renderSettingInput(
  setting: ConfigSetting,
  settings: Record<string, any>,
  handleSettingChange: (key: string, value: any) => void,
  currentImages: Record<string, string | null>,
  selectedFiles: Record<string, File | null>,
  previewUrls: Record<string, string | null>,
  isUploading: boolean,
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>,
  clearSelection: (settingKey: string) => void,
  handleUpload: (settingKey: string) => void,
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, settingKey: string) => void
) {
    const TypeIcon = getTypeIcon(setting.type)

    switch (setting.type) {
        case "text":
        case "url":
        case "email":
            return (
                <div className="space-y-2">
                    <Label htmlFor={setting.key} className="flex items-center gap-2">
            <span className="h-4 w-4" />
                        {setting.displayName}
                        {setting.required && (
                            <Badge variant="destructive" className="text-xs">
                                Requerido
                            </Badge>
                        )}
            {setting.isActive && (
              <Badge variant="default" className="text-xs">
                Activo
              </Badge>
            )}
                    </Label>
                    <Input
                        id={setting.key}
                        type={setting.type === "email" ? "email" : setting.type === "url" ? "url" : "text"}
                        placeholder={setting.placeholder}
                        value={settings[setting.key] || ""}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        required={setting.required}
                    />
                    {setting.description && <p className="text-sm text-muted-foreground">{setting.description}</p>}
                </div>
            )

        case "textarea":
            return (
                <div className="space-y-2">
                    <Label htmlFor={setting.key} className="flex items-center gap-2">
            <span className="h-4 w-4" />
                        {setting.displayName}
                        {setting.required && (
                            <Badge variant="destructive" className="text-xs">
                                Requerido
                            </Badge>
                        )}
            {setting.isActive && (
              <Badge variant="default" className="text-xs">
                Activo
              </Badge>
            )}
                    </Label>
                    <Textarea
                        id={setting.key}
                        placeholder={setting.placeholder}
                        value={settings[setting.key] || ""}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        rows={3}
                        required={setting.required}
                    />
                    {setting.description && <p className="text-sm text-muted-foreground">{setting.description}</p>}
                </div>
            )

        case "number":
            return (
                <div className="space-y-2">
                    <Label htmlFor={setting.key} className="flex items-center gap-2">
            <span className="h-4 w-4" />
                        {setting.displayName}
                        {setting.required && (
                            <Badge variant="destructive" className="text-xs">
                                Requerido
                            </Badge>
                        )}
            {setting.isActive && (
              <Badge variant="default" className="text-xs">
                Activo
              </Badge>
            )}
                    </Label>
                    <Input
                        id={setting.key}
                        type="number"
                        placeholder={setting.placeholder}
                        value={settings[setting.key] || ""}
                        onChange={(e) => handleSettingChange(setting.key, Number(e.target.value))}
                        min={setting.validation?.min}
                        max={setting.validation?.max}
                        required={setting.required}
                    />
                    {setting.description && <p className="text-sm text-muted-foreground">{setting.description}</p>}
                </div>
            )

        case "boolean":
            return (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor={setting.key} className="flex items-center gap-2">
              <span className="h-4 w-4" />
                            {setting.displayName}
              {setting.isActive && (
                <Badge variant="default" className="text-xs">
                  Activo
                </Badge>
              )}
                        </Label>
                        <Switch
                            id={setting.key}
                            checked={settings[setting.key] || false}
                            onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                        />
                    </div>
                    {setting.description && <p className="text-sm text-muted-foreground">{setting.description}</p>}
                </div>
            )

        case "color":
            return (
                <div className="space-y-2">
                    <Label htmlFor={setting.key} className="flex items-center gap-2">
            <span className="h-4 w-4" />
                        {setting.displayName}
            {setting.isActive && (
              <Badge variant="default" className="text-xs">
                Activo
              </Badge>
            )}
                    </Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id={setting.key}
                            type="color"
                            value={settings[setting.key] || "#000000"}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                            type="text"
                            placeholder="#000000"
                            value={settings[setting.key] || ""}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            className="flex-1"
                        />
                    </div>
                    {setting.description && <p className="text-sm text-muted-foreground">{setting.description}</p>}
                </div>
            )

        case "image":
            const currentImage = currentImages[setting.key]
            const selectedFile = selectedFiles[setting.key]
            const previewUrl = previewUrls[setting.key]

            return (
                <div className="space-y-4">
                    <Label className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
                        {setting.displayName}
                        {setting.isActive && (
                            <Badge variant="default" className="text-xs">
                                Activo
                            </Badge>
                        )}
                    </Label>

                    {/* Imagen actual */}
                    {currentImage && (
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Imagen actual:</Label>
                            <div className="relative aspect-video rounded-lg overflow-hidden border max-w-md">
                                <img
                                    src={currentImage || "/placeholder.svg"}
                                    alt={setting.displayName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Preview de nueva imagen */}
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Nueva imagen (preview):</Label>
                            <div className="relative aspect-video rounded-lg overflow-hidden border max-w-md">
                                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}

                    {/* Controles */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRefs.current[setting.key]?.click()}
                            disabled={isUploading}
                            size="sm"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Seleccionar imagen
                        </Button>

                        {selectedFile && (
                            <>
                                <Button type="button" onClick={() => handleUpload(setting.key)} disabled={isUploading} size="sm">
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                                            Subiendo...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Subir imagen
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => clearSelection(setting.key)}
                                    disabled={isUploading}
                                    size="sm"
                                >
                                    Cancelar
                                </Button>
                            </>
                        )}
                    </div>

                    <input
                        ref={(el) => {
                            fileInputRefs.current[setting.key] = el
                        }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, setting.key)}
                        className="hidden"
                    />

                    {setting.description && <p className="text-sm text-muted-foreground">{setting.description}</p>}
                </div>
            )

        default:
      return (
        <div className="text-muted-foreground">
          Tipo de configuración no soportado: {setting.type}
        </div>
      )
    }
}