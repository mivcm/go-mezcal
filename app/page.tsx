import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/product-list";
import { BlogCard } from "@/components/blog-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { getFeaturedProducts } from "@/data/products";
import { getFeaturedPosts, getRecentPosts } from "@/data/blog-posts";
import { getTestimonials } from "@/data/testimonials";
import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";

export default function Home() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(3);
  const testimonials = getTestimonials();

  return (
    <div>
      {/* Hero Section */}
      <HeroSection/>

      {/* Featured Products */}
      <FeaturedProducts/>

      {/* About Us */}
      <section className="py-16 bg-white dark:bg-stone-900">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square md:aspect-auto rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/1209037/pexels-photo-1209037.jpeg"
                alt="Maestro mezcalero"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Nuestra Filosofía</h2>
              <p className="text-lg text-muted-foreground mb-6">
                En Go.mezcal, creemos que cada botella cuenta una historia. Trabajamos directamente con familias productoras que han perfeccionado el arte del mezcal durante generaciones, preservando técnicas ancestrales y el profundo respeto por el agave.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Nos comprometemos con la sostenibilidad ambiental y el comercio justo, asegurando que nuestros maestros mezcaleros reciban una compensación justa por su extraordinario trabajo y conocimiento.
              </p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/nosotros">Conoce Más Sobre Nosotros</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            El Proceso Artesanal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">01</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cosecha</h3>
              <p className="text-amber-100">
                Selección cuidadosa de agaves maduros, cosechados a mano por jimadores expertos.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">02</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cocción</h3>
              <p className="text-amber-100">
                Horneado en pozos subterráneos con piedras calientes, un proceso que puede durar hasta 5 días.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">03</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fermentación</h3>
              <p className="text-amber-100">
                Fermentación natural en tinas de madera utilizando levaduras silvestres locales.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">04</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Destilación</h3>
              <p className="text-amber-100">
                Doble destilación en alambiques de cobre o barro, supervisada por maestros mezcaleros.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-amber-900">
              <Link href="/proceso">Descubre Todo el Proceso</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-stone-900">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-amber-50/50 dark:bg-stone-900">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8">
            <h2 className="text-3xl font-bold">De Nuestro Blog</h2>
            <Link href="/blog" className="text-amber-600 hover:text-amber-700 font-medium">
              Ver todos los artículos
            </Link>
          </div>
          
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <BlogCard post={featuredPosts[0]} featured />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">
            Descubre el Auténtico Sabor de México
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Explora nuestra selección de mezcales artesanales y encuentra el que mejor se adapta a tu paladar.
          </p>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
            <Link href="/productos">Explorar Productos</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}