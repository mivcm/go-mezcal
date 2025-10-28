import { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Carlos Méndez",
    position: "Chef, Restaurante Raíces",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    comment: "Los destilados de Go.Mezcal han sido un descubrimiento extraordinario para nuestro restaurante. La calidad y autenticidad de sus productos nos ha permitido crear experiencias de maridaje únicas para nuestros clientes.",
    rating: 5
  },
  {
    id: "t2",
    name: "Sofía Rodríguez",
    position: "Sommelier",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    comment: "Como profesional en el mundo de las bebidas, puedo asegurar que los destilados de Go.Mezcal están entre los mejores que he probado. Su compromiso con los productores artesanales y la calidad es evidente en cada botella.",
    rating: 5
  },
  {
    id: "t3",
    name: "Javier López",
    position: "Coleccionista de destilados",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    comment: "He coleccionado destilados durante más de una década, y los que he adquirido en Go.Mezcal son verdaderas joyas en mi colección. La transparencia sobre el origen y proceso de producción es algo que valoro enormemente.",
    rating: 4
  },
  {
    id: "t4",
    name: "Laura Martínez",
    position: "Entusiasta del destilado",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    comment: "Descubrí Go.Mezcal en una cata y quedé impresionada. No solo por la calidad de sus destilados, sino por todo el conocimiento que comparten sobre cada botella. Ha cambiado completamente mi forma de apreciar esta bebida.",
    rating: 5
  }
];

export function getTestimonials(): Testimonial[] {
  return testimonials;
}