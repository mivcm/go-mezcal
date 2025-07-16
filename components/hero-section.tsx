'use client'

import Image from "next/image";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSiteSettingsStore } from "@/hooks/use-site-settings-store";

export default function HeroSection() {
  const { getImage, currentImages, isLoading } = useSiteSettingsStore()

  useEffect(() => {
    getImage('hero_image')
  }, [])

  if (isLoading) {
    return (
      <section className="relative">
        <div className="relative h-[80vh] bg-gray-200">
          <Skeleton className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-4">
            <div className="max-w-3xl mx-auto">
              <Skeleton className="h-16 w-full mb-6" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-8" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="relative h-[80vh] bg-cover bg-center">
        <Image
          src={currentImages.hero_image || 'https://images.pexels.com/photos/8105036/pexels-photo-8105036.jpeg'}
          alt="Mezcal Artesanal Mexicano"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              La Tradición del Mezcal Artesanal
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Descubre nuestra colección de mezcales artesanales elaborados con técnicas ancestrales por maestros mezcaleros mexicanos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                <Link href="/productos">Explorar Productos</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 sm:ml-4">
                <Link href="/nosotros">Conoce Nuestra Historia</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}