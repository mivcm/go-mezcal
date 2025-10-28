"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const values = [
  {
    icon: "🌱",
    title: "Tradición",
    description:
      "Respetamos y buscamos mantener los métodos ancestrales de producción de destilado.",
  },
  {
    icon: "🤝",
    title: "Confianza",
    description:
      "Ofrecemos productos seleccionados que cumplen nuestros rigurosos estándares.",
  },
  {
    icon: "🌍",
    title: "Apoyo",
    description: "Fortalecemos los lazos con los productores.",
  },
  {
    icon: "✨",
    title: "Sevicio",
    description: "Compras fáciles y seguras.",
  },
];

const productFeatures = [
  {
    category: "Nuestra Misión",
    items: [
      "En Go.Mezcal, nuestra misión es ser el puente que conecta a los pequeños productores artesanales de Colima y alrededores con un mercado más amplio. Nos dedicamos a honrar y preservar las tradiciones de la región, ofreciendo una plataforma confiable y profesional que impulse su crecimiento y reconocimiento.",
    ],
  },
  {
    category: "Nuestra Visión",
    items: [
      "Ser la plataforma líder en la promoción y venta de productos artesanales y destilados de alta calidad, reconocidos por su autenticidad y el impacto positivo en las comunidades de Colima y sus alrededores.",
    ],
  },
];

const productionSteps = [
  {
    step: "Selección Cuidadosa",
    description:
      "No encontrarás una selección más cuidada de destilados y artesanías de la región.",
  },
  {
    step: "Transparencia Total",
    description: "Conoce la historia detrás de cada productor y producto.",
  },
  {
    step: "Envío Seguro y Local",
    description:
      "Nos encargamos de que tu pedido llegue en perfectas condiciones, apoyando la logística local.",
  },
];

export default function AboutPage() {
  const [activeTimelineItem, setActiveTimelineItem] = useState<number | null>(
    null
  );
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-10 px-4 text-center bg-gradient-to-b from-card to-background">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary animate-fade-in-up">
            Go Mezcal
          </h1>
          <div
            className="flex flex-wrap justify-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-5 space-y-10">
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Nuestra Historia y Propósito
            </h2>
            <p className="text-lg leading-relaxed text-foreground mb-6 text-justify">
              Nacimos de una profunda pasión por las raíces y la riqueza
              cultural de nuestra tierra. Observamos el talento, la dedicación y
              la maestría de los artesanos locales, pero también sus desafíos
              para llegar a un público más allá de sus comunidades.
            </p>
            <p className="text-lg leading-relaxed text-foreground mb-6 text-justify">
              Go.Mezcal surgió de la idea de crear un espacio donde nuestros
              artesanos puedan mostrar sus productos al mundo, asegurando que
              cada botella de destilado o pieza artesanal tenga la visibilidad
              que merece.
            </p>
            <p className="text-lg leading-relaxed text-foreground mb-6 text-justify">
              No somos solo un portal de ventas; somos un{" "}
              <strong>colectivo de apoyo</strong> que cree en el comercio justo,
              la calidad sin concesiones y el poder de las tradiciones.
            </p>
            <p className="text-lg leading-relaxed text-foreground mb-6 text-justify">
              Cada producto que encuentras en nuestra página cuenta una historia
              de esfuerzo, herencia y pasión.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="px-4 py-2">
                100% Artesanales
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                Agaves Seleccionados
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                Procesos Tradicionales
              </Badge>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
              <img
                src="/images/Nosotros.png"
                alt="Proceso tradicional de destilación de destilado"
                className="w-full h-full object-cover rounded-lg hover-lift"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Misión y Visión
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {productFeatures.map((feature, index) => (
              <Card
                key={index}
                className="hover-lift bg-card border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary">
                    {feature.category}
                  </h3>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center gap-2 text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Valores que nos definen
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className={`hover-lift cursor-pointer transition-all duration-300 border-0 shadow-lg ${
                  hoveredValue === index ? "bg-accent" : "bg-card"
                }`}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`text-4xl mb-4 ${
                      hoveredValue === index ? "animate-bounce-gentle" : ""
                    }`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            ¿Por qué elegirnos?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {productionSteps.map((step, index) => (
              <Card
                key={index}
                className="hover-lift bg-card border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-primary">
                      {step.step}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Commitment Section */}
        <section>
          <Card className="hover-lift bg-gradient-to-r from-card to-accent/10 border-0 shadow-lg">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Compromiso con la Calidad y la Comunidad
              </h2>
              <p className="text-lg leading-relaxed text-foreground mb-8 max-w-4xl mx-auto text-justify">
                <strong>Artesanal de Corazón:</strong> Cada producto en nuestro
                portal es seleccionado con rigurosidad. Trabajamos directamente
                con los productores para garantizar que cada destilado sea
                elaborado con métodos tradicionales y los más altos estándares
                de calidad. Nos enfocamos en la autenticidad, desde el cultivo
                del agave hasta el último proceso de embotellado, para que
                disfrutes de una experiencia genuina y memorable.
              </p>
              <p className="text-lg leading-relaxed text-foreground mb-8 max-w-4xl mx-auto text-justify">
                <strong>Impulso a la Economía Local:</strong> Creemos en el
                poder de la economía circular. Al comprar con nosotros, no solo
                adquieres un producto excepcional, sino que también contribuyes
                directamente al sustento de familias productoras de Colima y sus
                estados vecinos. Somos un negocio con responsabilidad social, y
                nuestro éxito se mide por el éxito de nuestros aliados.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <h4 className="font-semibold text-primary">
                    Impulso a la Economía Local
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Nuestro éxito se mide por el éxito de nuestros aliados
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <h4 className="font-semibold text-primary">
                    Artesanal de Corazón
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Nos enfocamos en la autenticidad
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <h4 className="font-semibold text-primary">Experiencia</h4>
                  <p className="text-sm text-muted-foreground">
                    Queremos que disfrutes de una experiencia genuina y
                    memorable
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
