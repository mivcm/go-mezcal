"use client";
import Link from "next/link";
import { useBlogStore } from "@/hooks/use-blog-store";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog-card";
import { BackButton } from "@/components/ui/back-button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogAdminPage() {
  const { blogs, fetchBlogs, loading, error, deleteBlog } = useBlogStore();
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <BackButton />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <Button asChild>
          <Link href="/dashboard/blogs/new">Crear blog</Link>
        </Button>
      </div>
      {loading && <div>Cargando blogs...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.length === 0 && <div>No hay blogs</div>}
        {blogs.map((post) => (
          <div key={post.id} className="relative border rounded-lg p-4">
            <BlogCard post={post} />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/blogs/${post.slug}/edit`)}>
                Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={async () => { await deleteBlog(post.id); }}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
