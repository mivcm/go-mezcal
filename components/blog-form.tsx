"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { BlogPost } from "@/types"
import { useBlogStore } from "@/hooks/use-blog-store"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, ImageIcon, X, Loader2, Star, Tag, FileText, Link2 } from "lucide-react"

interface BlogFormProps {
  initialData?: Partial<BlogPost>
  onSuccess?: () => void
  isEdit?: boolean
}

export function BlogForm({ initialData = {}, onSuccess, isEdit = false }: BlogFormProps) {
  const { createBlog, updateBlog, loading, error } = useBlogStore()
  const { toast } = useToast()

  const [form, setForm] = useState({
    title: initialData.title || "",
    excerpt: initialData.excerpt || "",
    content: initialData.content || "",
    category: initialData.category || "",
    featured: initialData.featured || false,
    tags: initialData.tags?.join(", ") || "",
  })

  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initialData.cover_image || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, featured: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setCoverImage(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setCoverImage(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("excerpt", form.excerpt)
    formData.append("content", form.content)
    formData.append("category", form.category)
    formData.append("featured", String(form.featured))

    form.tags
      .split(",")
      .map((t) => t.trim())
      .forEach((tag) => formData.append("tags[]", tag))

    if (coverImage) formData.append("cover_image", coverImage)

    let result
    if (isEdit && initialData.id) {
      result = await updateBlog(initialData.id, formData)
    } else {
      result = await createBlog(formData)
    }

    if (result) {
      toast({
        title: isEdit ? "Blog actualizado" : "Blog creado",
        description: "La operación fue exitosa.",
        variant: "default",
      })
      onSuccess?.()
    } else if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }

  const tagList = form.tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isEdit ? "Editar Blog Post" : "Crear Nuevo Blog Post"}
          </CardTitle>
          <CardDescription>
            {isEdit ? "Actualiza la información de tu blog post" : "Completa los campos para crear un nuevo blog post"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información básica */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Información básica
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Ingresa el título del blog post"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extracto *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="Breve descripción del contenido..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Escribe el contenido completo del blog post..."
                  rows={12}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Categorización */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                Categorización
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Input
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="ej: Tecnología, Diseño, Marketing"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="ej: añejo, joven, mezcal, etc.)"
                  />
                  {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tagList.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={form.featured} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="featured" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Marcar como destacado
                </Label>
              </div>
            </div>

            <Separator />

            {/* Imagen de portada */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                Imagen de portada
              </div>

              <div className="space-y-4">
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />

                {!preview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  >
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Haz clic para subir una imagen de portada</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Vista previa"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : isEdit ? (
                  "Actualizar Post"
                ) : (
                  "Crear Post"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
