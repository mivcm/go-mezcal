"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { mainNavItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();
  const { token, isAdmin, logout, setTokenFromStorage, user } =
    useUserAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                Go.mezcal
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {renderNavItems()}
            </nav>
          </div>
          <div className="flex items-center">
            {!token && (
              <>
                <Link href="/login" className="mr-2">
                  <Button variant="secondary" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/register" className="mr-3">
                  <Button variant="outline" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
            <Link href="/carrito" className="mr-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute right-0 top-0 h-4 w-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              </Button>
            </Link>

            {token && user && (
              <>
                {!isAdmin && (
                  <Link href="/orders" className="mr-2">
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
                  <Link href="/dashboard" className="mr-2">
                    <Button variant="secondary" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              </>
            )}
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-2"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 space-y-4">
            {renderMobileNavItems()}
            <div className="pt-4 flex items-center justify-between">
              <ModeToggle />
              {token && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
