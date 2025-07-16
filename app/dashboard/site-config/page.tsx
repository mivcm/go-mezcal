"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettingsStore } from "@/hooks/use-site-settings-store";
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

interface SiteConfigPageProps {}

export default function SiteConfigPage({}: SiteConfigPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const {
    currentHeroImage,
    selectedFile,
    previewUrl,
    isUploading,
    error,
    setSelectedFile,
    setPreviewUrl,
    setCurrentHeroImage,
    clearSelection,
    uploadHeroImage,
    validateFile
  } = useSiteSettingsStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar archivo usando el store
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast({
          title: "Error",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    try {
      await uploadHeroImage();
      
      toast({
        title: "Éxito",
        description: "Imagen actualizada correctamente",
      });
      
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al subir la imagen",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = () => {
    clearSelection();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configuración del Sitio
          </h1>
          <p className="text-muted-foreground">
            Gestiona la configuración general del sitio web
          </p>
        </div>

        <div className="grid gap-6">
          {/* Sección de Imagen del Hero */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imagen del principal
              </CardTitle>
              <CardDescription>
                Cambia la imagen principal que se muestra en la sección hero de la página de inicio.
                Formatos soportados: PNG, JPG, JPEG y WebP.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Imagen actual */}
              {currentHeroImage && (
                <div className="space-y-2">
                  <Label>Imagen actual:</Label>
                  <div className="relative w-full max-w-md">
                    <img
                      src={currentHeroImage}
                      alt="Hero actual"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}

              {/* Selector de archivo */}
              <div className="space-y-2">
                <Label htmlFor="hero-image">Seleccionar nueva imagen:</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="hero-image"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/webp"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="flex-1"
                  />
                  {selectedFile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* Preview de la nueva imagen */}
              {previewUrl && (
                <div className="space-y-2">
                  <Label>Vista previa:</Label>
                  <div className="relative w-full max-w-md">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}

              {/* Información del archivo seleccionado */}
              {selectedFile && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Archivo seleccionado:</span>
                    <span className="text-muted-foreground">{selectedFile.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}

              {/* Botón de subida */}
              <div className="flex gap-4">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Subir imagen
                    </>
                  )}
                </Button>
                
                {selectedFile && (
                  <Button
                    variant="outline"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                  >
                    Cancelar
                  </Button>
                )}
              </div>

              {/* Mensajes de ayuda */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Formatos aceptados: PNG, JPG, JPEG, WebP</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Resolución recomendada: 1920x1080 o superior</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
