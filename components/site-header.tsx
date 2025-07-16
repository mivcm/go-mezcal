"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { mainNavItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/hooks/use-cart-store";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, fetchCart } = useCartStore();
  const { token, isAdmin, logout, setTokenFromStorage, user } =
    useUserAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [animateCart, setAnimateCart] = useState(false);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const prevItemCount = useRef(itemCount);

  const handleDropdownToggle = (title: string) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    if (pathname.startsWith("/dashboard")) {
      router.push("/");
    }
  };

  useEffect(() => {
    setTokenFromStorage();
  }, [setTokenFromStorage]);

  // Sincronizar carrito al iniciar sesión o si hay token y el store está vacío
  useEffect(() => {
    if (token && items.length === 0) {
      fetchCart();
    }
  }, [token, items.length, fetchCart]);

  useEffect(() => {
    if (prevItemCount.current !== itemCount) {
      setAnimateCart(true);
      const timeout = setTimeout(() => setAnimateCart(false), 300);
      prevItemCount.current = itemCount;
      return () => clearTimeout(timeout);
    }
  }, [itemCount]);

  const renderNavItems = () =>
    mainNavItems.map((item) => {
      const isActive = pathname === item.href;
      if (item.children) {
        return (
          <div
            key={item.title}
            className="relative"
            onMouseEnter={() => setActiveDropdown(item.title)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1 transition-colors hover:text-amber-700",
                isActive && "text-amber-700"
              )}
              onClick={() => handleDropdownToggle(item.title)}
              type="button"
            >
              {item.title}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "transition-transform duration-200",
                  activeDropdown === item.title && "rotate-180"
                )}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {activeDropdown === item.title && (
              <div className="absolute left-0 top-full mt-2 w-48 rounded-md bg-background shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }
      return (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            "transition-colors hover:text-amber-700",
            isActive && "text-amber-700"
          )}
        >
          {item.title}
        </Link>
      );
    });

  const renderMobileNavItems = () =>
    mainNavItems.map((item) => {
      if (item.children) {
        return (
          <div key={item.title} className="space-y-3">
            <button
              className="flex items-center justify-between w-full text-left font-medium"
              onClick={() => handleDropdownToggle(item.title)}
              type="button"
            >
              {item.title}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "transition-transform duration-200",
                  activeDropdown === item.title && "rotate-180"
                )}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {activeDropdown === item.title && (
              <div className="mt-2 pl-4 space-y-2 border-l-2 border-muted">
                {item.children.map((child) => (
                  <Link
                    key={child.title}
                    href={child.href}
                    className="block text-sm hover:text-amber-700"
                    onClick={() => {
                      setActiveDropdown(null);
                      setIsMenuOpen(false);
                    }}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      }
      return (
        <Link
          key={item.title}
          href={item.href}
          className="block font-medium hover:text-amber-700"
          onClick={() => setIsMenuOpen(false)}
        >
          {item.title}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-2 sm:px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex">
            <Link href="/" className="mr-4 sm:mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                Go.mezcal
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm font-medium">
              {renderNavItems()}
            </nav>
          </div>
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 p-2 h-10 w-10 flex items-center justify-center border border-amber-200 dark:border-stone-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          <div className="hidden md:flex items-center">
            {/* Botones solo en desktop */}
            {!token && (
              <>
                <Link href="/login" className="mr-1 sm:mr-2">
                  <Button variant="secondary" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/register" className="mr-2 sm:mr-3">
                  <Button variant="outline" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
            <Link href="/carrito" className="mr-2 sm:mr-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="h-5 w-5" />
                <span
                  className={cn(
                    "absolute right-0 top-0 h-4 w-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center transition-transform",
                    animateCart && "scale-125 animate-bounce"
                  )}
                  style={{ transition: 'transform 0.3s' }}
                >
                  {itemCount}
                </span>
              </Button>
            </Link>
            {token && user && (
              <>
                {!isAdmin && (
                  <Link href="/orders" className="mr-1 sm:mr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-600 text-amber-600"
                    >
                      Mis Órdenes
                    </Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/dashboard" className="mr-1 sm:mr-2">
                    <Button variant="secondary" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-1 sm:ml-2"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              </>
            )}
            <div className="ml-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95">
          <div className="container py-4 space-y-4 px-2">
            {renderMobileNavItems()}
            <div className="pt-4 flex flex-col gap-2">
              <Link href="/carrito" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito
                  <span className="ml-auto bg-amber-600 text-white rounded-full px-2 text-xs">{itemCount}</span>
                </Button>
              </Link>
              {!token && (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full mb-1">Iniciar sesión</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full mb-1">Registrarse</Button>
                  </Link>
                </>
              )}
              {token && user && (
                <>
                  {!isAdmin && (
                    <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full mb-1 border-amber-600 text-amber-600">Mis Órdenes</Button>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="secondary" className="w-full mb-1">Dashboard</Button>
                    </Link>
                  )}
                  <Button variant="destructive" className="w-full mb-1" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Cerrar sesión</Button>
                </>
              )}
              <div className="w-full flex justify-start mt-2">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
