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
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";

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
  const { user } = useUserAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: user?.email || "",
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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-cover bg-center">
        <Image
          src="/images/Contacto.png"
          alt="Contáctanos - Go.mezcal"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Contáctanos
            </h1>
            <p className="text-lg text-white/90 max-w-xl mx-auto">
              Estamos aquí para atender tus dudas, recibir tus comentarios o
              ayudarte con cualquier consulta sobre nuestros mezcales.
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
              Puedes contactarnos a través del formulario o utilizando
              cualquiera de los siguientes medios. Nuestro equipo estará
              encantado de asistirte.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Ubicación</h3>
                  <address className="not-italic text-muted-foreground">
                    Tienda en línea atendida desde la Ciudad de Villa de
                    Álvarez, Colima.
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
                    <a
                      href="mailto:granespiritumexico@gmail.com"
                      className="hover:text-amber-600"
                    >
                      granespiritumexico@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Whatsapp</h3>
                  <p className="text-muted-foreground">
                    <a
                      href="tel:+523121097042"
                      className="hover:text-amber-600"
                    >
                      312 109 7042
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center gap-4 mb-6 mt-10">
                  <MessageSquare className="h-8 w-8 text-amber-600" />
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-bold">Preguntas Frecuentes</h2>
                    <p className="text-muted-foreground">
                      En breve actualizaremos esta sección
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-card rounded-lg border p-8 shadow-sm">
                  <h3 className="text-3xl font-bold text-center">Contáctanos</h3>
                  <div className="mt-3 text-center">
                    <p className="text-muted-foreground mb-4">
                      ¿No encuentras la respuesta que buscas?
                    </p>
                    <Button
                      asChild
                      className="w-full bg-amber-600 hover:bg-amber-700"
                    >
                      <Link href="mailto:granespiritumexico@gmail.com">
                        Contáctanos directamente
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Contáctanos</h2>
            <p className="text-muted-foreground mb-6">
              ¿Quieres anunciar tus productos con nosotros? ¿Tienes una
              solicitud especial?
            </p>

            <div className="bg-card rounded-lg border p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-6">Envíanos un Mensaje</h2>
              <p className="text-muted-foreground mb-6">
                Completa el formulario y nos pondremos en contacto contigo lo
                antes posible.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                            <Input
                              placeholder="tucorreo@ejemplo.com"
                              {...field}
                            />
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
                          <FormLabel>
                            Teléfono{" "}
                            <span className="text-muted-foreground text-sm">
                              (opcional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu número de teléfono"
                              {...field}
                            />
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
                            <Input
                              placeholder="Asunto de tu mensaje"
                              {...field}
                            />
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

        {/* FAQ Section 
        <section className="mt-20">*/}
          {/*<Accordion type="single" collapsible className="max-w-3xl">
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
        </section>*/}
      </div>
    </div>
  );
}
