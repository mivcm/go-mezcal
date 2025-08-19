"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const values = [
  {
    icon: "🌱",
    title: "Tradición",
    description: "Respetamos y preservamos los métodos ancestrales de producción de mezcal.",
  },
  {
    icon: "🤝",
    title: "Comunidad",
    description: "Trabajamos directamente con productores locales para un comercio justo.",
  },
  {
    icon: "🌍",
    title: "Sostenibilidad",
    description: "Promovemos prácticas responsables y la reforestación de agaves.",
  },
  {
    icon: "✨",
    title: "Calidad",
    description: "Cada botella refleja la excelencia artesanal y el terroir único.",
  },
]

const productFeatures = [
  {
    category: "Características Sensoriales",
    items: ["Cristalino", "Complejo", "Persistencia olfativa"],
  },
  {
    category: "Características Aromáticas",
    items: ["Penca y ahumado", "Hierba húmeda", "Tierra húmeda"],
  },
  {
    category: "Impresiones Generales",
    items: ["Armonioso", "Con cuerpo", "Suavidad"],
  },
]

const productionSteps = [
  {
    step: "Jima",
    description: "Agaves maduros de 7 años quiotados",
  },
  {
    step: "Cocimiento",
    description: "En autoclave de acero inoxidable",
  },
  {
    step: "Molienda",
    description: "Extracción de jugo especializada",
  },
  {
    step: "Fermentación",
    description: "En tinas de acero",
  },
  {
    step: "Destilación",
    description: "Doble destilación en alambiques de acero inoxidable",
  },
  {
    step: "Control de Calidad",
    description: "Registros bajo frecuencias de inspección",
  },
]

export default function AboutPage() {
  const [activeTimelineItem, setActiveTimelineItem] = useState<number | null>(null)
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-10 px-4 text-center bg-gradient-to-b from-card to-background">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary animate-fade-in-up">Gran Espíritu</h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Inspirado en la leyenda de la diosa Mayahuel
          </p>
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              Agave Espadín 100%
            </Badge>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              Tolimán, Jalisco
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-16 space-y-10">
        <section className="animate-fade-in-up">
          <Card className="hover-lift bg-card border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Nuestra Historia</h2>
              <p className="text-lg leading-relaxed text-foreground">
                <strong>Gran Espíritu</strong> surge en el año 2016. La marca está inspirada en la leyenda de Mayahuel, una joven hermosa que tiene un romance
                prohibido con Quetzalcóatl. Y al ser descubiertos por su abuela Tzintzimith, la castiga y destruye.
                Quetzalcóatl recogió y enterró sus restos de los que brotó el maguey. De este maguey destilamos el <strong>Gran
                  Espíritu</strong> de Mayahuel.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className={`hover-lift cursor-pointer transition-all duration-300 border-0 shadow-lg ${hoveredValue === index ? "bg-accent" : "bg-card"
                  }`}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`text-4xl mb-4 ${hoveredValue === index ? "animate-bounce-gentle" : ""}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Gran Espíritu - Cata</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {productFeatures.map((feature, index) => (
              <Card key={index} className="hover-lift bg-card border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary">{feature.category}</h3>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-foreground">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Badge variant="outline" className="text-lg px-6 py-2">
              Doble destilación 40°
            </Badge>
          </div>
        </section>

        {/* Our Mezcal */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Nuestro Mezcal</h2>
            <p className="text-lg leading-relaxed text-foreground mb-6">
              Elaborado de manera artesanal, el mezcal Gran Espíritu destaca por su pureza, complejidad y notas únicas
              que reflejan el terroir de origen. Utilizamos agaves seleccionados y procesos tradicionales, desde la
              cocción en hornos de piedra hasta la destilación en alambiques de cobre o barro.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="px-4 py-2">
                100% Artesanal
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                Agaves Seleccionados
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                Proceso Tradicional
              </Badge>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
              <img
                src="/images/Nosotros.png"
                alt="Proceso tradicional de destilación de mezcal"
                className="w-full h-full object-cover rounded-lg hover-lift"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Producción</h2>

          <Card className="hover-lift bg-card border-0 shadow-lg mb-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-primary">50 Años de Experiencia</h3>
              <p className="text-lg text-foreground">
                Contamos con una experiencia de más de 50 años en la fabricación de mezcal.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {productionSteps.map((step, index) => (
              <Card key={index} className="hover-lift bg-card border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-primary">{step.step}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="">
            <Card className="hover-lift bg-card border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Capacidad Actual</h3>
                <div className="space-y-2 text-foreground">
                  <p>• 6,000 botellas mensuales (500 cajas)</p>
                  <p>• Taberna de 3,500 m²</p>
                  <p>• Envasadora y almacén de 5,000 m²</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Premios y Reconocimientos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-lift bg-gradient-to-br from-[#faf3ea] to-[#FFF7EC] border-yellow-100 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🥇</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Medalla de Oro</h3>
                <p className="text-lg font-medium text-yellow-700">Concurso Mundial de Bruselas</p>
                <p className="text-2xl font-bold text-yellow-800">2021</p>
              </CardContent>
            </Card>

            <Card className="hover-lift bg-gradient-to-br from-[#faf3ea] to-[#FFF7EC] border-yellow-100 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🥇</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Medalla de Oro</h3>
                <p className="text-lg font-medium text-yellow-700">Concurso Nacional de Marcas</p>
                <p className="text-2xl font-bold text-yellow-800">2019</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Commitment Section */}
        <section>
          <Card className="hover-lift bg-gradient-to-r from-card to-accent/10 border-0 shadow-lg">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Compromiso Social y Ambiental</h2>
              <p className="text-lg leading-relaxed text-foreground mb-8 max-w-4xl mx-auto">
                Trabajamos de la mano con comunidades mezcaleras, asegurando un comercio justo y fomentando la
                preservación de los saberes ancestrales. Además, promovemos la reforestación de agaves y el uso
                responsable de los recursos naturales, porque creemos que el verdadero espíritu del mezcal está en
                cuidar la tierra y a su gente.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <h4 className="font-semibold text-primary">Reforestación</h4>
                  <p className="text-sm text-muted-foreground">Plantamos 3 agaves por cada botella producida</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <h4 className="font-semibold text-primary">Comercio Justo</h4>
                  <p className="text-sm text-muted-foreground">Precios justos para productores locales</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <h4 className="font-semibold text-primary">Certificación</h4>
                  <p className="text-sm text-muted-foreground">Prácticas sostenibles certificadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
