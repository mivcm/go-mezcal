export type Product = {
  id: string;
  name: string;
  slug: string;
  category: 'joven' | 'reposado' | 'anejo' | 'ancestral';
  price: number;
  images: string[];
  description: string;
  shortDescription: string;
  abv: number; // Alcohol by volume
  volume: number; // in ml
  origin: string;
  ingredients: string[];
  featured?: boolean;
  new?: boolean;
  rating: number;
  reviews: Review[];
  relatedProducts?: string[];
  stock: number; // Stock disponible
};

export type Review = {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  date: string;
  author?: {
    name: string;
    image: string;
  };
  category: string;
  featured?: boolean;
  tags: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  position: string;
  image: string;
  comment: string;
  rating: number;
};

export type NavigationItem = {
  title: string;
  href: string;
  children?: NavigationItem[];
};

export type FooterLink = {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
};

export type SocialLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};