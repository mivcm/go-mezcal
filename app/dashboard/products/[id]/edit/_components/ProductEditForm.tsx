"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";

const CATEGORIES = [
  { value: "joven", label: "Joven" },
  { value: "reposado", label: "Reposado" },
  { value: "anejo", label: "Añejo" },
  { value: "ancestral", label: "Ancestral" },
];

interface Props {
  productId: string;
}

export default function ProductEditForm({ productId }: Props) {
  const { token } = useUserAuthStore();
  const router = useRouter();

  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data: product, isLoading } = useSWR(productId ? `http://localhost:3001/api/v1/products/${productId}` : null, fetcher);

  const [form, setForm] = useState<any>(null);
  const [ingredientInput, setIngredientInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      
      setForm({
        name: product.name || "",
        slug: product.slug || "",
        category: product.category || "joven",
        price: product.price || "",
        stock: product.stock || "",
        images: [],
        description: product.description || "",
        short_description: product.short_description || "",
        abv: product.abv || "",
        volume: product.volume || "",
        origin: product.origin || "",
        ingredients: product.ingredients || [],
        featured: !!product.featured,
        new: !!product.new,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((f: any) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setForm((f: any) => ({ ...f, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((f: any) => ({ ...f, images: Array.from(e.target.files as FileList) }));
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !form.ingredients.includes(ingredientInput.trim())) {
      setForm((f: any) => ({ ...f, ingredients: [...f.ingredients, ingredientInput.trim()] }));
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setForm((f: any) => ({ ...f, ingredients: f.ingredients.filter((i: string) => i !== ing) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "images") {
          (value as File[]).forEach(img => formData.append("product[images][]", img));
        } else if (key === "ingredients") {
          (value as string[]).forEach(ing => formData.append("product[ingredients][]", ing));
        } else {
          formData.append(`product[${key}]`, value as string);
        }
      });
      await api.patch(`/api/v1/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
      router.push("/dashboard/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al editar producto");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !form) return <div className="container py-16 text-center">Cargando producto...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded shadow">
      {/* ... aquí va todo tu formulario ... */}
      {/* Reusa exactamente el código que ya tienes para renderizar inputs, selects, checkboxes, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>
        {/* Slug */}
        <div>
          <label className="block font-medium mb-1">Slug</label>
          <Input name="slug" value={form.slug} onChange={handleChange} required />
        </div>
        {/* Categoría */}
        <div>
          <label className="block font-medium mb-1">Categoría</label>
          <Select value={form.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Precio */}
        <div>
          <label className="block font-medium mb-1">Precio</label>
          <Input name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>
        {/* Stock */}
        <div>
          <label className="block font-medium mb-1">Stock</label>
          <Input name="stock" type="number" value={form.stock} onChange={handleChange} required />
        </div>
        {/* Imágenes */}
        <div>
          <label className="block font-medium mb-1">Imágenes (subir nuevas si deseas reemplazar)</label>
          <Input name="images" type="file" multiple onChange={handleImageChange} />
        </div>
        {/* Descripción corta */}
        <div>
          <label className="block font-medium mb-1">Descripción corta</label>
          <Input name="shortDescription" value={form.short_description} onChange={handleChange} required />
        </div>
        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Descripción</label>
          <Textarea name="description" value={form.description} onChange={handleChange} required />
        </div>
        {/* ABV */}
        <div>
          <label className="block font-medium mb-1">ABV (%)</label>
          <Input name="abv" type="number" value={form.abv} onChange={handleChange} required />
        </div>
        {/* Volumen */}
        <div>
          <label className="block font-medium mb-1">Volumen (ml)</label>
          <Input name="volume" type="number" value={form.volume} onChange={handleChange} required />
        </div>
        {/* Origen */}
        <div>
          <label className="block font-medium mb-1">Origen</label>
          <Input name="origin" value={form.origin} onChange={handleChange} required />
        </div>
        {/* Ingredientes */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Ingredientes</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={ingredientInput}
              onChange={e => setIngredientInput(e.target.value)}
              placeholder="Agregar ingrediente"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddIngredient();
                }
              }}
            />
            <Button type="button" onClick={handleAddIngredient}>Agregar</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.ingredients.map((ing: string) => (
              <span
                key={ing}
                className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100 px-2 py-1 rounded flex items-center gap-1"
              >
                {ing}
                <button type="button" onClick={() => handleRemoveIngredient(ing)} className="ml-1">✕</button>
              </span>
            ))}
          </div>
        </div>
        {/* Checkboxes */}
        <div className="flex items-center gap-4">
          <Checkbox
            name="featured"
            checked={form.featured}
            onCheckedChange={v => setForm((f: any) => ({ ...f, featured: !!v }))}
          />
          <label className="font-medium">Destacado</label>
        </div>
        <div className="flex items-center gap-4">
          <Checkbox
            name="new"
            checked={form.new}
            onCheckedChange={v => setForm((f: any) => ({ ...f, new: !!v }))}
          />
          <label className="font-medium">Nuevo</label>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">¡Producto editado!</div>}

      <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</Button>
    </form>
  );
}
