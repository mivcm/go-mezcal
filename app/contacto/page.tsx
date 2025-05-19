"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Ingresa un correo electrónico válido",
  }),
  telefono: z.string().optional(),
  asunto: z.string().min(5, {
    message: "El asunto debe tener al menos 5 caracteres",
  }),
  mensaje: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres",
  }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      asunto: "",
      mensaje: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulated submission
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      
      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te contactaremos pronto.",
      });
    }, 1500);
  }

  const faqs = [
    {
      question: "¿Ofrecen envíos a todo México?",
      answer: "Sí, realizamos envíos a toda la República Mexicana. Los pedidos suelen entregarse en un plazo de 3 a 5 días hábiles, dependiendo de la localidad.",
    },
    {
      question: "¿Hacen envíos internacionales?",
      answer: "Actualmente realizamos envíos a Estados Unidos, Canadá y la Unión Europea. Por regulaciones de cada país, los tiempos de entrega pueden variar entre 7 y 14 días hábiles.",
    },
    {
      question: "¿Puedo visitar su tienda física?",
      answer: "¡Por supuesto! Contamos con una tienda en la Ciudad de México donde puedes conocer y degustar nuestros productos. Te recomendamos agendar una cita para brindarte una mejor atención.",
    },
    {
      question: "¿Ofrecen degustaciones o tours?",
      answer: "Sí, organizamos degustaciones en nuestra tienda y también colaboramos con algunos de nuestros productores para ofrecer visitas a sus palenques en Oaxaca. Contacta con nosotros para más información y reservaciones.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal, transferencias bancarias y pago en efectivo en nuestra tienda física.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-cover bg-center">
        <Image
          src="https://images.pexels.com/photos/12706893/pexels-photo-12706893.jpeg"
          alt="Contáctanos - Go.mezcal"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contáctanos</h1>
            <p className="text-lg text-white/90 max-w-xl mx-auto">
              Estamos aquí para atender tus dudas, recibir tus comentarios o ayudarte con cualquier consulta sobre nuestros mezcales.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Información de Contacto</h2>
            <p className="text-muted-foreground mb-8">
              Puedes contactarnos a través del formulario o utilizando cualquiera de los siguientes medios. Nuestro equipo estará encantado de asistirte.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Ubicación</h3>
                  <address className="not-italic text-muted-foreground">
                    Av. Revolución 1234<br />
                    Col. Condesa, CP 06140<br />
                    Ciudad de México, México
                  </address>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Correo Electrónico</h3>
                  <p className="text-muted-foreground">
                    <a href="mailto:info@gomezcal.com" className="hover:text-amber-600">
                      info@gomezcal.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Teléfono</h3>
                  <p className="text-muted-foreground">
                    <a href="tel:+525512345678" className="hover:text-amber-600">
                      +52 (55) 1234 5678
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Horario de Atención</h3>
                  <p className="text-muted-foreground">
                    Lunes a Viernes: 10:00 AM - 7:00 PM<br />
                    Sábados: 11:00 AM - 5:00 PM<br />
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-10">
              <div className="aspect-video rounded-lg overflow-hidden border shadow-sm">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.661200207182!2d-99.17256!3d19.419903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff71fb11c969%3A0xd4710f84ba325c79!2sAv.%20Revoluci%C3%B3n%2C%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses-419!2smx!4v1621881234567!5m2!1ses-419!2smx" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  title="Ubicación de Go.mezcal"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-card rounded-lg border p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-6">Envíanos un Mensaje</h2>
              <p className="text-muted-foreground mb-6">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input placeholder="tucorreo@ejemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono <span className="text-muted-foreground text-sm">(opcional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Tu número de teléfono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="asunto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Asunto de tu mensaje" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mensaje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Escribe tu mensaje aquí..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <MessageSquare className="h-8 w-8 text-amber-600" />
            <h2 className="text-3xl font-bold">Preguntas Frecuentes</h2>
          </div>
          
          <Accordion type="single" collapsible className="max-w-3xl">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">
              ¿No encuentras la respuesta que buscas?
            </p>
            <Button asChild>
              <Link href="mailto:info@gomezcal.com">Contáctanos directamente</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}