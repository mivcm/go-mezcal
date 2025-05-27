import { useParams, useRouter } from "next/navigation";
import { useBlogStore } from "@/hooks/use-blog-store";
import { BlogForm } from "@/components/blog-form";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/types";

export default function BlogEditPage() {
  const { id } = useParams();
  const { blogs, getBlogBySlug, fetchBlogs } = useBlogStore();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Buscar por id en blogs, si no existe, fetch
    const found = blogs.find((b) => b.id === id);
    if (found) {
      setBlog(found);
    } else {
      fetchBlogs().then(() => {
        const updated = blogs.find((b) => b.id === id);
        if (updated) setBlog(updated);
      });
    }
  }, [id, blogs, fetchBlogs]);

  if (!blog) return <div className="py-10 text-center">Cargando blog...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar blog</h1>
      <BlogForm initialData={blog} isEdit onSuccess={() => router.push("/dashboard/blog")} />
    </div>
  );
}
