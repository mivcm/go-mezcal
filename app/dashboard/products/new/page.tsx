"use client";

import { useState } from "react";
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

export default function ProductCreatePage() {
	const { token } = useUserAuthStore();
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		slug: "",
		category: "joven",
		price: "",
		stock: "",
		images: [] as File[],
		description: "",
		shortDescription: "",
		abv: "",
		volume: "",
		origin: "",
		ingredients: [] as string[],
		featured: false,
		new: false,
	});
	const [ingredientInput, setIngredientInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		setForm(f => ({
			...f,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleCategoryChange = (value: string) => {
		setForm(f => ({ ...f, category: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setForm(f => ({ ...f, images: Array.from(e.target.files as FileList) }));
		}
	};

	const handleAddIngredient = () => {
		if (ingredientInput.trim() && !form.ingredients.includes(ingredientInput.trim())) {
			setForm(f => ({ ...f, ingredients: [...f.ingredients, ingredientInput.trim()] }));
			setIngredientInput("");
		}
	};

	const handleRemoveIngredient = (ing: string) => {
		setForm(f => ({ ...f, ingredients: f.ingredients.filter(i => i !== ing) }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const formData = new FormData();
			Object.entries(form).forEach(([key, value]) => {
				// Rails espera 'short_description', no 'shortDescription'
				const railsKey = key === "shortDescription" ? "short_description" : key;
				if (railsKey === "images") {
					(value as File[]).forEach(img => formData.append("product[images][]", img));
				} else if (railsKey === "ingredients") {
					(value as string[]).forEach(ing => formData.append("product[ingredients][]", ing));
				} else {
					formData.append(`product[${railsKey}]`, value as string);
				}
			});
			await api.post("/api/v1/products", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setSuccess(true);
			router.push("/dashboard/products");
		} catch (err: any) {
			setError(err.response?.data?.message || "Error al crear producto");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container py-12 max-w-2xl">
			<h1 className="text-2xl font-bold mb-6">Crear producto</h1>
			<form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded shadow">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block font-medium mb-1">Nombre</label>
						<Input name="name" value={form.name} onChange={handleChange} required />
					</div>
					<div>
						<label className="block font-medium mb-1">Slug</label>
						<Input name="slug" value={form.slug} onChange={handleChange} required />
					</div>
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
					<div>
						<label className="block font-medium mb-1">Precio</label>
						<Input name="price" type="number" value={form.price} onChange={handleChange} required />
					</div>
					<div>
						<label className="block font-medium mb-1">Stock</label>
						<Input name="stock" type="number" value={form.stock} onChange={handleChange} required />
					</div>
					<div>
						<label className="block font-medium mb-1">Imágenes</label>
						<Input name="images" type="file" multiple onChange={handleImageChange} required />
					</div>
					<div>
						<label className="block font-medium mb-1">Descripción corta</label>
						<Input name="shortDescription" value={form.shortDescription} onChange={handleChange} required />
					</div>
					<div className="md:col-span-2">
						<label className="block font-medium mb-1">Descripción</label>
						<Textarea name="description" value={form.description} onChange={handleChange} required />
					</div>
					<div>
						<label className="block font-medium mb-1">ABV (%)</label>
						<Input name="abv" type="number" value={form.abv} onChange={handleChange} required />
					</div>
					<div>
						<label className="block font-medium mb-1">Volumen (ml)</label>
						<Input name="volume" type="number" value={form.volume} onChange={handleChange} required />
					</div>
					<div>
						<label className="block font-medium mb-1">Origen</label>
						<Input name="origin" value={form.origin} onChange={handleChange} required />
					</div>
					<div className="md:col-span-2">
						<label className="block font-medium mb-1">Ingredientes</label>
						<div className="flex gap-2 mb-2">
							<Input
								value={ingredientInput}
								onChange={e => setIngredientInput(e.target.value)}
								placeholder="Agregar ingrediente"
								onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddIngredient(); } }}
							/>
							<Button type="button" onClick={handleAddIngredient}>Agregar</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{form.ingredients.map(ing => (
								<span key={ing} className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100 px-2 py-1 rounded flex items-center gap-1">
									{ing}
									<button type="button" onClick={() => handleRemoveIngredient(ing)} className="ml-1">✕</button>
								</span>
							))}
						</div>
					</div>
					<div className="flex items-center gap-4">
						<Checkbox name="featured" checked={form.featured} onCheckedChange={v => setForm(f => ({ ...f, featured: !!v }))} />
						<label className="font-medium">Destacado</label>
					</div>
					<div className="flex items-center gap-4">
						<Checkbox name="new" checked={form.new} onCheckedChange={v => setForm(f => ({ ...f, new: !!v }))} />
						<label className="font-medium">Nuevo</label>
					</div>
				</div>
				{error && <div className="text-red-500 text-sm">{error}</div>}
				{success && <div className="text-green-600 text-sm">¡Producto creado!</div>}
				<Button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear producto"}</Button>
			</form>
		</div>
	);
}
