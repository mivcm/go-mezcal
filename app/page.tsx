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
    </div>
  );
}