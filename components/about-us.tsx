"use client"

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useSiteSettingsStore } from "@/hooks/use-site-settings-store"
import { useEffect } from "react"
import { Heart, Leaf, Users, Award, ArrowRight, Sparkles, Mountain, HandHeart, HeartHandshake, LeafyGreen, Medal } from "lucide-react"

export default function AboutUs() {
    const { getImage, currentImages } = useSiteSettingsStore()

    useEffect(() => {
        getImage("our_philosophy_image")
    }, [])

    const values = [
        {
            icon: Heart,
            title: "Pasión Ancestral",
            description: "Preservamos tradiciones milenarias con respeto y dedicación",
        },
        {
            icon: LeafyGreen,
            title: "Sostenibilidad",
            description: "Comprometidos con el medio ambiente y prácticas responsables",
        },
        {
            icon: HeartHandshake,
            title: "Comercio Justo",
            description: "Compensación justa para nuestros maestros mezcaleros",
        },
        {
            icon: Medal,
            title: "Calidad Premium",
            description: "Solo los mejores mezcales llegan a tu mesa",
        },
    ]

    return (
        <section className="relative py-20 bg-gradient-to-br from-stone-50 via-white to-amber-50/30 dark:from-stone-900 dark:via-stone-800 dark:to-amber-900/10 overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/10 to-orange-100/10 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Nuestra Historia
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Nuestra Filosofía
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Donde la tradición ancestral se encuentra con la pasión moderna
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                        <Card className="relative overflow-hidden border-0 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <Image
                                    src={
                                        currentImages.our_philosophy_image ||
                                        "https://images.pexels.com/photos/1209037/pexels-photo-1209037.jpeg" ||
                                        "/placeholder.svg"
                                    }
                                    alt="Maestro mezcalero trabajando con agave"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                                {/* Overlay decorativo */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Mountain className="h-4 w-4 text-amber-600" />
                                            <span>Destilado artesanal con espíritu colimense</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Nuestra Misión</span>
                            </div>

                            <p className="text-lg leading-relaxed text-muted-foreground">
                                En <span className="font-semibold text-amber-600">Go.mezcal</span>, creemos que cada botella cuenta una
                                historia única. Trabajamos directamente con familias productoras que han perfeccionado el arte del
                                mezcal durante generaciones, preservando técnicas ancestrales y el profundo respeto por el agave.
                            </p>

                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Nos comprometemos con la sostenibilidad ambiental y el comercio justo, asegurando que nuestros maestros
                                mezcaleros reciban una compensación justa por su extraordinario trabajo y conocimiento.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <Link href="/nosotros" className="flex items-center gap-2">
                                    Conoce Más Sobre Nosotros
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="space-y-12">
                    <div className="text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Nuestros Valores</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Los principios que guían cada decisión y cada botella que producimos
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <Card
                                    key={index}
                                    className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-stone-800"
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="mb-4 relative">
                                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Icon className="h-8 w-8 text-amber-600" />
                                            </div>
                                            <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <h4 className="font-semibold text-lg mb-2 group-hover:text-amber-600 transition-colors">
                                            {value.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="mt-20 text-center">
                    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-800/50">
                        <CardContent className="p-8 md:p-12">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Users className="h-5 w-5 text-amber-600" />
                                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
                                    Únete a Nuestra Familia
                                </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Descubre la Diferencia del Mezcal Auténtico</h3>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                Cada sorbo es un viaje a través de siglos de tradición, cuidadosamente preservada y compartida con amor.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                                >
                                    <Link href="/productos">Explorar Productos</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20 bg-transparent"
                                >
                                    <Link href="/contacto">Contáctanos</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
