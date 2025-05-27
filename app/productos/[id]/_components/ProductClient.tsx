"use client";

import { useState } from "react";
import Link from "next/link";

import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { Product } from "@/types";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge-special";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGallery } from "@/components/product-gallery";
import Actions from "./Actions";
import api from "@/lib/axios";

const categories = [
	{ id: "joven", name: "Joven" },
	{ id: "reposado", name: "Reposado" },
	{ id: "anejo", name: "Añejo" },
	{ id: "ancestral", name: "Ancestral" },
];

type Props = {
	product: Product;
};

export default function ProductClient({ product }: Props) {
	const { token: userToken, user } = useUserAuthStore();
	const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
	const [reviewLoading, setReviewLoading] = useState(false);
	const [reviewError, setReviewError] = useState<string | null>(null);
	const [reviewSuccess, setReviewSuccess] = useState(false);
	const [reviews, setReviews] = useState(product.reviews || []);

	const handleReviewSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setReviewLoading(true);
		setReviewError(null);
		setReviewSuccess(false);
		try {
			const { data: newReview } = await api.post(
				`api/v1/products/${product.id}/reviews`,
				{
					...reviewForm,
					user_name: user?.email || "",
					date: new Date().toISOString().slice(0, 10),
				}
			);
			setReviews([newReview, ...reviews]);
			setReviewSuccess(true);
			setReviewForm({ rating: 0, comment: "" });
		} catch (err: any) {
			setReviewError("Error al enviar reseña");
		} finally {
			setReviewLoading(false);
		}
	};

	function formatFecha(fecha: string) {
		if (!fecha) return "";
		const date = new Date(fecha);
		return date.toLocaleDateString("es-MX", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	return (
		<div className="container py-12">
			<div className="mb-8">
				<Button variant="ghost" asChild className="p-0 hover:bg-transparent">
					<Link
						href="/productos"
						className="flex items-center text-muted-foreground"
					>
						<ArrowLeft className="h-4 w-4 mr-2" /> Volver a productos
					</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<ProductGallery images={product.images} name={product.name} />
				<div>
					<div className="flex flex-wrap gap-2 mb-4">
						<Badge variant={product.category as any}>
							{categories.find((c) => c.id === product.category)?.name ||
								product.category}
						</Badge>
						{product.new && <Badge variant="new">Nuevo</Badge>}
						{product.featured && <Badge variant="featured">Destacado</Badge>}
					</div>

					<h1 className="text-3xl lg:text-4xl font-bold mb-3">
						{product.name}
					</h1>

					<div className="flex items-center mb-6">
						<div className="flex text-yellow-500 mr-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<Star
									key={i}
									className={`h-5 w-5 ${
										i < Math.floor(product.rating || 0)
											? "fill-current"
											: "fill-none"
									}`}
								/>
							))}
						</div>
						<span className="text-muted-foreground">
							({product.reviews?.length || 0} reseñas)
						</span>
					</div>

					<div className="text-3xl font-bold text-amber-600 dark:text-amber-500 mb-6">
						${product.price}
					</div>

					<p className="text-muted-foreground mb-8">
						{product.shortDescription}
					</p>

					<div className="space-y-6 mb-8">
						<div className="flex items-center">
							<span className="w-32 font-medium">Origen:</span>
							<span>{product.origin}</span>
						</div>
						<div className="flex items-center">
							<span className="w-32 font-medium">Alcohol:</span>
							<span>{product.abv}% vol.</span>
						</div>
						<div className="flex items-center">
							<span className="w-32 font-medium">Volumen:</span>
							<span>{product.volume} ml</span>
						</div>
						<div className="flex items-center">
							<span className="w-32 font-medium">Agave:</span>
							<span>{product.ingredients?.join(", ")}</span>
						</div>
						<div className="flex items-center mb-2">
							<span className="w-32 font-medium">Stock disponible:</span>
							<span>{product.stock > 0 ? product.stock : "Agotado"}</span>
						</div>
					</div>

					<Actions product={product} />
				</div>
			</div>

			<div className="mt-16">
				<Tabs defaultValue="descripcion">
					<TabsList className="w-full grid grid-cols-3 max-w-2xl mb-8">
						<TabsTrigger value="descripcion">Descripción</TabsTrigger>
						<TabsTrigger value="caracteristicas">Características</TabsTrigger>
						<TabsTrigger value="resenas">
							Reseñas ({product.reviews?.length || 0})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="descripcion" className="pt-4">
						<div className="prose prose-amber dark:prose-invert max-w-none">
							<p className="text-lg leading-relaxed">{product.description}</p>
						</div>
					</TabsContent>

					<TabsContent value="caracteristicas" className="pt-4">
						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-xl font-bold mb-4">Especificaciones</h3>
								<ul className="space-y-3">
									<li className="flex justify-between py-2 border-b">
										<span className="font-medium">Categoría</span>
										<span className="text-muted-foreground">
											{categories.find((c) => c.id === product.category)?.name ||
												product.category}
										</span>
									</li>
									<li className="flex justify-between py-2 border-b">
										<span className="font-medium">Tipo de agave</span>
										<span className="text-muted-foreground">
											{product.ingredients.join(", ")}
										</span>
									</li>
									<li className="flex justify-between py-2 border-b">
										<span className="font-medium">Alcohol por volumen</span>
										<span className="text-muted-foreground">
											{product.abv}%
										</span>
									</li>
									<li className="flex justify-between py-2 border-b">
										<span className="font-medium">Volumen</span>
										<span className="text-muted-foreground">
											{product.volume} ml
										</span>
									</li>
									<li className="flex justify-between py-2 border-b">
										<span className="font-medium">Región</span>
										<span className="text-muted-foreground">
											{product.origin}
										</span>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-xl font-bold mb-4">Notas de Sabor</h3>
								<div className="bg-muted/50 p-6 rounded-lg">
									<div className="mb-4">
										<h4 className="font-medium mb-2">Aroma</h4>
										<p className="text-muted-foreground">
											Notas ahumadas dominantes, con sutiles toques de frutas
											tropicales y hierbas frescas.
										</p>
									</div>
									<div className="mb-4">
										<h4 className="font-medium mb-2">Sabor</h4>
										<p className="text-muted-foreground">
											Complejo y equilibrado, con capas de agave cocido,
											cítricos, especias y minerales.
										</p>
									</div>
									<div>
										<h4 className="font-medium mb-2">Final</h4>
										<p className="text-muted-foreground">
											Largo y persistente, con un agradable calor y retrogusto
											herbal.
										</p>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="resenas" className="pt-4">
						<div className="space-y-8">
							<h3 className="text-xl font-bold mb-6">Reseñas de Clientes</h3>

							{reviews.length > 0 ? (
								<div className="space-y-8">
									{reviews.map((review: any) => (
										<div
											key={review.id || review.date + review.user_name}
											className="border-b pb-6"
										>
											<div className="flex items-center mb-4">
												<div className="font-medium">{review.user_name}</div>
												<div className="flex text-yellow-500 ml-3">
													{Array.from({ length: 5 }).map((_, i) => (
														<Star
															key={i}
															className={`h-4 w-4 ${
																i < review.rating
																	? "fill-current"
																	: "fill-none"
															}`}
														/>
													))}
												</div>
											</div>
											<div className="text-muted-foreground mb-2 text-sm">
												{formatFecha(review.created_at || review.date)}
											</div>
											<p className="text-muted-foreground">{review.comment}</p>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									Este producto aún no tiene reseñas.
								</div>
							)}

							{userToken ? (
								<form
									onSubmit={handleReviewSubmit}
									className="mt-8 space-y-4 bg-muted/30 p-6 rounded-lg"
								>
									<div className="flex items-center gap-2">
										<span className="font-medium">Tu calificación:</span>
										{Array.from({ length: 5 }).map((_, i) => (
											<button
												type="button"
												key={i}
												onClick={() =>
													setReviewForm((f) => ({ ...f, rating: i + 1 }))
												}
												className={
													reviewForm.rating > i
														? "text-yellow-500"
														: "text-gray-400"
												}
												aria-label={`Calificar ${i + 1} estrellas`}
											>
												<Star
													className="h-6 w-6"
													fill={
														reviewForm.rating > i ? "currentColor" : "none"
													}
												/>
											</button>
										))}
									</div>
									<textarea
										className="w-full border rounded p-2"
										rows={3}
										placeholder="Escribe tu reseña..."
										value={reviewForm.comment}
										onChange={(e) =>
											setReviewForm((f) => ({ ...f, comment: e.target.value }))
										}
										required
									/>
									{reviewError && (
										<div className="text-red-500 text-sm">{reviewError}</div>
									)}
									{reviewSuccess && (
										<div className="text-green-600 text-sm">
											¡Reseña enviada!
										</div>
									)}
									<Button
										type="submit"
										onSubmit={handleReviewSubmit}
										disabled={
											reviewLoading ||
											reviewForm.rating === 0 ||
											!reviewForm.comment
										}
									>
										{reviewLoading ? "Enviando..." : "Enviar reseña"}
									</Button>
								</form>
							) : (
								<div className="text-center text-muted-foreground mt-8">
									Inicia sesión para dejar una reseña.
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
