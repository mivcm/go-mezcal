import { NavigationItem, FooterLink, SocialLink } from "@/types";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

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
        label: "Mezcal Joven",
        href: "/productos?categoria=joven",
      },
      {
        label: "Mezcal Reposado",
        href: "/productos?categoria=reposado",
      },
      {
        label: "Mezcal Añejo",
        href: "/productos?categoria=anejo",
      },
      {
        label: "Mezcal Ancestral",
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
        label: "Nuestro Compromiso",
        href: "/nosotros#compromiso",
      },
      {
        label: "Productores",
        href: "/productores",
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
  {
    title: "Soporte",
    items: [
      {
        label: "Preguntas Frecuentes",
        href: "/faq",
      },
      {
        label: "Envíos",
        href: "/envios",
      },
      {
        label: "Devoluciones",
        href: "/devoluciones",
      },
      {
        label: "Términos y Condiciones",
        href: "/terminos",
      },
      {
        label: "Política de Privacidad",
        href: "/privacidad",
      },
    ],
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: Instagram,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    name: "Youtube",
    href: "https://youtube.com",
    icon: Youtube,
  },
];