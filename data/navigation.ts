import { NavigationItem, FooterLink, SocialLink } from "@/types";
import { Facebook, Instagram } from "lucide-react";

export const mainNavItems: NavigationItem[] = [
  {
    title: "Inicio",
    href: "/",
  },
  {
    title: "Productos",
    href: "/productos",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Nosotros",
    href: "/nosotros",
  },
  {
    title: "Contacto",
    href: "/contacto",
  },
];

export const footerLinks: FooterLink[] = [
  {
    title: "Productos",
    items: [
      {
        label: "destilado Joven",
        href: "/productos?categoria=joven",
      },
      {
        label: "destilado Reposado",
        href: "/productos?categoria=reposado",
      },
      {
        label: "destilado Añejo",
        href: "/productos?categoria=anejo",
      },
      {
        label: "destilado Ancestral",
        href: "/productos?categoria=ancestral",
      },
      {
        label: "Ediciones Especiales",
        href: "/productos?categoria=especial",
      },
    ],
  },
  {
    title: "Empresa",
    items: [
      {
        label: "Sobre Nosotros",
        href: "/nosotros",
      },
      {
        label: "Blog",
        href: "/blog",
      },
      {
        label: "Contacto",
        href: "/contacto",
      },
    ],
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/granespiritumx/?locale=es_LA",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/granespiritumx/?hl=es",
    icon: Instagram,
  },
];