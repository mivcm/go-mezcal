"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog-card";
import { useEffect, useState } from "react";
import { useBlogStore } from "@/hooks/use-blog-store";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { avatarUrl } from "./data";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { getBlogBySlug, blogs, loading, error } = useBlogStore();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    getBlogBySlug(slug).then(setPost);
  }, [slug, getBlogBySlug]);

  // Artículos relacionados: los más recientes excepto el actual
  const recentPosts = blogs.filter((b) => b.slug !== slug).slice(0, 2);

  if (loading) {
    return <div className="container py-16 text-center">Cargando artículo...</div>;
  }
  if (error) {
    return <div className="container py-16 text-center text-red-600">{error}</div>;
  }
  if (!post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Artículo no encontrado</h1>
        <p className="mb-8">El artículo que estás buscando no existe o ha sido eliminado.</p>
        <Button asChild>
          <Link href="/blog">Ver todos los artículos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
            <Link href="/blog" className="flex items-center text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex items-center flex-wrap gap-4 text-muted-foreground">
            {post.author && (
              <div className="flex items-center" key={post.author.name}>
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{post.author.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </div>

        {/* Feature Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-12">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="md:col-span-8">
            <div className="prose prose-amber dark:prose-invert max-w-none">
              {post.content.split('\n').map((paragraph, index) => {
                // Check if paragraph is a heading
                if (paragraph.startsWith('#')) {
                  const match = paragraph.match(/^#+/);
                  const level = match ? match[0].length : 1;
                  const content = paragraph.replace(/^#+\s+/, '');

                  switch (level) {
                    case 1:
                      return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{content}</h1>;
                    case 2:
                      return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{content}</h2>;
                    case 3:
                      return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{content}</h3>;
                    default:
                      return <h4 key={index} className="text-lg font-bold mt-4 mb-2">{content}</h4>;
                  }
                }

                // Check if paragraph is a list item
                if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
                  return (
                    <ul key={index} className="list-disc pl-5 my-4">
                      <li>{paragraph.trim().substring(1).trim()}</li>
                    </ul>
                  );
                }

                // Check if paragraph is a numbered list item
                if (/^\d+\./.test(paragraph.trim())) {
                  return (
                    <ol key={index} className="list-decimal pl-5 my-4">
                      <li>{paragraph.trim().replace(/^\d+\.\s+/, '')}</li>
                    </ol>
                  );
                }

                // Regular paragraph
                return paragraph.trim() ? (
                  <p key={index} className="my-4 leading-relaxed">{paragraph}</p>
                ) : null;
              })}
            </div>

            {/* Tags */}
            <div className="mt-12 border-t pt-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-bold mb-4">Comparte este artículo</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Compartir en Facebook</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Compartir en Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">Compartir en LinkedIn</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Compartir enlace</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-8">
            {/* Author */}
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-bold mb-4">Sobre el Autor</h3>
              <div className="flex items-center mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={post.author?.image || avatarUrl}
                    alt={post.author?.name || 'Autor desconocido'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-lg">{post.author?.name || 'Autor desconocido'}</div>
                  <div className="text-sm text-muted-foreground">Experto en destilado</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Especialista en la cultura y producción del destilado tradicional mexicano, con amplia experiencia en el sector.
              </p>
            </div>

            {/* Related Posts */}
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-bold mb-4">Artículos Relacionados</h3>
              <div className="space-y-4">
                {recentPosts.length > 0 ? (
                  recentPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={relatedPost.cover_image || ''}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(relatedPost.date)}
                      </p>
                    </div>
                  </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay artículos relacionados</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}