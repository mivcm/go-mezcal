"use client"

import Link from "next/link";
import { Metadata } from "next";
import { useEffect } from "react";
import { useBlogStore } from "@/hooks/use-blog-store";
import { BlogCard } from "@/components/blog-card";



export default function BlogPage({ 
  searchParams 
}: { 
  searchParams: { categoria?: string } 
}) {
  const category = searchParams.categoria;
  const { blogs, loading, error, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Filtrado por categoría si se desea
  const posts = category ? blogs.filter((b) => b.category === category) : blogs;
  const featuredPosts = posts.filter((b) => b.featured);
  // Para categorías únicas y su conteo
  const categories = Array.from(
    blogs.reduce((acc, b) => {
      acc.set(b.category, (acc.get(b.category) || 0) + 1);
      return acc;
    }, new Map()),
  ).map(([name, count]) => ({ name, count }));

  // Muestra loading y error
  if (loading) return <div className="container py-12 text-center">Cargando blogs...</div>;
  if (error) return <div className="container py-12 text-center text-red-600">{error}</div>;

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-2">Blog de Go.Mezcal</h1>
      <p className="text-xl text-muted-foreground mb-12">
        Artículos sobre la cultura, producción y degustación del destilado artesanal mexicano.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-9">
          {/* Featured Posts (show only if no category filter) */}
          {!category && featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Artículos Destacados</h2>
              <div className="space-y-8">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} featured />
                ))}
              </div>
            </div>
          )}

          {/* All Posts / Filtered Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {category 
                ? `Artículos sobre ${category}` 
                : "Todos los Artículos"}
            </h2>
            
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-xl font-medium mb-2">No se encontraron artículos</h3>
                <p className="text-muted-foreground mb-6">
                  No hay artículos disponibles para esta categoría.
                </p>
                <Link 
                  href="/blog" 
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Ver todos los artículos
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-8">
          {/* Categories */}
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-bold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/blog" 
                  className={`text-sm hover:text-amber-600 transition-colors ${!category ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}
                >
                  Todas las categorías
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link 
                    href={`/blog?categoria=${cat.name}`} 
                    className={`text-sm hover:text-amber-600 transition-colors flex justify-between items-center ${
                      category === cat.name ? 'text-amber-600 font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tags */}
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-bold mb-4">Tags Populares</h3>
            <div className="flex flex-wrap gap-2">
              {['historia', 'producción', 'degustación', 'sostenibilidad', 'maridaje', 'agave', 'artesanal'].map((tag) => (
                <Link 
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="px-3 py-1 bg-muted rounded-full text-xs hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="rounded-lg border p-6 bg-amber-50 dark:bg-amber-900/10">
            <h3 className="text-lg font-bold mb-4">Suscríbete al Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recibe los últimos artículos y novedades sobre el mundo del destilado.
            </p>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="w-full px-3 py-2 border rounded-md"
              />
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-md transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}