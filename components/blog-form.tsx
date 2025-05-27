import { useState, useRef } from "react";
import type { BlogPost } from "@/types";
import { useBlogStore } from "@/hooks/use-blog-store";
import { useToast } from "@/hooks/use-toast";

interface BlogFormProps {
  initialData?: Partial<BlogPost>;
  onSuccess?: () => void;
  isEdit?: boolean;
}

export function BlogForm({ initialData = {}, onSuccess, isEdit = false }: BlogFormProps) {
  const { createBlog, updateBlog, loading, error } = useBlogStore();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: initialData.title || "",
    slug: initialData.slug || "",
    excerpt: initialData.excerpt || "",
    content: initialData.content || "",
    category: initialData.category || "",
    featured: initialData.featured || false,
    tags: initialData.tags?.join(", ") || "",
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData.coverImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("excerpt", form.excerpt);
    formData.append("content", form.content);
    formData.append("category", form.category);
    formData.append("featured", String(form.featured));
    form.tags.split(",").map((t) => t.trim()).forEach((tag) => formData.append("tags[]", tag));
    if (coverImage) formData.append("cover_image", coverImage);
    let result;
    if (isEdit && initialData.id) {
      result = await updateBlog(initialData.id, formData);
    } else {
      result = await createBlog(formData);
    }
    if (result) {
      toast({ title: isEdit ? "Blog actualizado" : "Blog creado", description: "La operación fue exitosa.", variant: "default" });
      onSuccess?.();
    } else if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block font-medium mb-1">Título</label>
        <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block font-medium mb-1">Slug</label>
        <input name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block font-medium mb-1">Extracto</label>
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} required />
      </div>
      <div>
        <label className="block font-medium mb-1">Contenido</label>
        <textarea name="content" value={form.content} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={8} required />
      </div>
      <div>
        <label className="block font-medium mb-1">Categoría</label>
        <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featured" />
        <label htmlFor="featured">Destacado</label>
      </div>
      <div>
        <label className="block font-medium mb-1">Tags (separados por coma)</label>
        <input name="tags" value={form.tags} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Imagen de portada</label>
        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
        {preview && (
          <img src={preview} alt="Vista previa" className="mt-2 rounded w-full max-h-64 object-cover" />
        )}
      </div>
      <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded" disabled={loading}>
        {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
