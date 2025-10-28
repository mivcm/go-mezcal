import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Espíritu de Oaxaca",
    slug: "espiritu-de-oaxaca",
    category: "joven",
    price: 850,
    images: [
      "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg",
      "https://images.pexels.com/photos/5946981/pexels-photo-5946981.jpeg",
      "https://images.pexels.com/photos/5947037/pexels-photo-5947037.jpeg",
    ],
    description:
      "Un destilado joven excepcional, elaborado con agave Espadín cultivado en las montañas de Oaxaca. Su sabor combina notas ahumadas con toques cítricos y herbales, resultado de un proceso de destilación tradicional que ha pasado por generaciones. Cada sorbo revela la esencia de la tierra oaxaqueña y la maestría de nuestros maestros destiladores.",
    shortDescription:
      "destilado joven con agave Espadín, notas ahumadas y cítricas.",
    abv: 45,
    volume: 750,
    origin: "Oaxaca",
    ingredients: ["100% Agave Espadín"],
    featured: true,
    new: true,
    rating: 4.8,
    reviews: [
      {
        id: "r1",
        userName: "Miguel Ángel",
        userImage:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
        rating: 5,
        comment:
          "Un destilado excepcional, con un perfecto balance entre lo ahumado y las notas herbales.",
        date: "2023-12-15",
      },
      {
        id: "r2",
        userName: "Laura Martínez",
        userImage:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        rating: 4.5,
        comment:
          "Me encantó el sabor cítrico y su aroma tan distintivo. Definitivamente lo compraré de nuevo.",
        date: "2023-11-20",
      },
    ],
    relatedProducts: ["2", "4", "6"],
    stock: 10, // Stock inicial de ejemplo
  },
  {
    id: "2",
    name: "Alma Ancestral",
    slug: "alma-ancestral",
    category: "ancestral",
    price: 1200,
    images: [
      "https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg",
      "https://images.pexels.com/photos/5947021/pexels-photo-5947021.jpeg",
      "https://images.pexels.com/photos/5947051/pexels-photo-5947051.jpeg",
    ],
    description:
      "Este destilado ancestral es producido siguiendo métodos prehispánicos. Destilado en ollas de barro y fermentado en pieles de animal, conserva la esencia más pura de la tradición. Elaborado con agave Tobalá silvestre, presenta una complejidad aromática impresionante con notas minerales, especiadas y dulces que transportan a las raíces más profundas de México.",
    shortDescription:
      "destilado ancestral con agave Tobalá, destilado en ollas de barro.",
    abv: 48,
    volume: 500,
    origin: "Guerrero",
    ingredients: ["100% Agave Tobalá Silvestre"],
    featured: true,
    rating: 4.9,
    reviews: [
      {
        id: "r3",
        userName: "José Luis Rodríguez",
        userImage:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        rating: 5,
        comment:
          "Una experiencia única, se siente la tradición en cada sorbo. Increíble complejidad de sabores.",
        date: "2023-12-20",
      },
    ],
    relatedProducts: ["3", "5", "8"],
    stock: 10, // Stock inicial de ejemplo
  },
  {
    id: "3",
    name: "Tiempo de Roble",
    slug: "tiempo-de-roble",
    category: "reposado",
    price: 950,
    images: [
      "https://images.pexels.com/photos/5947053/pexels-photo-5947053.jpeg",
      "https://images.pexels.com/photos/5947022/pexels-photo-5947022.jpeg",
      "https://images.pexels.com/photos/5947027/pexels-photo-5947027.jpeg",
    ],
    description:
      "Un destilado reposado que descansa por 6 meses en barricas de roble francés, integrando sutilmente notas de vainilla y caramelo a la base ahumada del agave Espadín. El resultado es un equilibrio perfecto entre la rusticidad del destilado y la elegancia que aporta la madera, creando una experiencia sensorial única.",
    shortDescription:
      "destilado reposado en barricas de roble francés por 6 meses.",
    abv: 42,
    volume: 750,
    origin: "Oaxaca",
    ingredients: ["100% Agave Espadín"],
    featured: false,
    rating: 4.6,
    reviews: [
      {
        id: "r4",
        userName: "Claudia Velázquez",
        userImage:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        rating: 4.5,
        comment:
          "Me encantó cómo la barrica aporta notas dulces que complementan perfectamente el carácter ahumado.",
        date: "2023-10-18",
      },
    ],
    relatedProducts: ["1", "4", "7"],
    stock: 10, // Stock inicial de ejemplo
  },
  {
    id: "4",
    name: "Reserva de Maguey",
    slug: "reserva-de-maguey",
    category: "anejo",
    price: 1500,
    images: [
      "https://images.pexels.com/photos/5947052/pexels-photo-5947052.jpeg",
      "https://images.pexels.com/photos/5947038/pexels-photo-5947038.jpeg",
      "https://images.pexels.com/photos/5947050/pexels-photo-5947050.jpeg",
    ],
    description:
      "Este destilado añejo representa la culminación de nuestra artesanía. Reposado durante 24 meses en barricas de roble americano previamente utilizadas para bourbon, desarrolla un perfil complejo con notas de chocolate, café, frutas secas y especias, manteniendo la esencia ahumada característica del destilado.",
    shortDescription:
      "destilado añejo con 24 meses en barricas de roble americano.",
    abv: 40,
    volume: 750,
    origin: "Durango",
    ingredients: ["Blend de Agave Espadín y Cenizo"],
    featured: true,
    rating: 4.9,
    reviews: [
      {
        id: "r5",
        userName: "Roberto Campos",
        userImage:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
        rating: 5,
        comment:
          "Un destilado excepcional para disfrutar lentamente. Sus notas de chocolate y especias son increíbles.",
        date: "2023-11-25",
      },
    ],
    relatedProducts: ["3", "6", "8"],
    stock: 10, // Stock inicial de ejemplo
  },
  {
    id: "5",
    name: "Silvestre Cupreata",
    slug: "silvestre-cupreata",
    category: "joven",
    price: 1100,
    images: [
      "https://images.pexels.com/photos/5947042/pexels-photo-5947042.jpeg",
      "https://images.pexels.com/photos/5947026/pexels-photo-5947026.jpeg",
      "https://images.pexels.com/photos/5947020/pexels-photo-5947020.jpeg",
    ],
    description:
      "Elaborado con agave Cupreata silvestre, este destilado joven captura la esencia de las montañas de Guerrero. Su sabor intenso revela notas terrosas, herbales y frutales, con un final persistente y ligeramente picante que refleja el terroir único de la región.",
    shortDescription: "destilado joven con agave Cupreata silvestre de Guerrero.",
    abv: 47,
    volume: 750,
    origin: "Guerrero",
    ingredients: ["100% Agave Cupreata Silvestre"],
    featured: false,
    new: true,
    rating: 4.7,
    reviews: [
      {
        id: "r6",
        userName: "Ana Sofía López",
        userImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
        rating: 4.5,
        comment:
          "Un destilado con carácter, me encantaron sus notas herbales y ese final picante tan característico.",
        date: "2023-12-05",
      },
    ],
    relatedProducts: ["1", "2", "7"],
    stock: 10, // Stock inicial de ejemplo
  },
  {
    id: "6",
    name: "Ensamble Arroqueño",
    slug: "ensamble-arroqueno",
    category: "joven",
    price: 1250,
    images: [
      "https://images.pexels.com/photos/5947018/pexels-photo-5947018.jpeg",
      "https://images.pexels.com/photos/5947041/pexels-photo-5947041.jpeg",
      "https://images.pexels.com/photos/5947040/pexels-photo-5947040.jpeg",
    ],
    description:
      "Un ensamble extraordinario que combina agave Arroqueño y Espadín, creando un perfil de sabor único y complejo. Sus notas frutales y florales se complementan con un carácter ahumado bien integrado, resultado de la maestría en la selección y combinación de agaves de diferentes edades y terruños.",
    shortDescription:
      "Ensamble de agave Arroqueño y Espadín con notas frutales.",
    abv: 45,
    volume: 750,
    origin: "Oaxaca",
    ingredients: ["70% Agave Arroqueño", "30% Agave Espadín"],
    featured: true,
    rating: 4.8,
    reviews: [
      {
        id: "r7",
        userName: "Francisco Gutiérrez",
        userImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
        rating: 5,
        comment:
          "La complejidad de este ensamble es impresionante. Cada sorbo revela nuevas dimensiones de sabor.",
        date: "2023-11-10",
      },
    ],
    relatedProducts: ["1", "5", "8"],
    stock: 10, // Stock inicial de ejemplo
  },
  {
    id: "7",
    name: "Edición Especial Tepeztate",
    slug: "edicion-especial-tepeztate",
    category: "joven",
    price: 1800,
    images: [
      "https://images.pexels.com/photos/5947033/pexels-photo-5947033.jpeg",
      "https://images.pexels.com/photos/5947049/pexels-photo-5947049.jpeg",
      "https://images.pexels.com/photos/5947048/pexels-photo-5947048.jpeg",
    ],
    description:
      "Una edición limitada elaborada con agave Tepeztate, que tarda hasta 25 años en madurar en estado silvestre. Este destilado joven ofrece una explosión de sabores con notas vegetales, cítricas y minerales, culminando en un final largo y complejo que refleja la paciencia requerida para su elaboración.",
    shortDescription:
      "Edición limitada con agave Tepeztate de 25 años de maduración.",
    abv: 49,
    volume: 500,
    origin: "Oaxaca",
    ingredients: ["100% Agave Tepeztate Silvestre"],
    featured: false,
    new: true,
    rating: 4.9,
    reviews: [
      {
        id: "r8",
        userName: "Elena Ramírez",
        userImage:
          "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
        rating: 5,
        comment:
          "Una experiencia incomparable. La complejidad del Tepeztate se aprecia perfectamente en este destilado.",
        date: "2023-12-12",
      },
    ],
    relatedProducts: ["2", "5", "6"],
    stock: 10, // Stock inicial de ejemplo
  },
  {
    id: "8",
    name: "Pechuga Tradicional",
    slug: "pechuga-tradicional",
    category: "joven",
    price: 1350,
    images: [
      "https://images.pexels.com/photos/5947036/pexels-photo-5947036.jpeg",
      "https://images.pexels.com/photos/5947047/pexels-photo-5947047.jpeg",
      "https://images.pexels.com/photos/5947039/pexels-photo-5947039.jpeg",
    ],
    description:
      "Siguiendo una antigua tradición, este destilado se destila por tercera vez con una pechuga de pavo y una selección de frutas y especias locales. El resultado es un destilado joven increíblemente aromático y complejo, con notas de frutas tropicales, canela, anís y un sutil carácter ahumado.",
    shortDescription:
      "destilado de pechuga destilado con frutas y especias tradicionales.",
    abv: 45,
    volume: 750,
    origin: "Michoacán",
    ingredients: ["100% Agave Cupreata", "Frutas", "Especias"],
    featured: true,
    rating: 4.8,
    reviews: [
      {
        id: "r9",
        userName: "Javier Méndez",
        userImage:
          "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
        rating: 5,
        comment:
          "La complejidad aromática es impresionante. Las frutas y especias se integran perfectamente con el agave.",
        date: "2023-10-28",
      },
    ],
    relatedProducts: ["2", "4", "7"],
    stock: 10, // Stock inicial de ejemplo
  },
];

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function getNewProducts(): Product[] {
  return products.filter((product) => product.new);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(productId: string): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product || !product.relatedProducts) return [];

  return products.filter((p) => product.relatedProducts?.includes(p.id));
}
