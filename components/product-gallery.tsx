"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {images.map((image, i) => (
          <button
            key={i}
            className={cn(
              "relative min-w-[80px] h-20 md:h-24 rounded-md overflow-hidden border-2 transition-all",
              selectedImage === i
                ? "border-amber-600"
                : "border-transparent hover:border-amber-400"
            )}
            onClick={() => setSelectedImage(i)}
          >
            <Image
              src={image}
              alt={`${name} - Vista ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
      <div className="order-1 md:order-2 md:col-span-4 relative rounded-lg overflow-hidden bg-muted">
        <div className="relative w-full aspect-square md:aspect-[3/3.6] h-auto md:h-[400px]">
          <Image
            src={images[selectedImage]}
            alt={`${name} - Imagen principal`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
}
