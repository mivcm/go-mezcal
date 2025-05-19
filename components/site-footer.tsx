import Link from "next/link";
import { footerLinks, socialLinks } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                Go.mezcal
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Mezcales artesanales de la más alta calidad, producidos por maestros mezcaleros con técnicas tradicionales que preservan la esencia y el alma del agave mexicano.
            </p>
            <div className="flex space-x-3 mt-2">
              {socialLinks.map((item) => (
                <Link key={item.name} href={item.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" aria-label={item.name}>
                    <item.icon className="h-5 w-5" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-3">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-base font-medium">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href} 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t pt-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-base font-medium">Suscríbete a nuestro newsletter</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Recibe novedades, lanzamientos exclusivos y artículos sobre el mundo del mezcal.
              </p>
              <div className="flex max-w-md gap-2">
                <Input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="max-w-md"
                />
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Suscribirse
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end justify-end">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Go.mezcal. Todos los derechos reservados.
              </p>
              <div className="mt-2 flex space-x-4 text-sm text-muted-foreground">
                <Link href="/terminos" className="hover:text-foreground">
                  Términos de Servicio
                </Link>
                <Link href="/privacidad" className="hover:text-foreground">
                  Política de Privacidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}