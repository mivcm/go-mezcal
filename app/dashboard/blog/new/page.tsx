import { BlogForm } from "@/components/blog-form";
import { useRouter } from "next/navigation";

export default function BlogNewPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Crear nuevo blog</h1>
      <BlogForm onSuccess={() => router.push("/dashboard/blog")} />
    </div>
  );
}
