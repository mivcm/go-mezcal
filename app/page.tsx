import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import AboutUs from "@/components/about-us";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Us */}
      <AboutUs />
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
          <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-amber-600 dark:text-white dark:hover:text-amber-600">
            <Link href="/productos">Explorar Productos</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}