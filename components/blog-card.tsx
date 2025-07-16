import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link 
        href={`/blog/${post.slug}`}
        className="group grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg overflow-hidden"
      >
        <div className="relative aspect-video md:aspect-auto overflow-hidden rounded-lg">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDate(post.date)}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          {post.author && (
            <div className="flex items-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium">
                {post.author.name}
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={post.cover_image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(post.date)}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        {post.author && (
          <div className="flex items-center mt-auto pt-2 border-t">
            <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
              <Image
                src={post.author.image}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium">
              {post.author.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}