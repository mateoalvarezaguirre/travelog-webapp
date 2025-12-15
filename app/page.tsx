"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  PenLine,
  Share2,
  Clock,
  Heart,
  MessageSquare,
  Compass,
  Star,
  Users,
  Globe,
  Camera,
  Sparkles,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

//get images from public /trips folder
import MachuPichu from "@/public/trips/machu-pichu.jpg";
import Tokyo from "@/public/trips/tokyo.jpg";
import Africa from "@/public/trips/africa.jpg";
import Santorini from "@/public/trips/santorini.jpg";

// Sample journal cards data
var journalCards = [
  {
    id: 1,
    author: {
      name: "Sofia Aventurera",
      avatar: "https://api.dicebear.com/9.x/notionists/png?seed=sofia_travels",
      username: "sofia_travels",
    },
    title: "Amanecer en Machu Picchu",
    location: "Cusco, Perú",
    time: "Hace 2 horas",
    content:
      "Después de 4 días caminando el sendero inca, finalmente llegamos. Las primeras luces del amanecer iluminando estas ruinas milenarias... no hay palabras para describir esta emoción. 🌅",
    image: MachuPichu.src,
    likes: 127,
    comments: 23,
    gradient: "from-orange-400 to-pink-500",
    status: "En vivo",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    author: {
      name: "Marco Explorador",
      avatar: "https://api.dicebear.com/9.x/notionists/png?seed=marco_wanders",
      username: "marco_wanders",
    },
    title: "Noche Mágica en Santorini",
    location: "Oia, Grecia",
    time: "Hace 1 día",
    content:
      "Las casas blancas brillando bajo la luna llena, el mar Egeo susurrando secretos antiguos... Santorini de noche es pura magia. Cada rincón cuenta una historia. ✨",
    image: Santorini.src,
    likes: 89,
    comments: 15,
    gradient: "from-blue-400 to-purple-500",
    status: "Trending",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    author: {
      name: "Ana Viajera",
      avatar: "https://api.dicebear.com/9.x/notionists/png?seed=ana_discovers",
      username: "ana_discovers",
    },
    title: "Safari en el Serengeti",
    location: "Tanzania, África",
    time: "Hace 3 días",
    content:
      "Ver a los leones en su hábitat natural fue indescriptible. La gran migración está en su punto máximo y pudimos presenciar este espectáculo único de la naturaleza. 🦁",
    image: Africa.src,
    likes: 156,
    comments: 31,
    gradient: "from-yellow-400 to-red-500",
    status: "Popular",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 4,
    author: {
      name: "Carlos Aventuras",
      avatar: "https://api.dicebear.com/9.x/notionists/png?seed=carlos_roams",
      username: "carlos_roams",
    },
    title: "Templos de Kioto al Amanecer",
    location: "Kioto, Japón",
    time: "Hace 1 semana",
    content:
      "Caminar por los senderos de bambú mientras el sol se filtra entre las hojas... Kioto tiene una energía especial que te conecta con siglos de historia y tradición. 🎋",
    image: Tokyo.src,
    likes: 203,
    comments: 42,
    gradient: "from-green-400 to-teal-500",
    status: "Destacado",
    statusColor: "bg-emerald-100 text-emerald-800",
  },
]

const API_KEY = "12588265-86c13fc3629bd8729dadccbe1";

export default function Home() {
  const [currentCard, setCurrentCard] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isDragging) return

    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % journalCards.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, isDragging])

  // Handle manual navigation
  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % journalCards.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10s
  }

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + journalCards.length) % journalCards.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setDragOffset({ x: 0, y: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        prevCard()
      } else {
        nextCard()
      }
    }

    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
    setDragOffset({ x: 0, y: 0 })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        prevCard()
      } else {
        nextCard()
      }
    }

    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-400"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-orange-400"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-red-400"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-yellow-400"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                ¡Más de 10,000 viajeros ya documentan sus aventuras!
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif leading-tight">
                Tus{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  aventuras
                </span>{" "}
                merecen ser{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                  recordadas
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Convierte cada viaje en una historia inolvidable. Captura momentos, mapea tus rutas y revive tus
                aventuras con un toque de nostalgia que solo <strong>Travelog</strong> puede ofrecer.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <PenLine className="mr-2 h-5 w-5" />
                  Comenzar mi Primera Bitácora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg font-semibold"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Ver Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                  </div>
                  <span>+10k viajeros activos</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span>4.9/5 estrellas</span>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Card Carousel */}
            <div className="relative">
              <div
                ref={carouselRef}
                className="relative w-full h-[500px] cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {journalCards.map((card, index) => {
                  const isActive = index === currentCard
                  const isPrev = index === (currentCard - 1 + journalCards.length) % journalCards.length
                  const isNext = index === (currentCard + 1) % journalCards.length

                  let transform = ""
                  let zIndex = 0
                  let opacity = 0

                  if (isActive) {
                    transform = `translate(${dragOffset.x * 0.1}px, ${dragOffset.y * 0.1}px) rotate(${dragOffset.x * 0.02}deg) scale(1)`
                    zIndex = 30
                    opacity = 1
                  } else if (isPrev) {
                    transform = "translateX(-20px) translateY(10px) rotate(-2deg) scale(0.95)"
                    zIndex = 20
                    opacity = 0.7
                  } else if (isNext) {
                    transform = "translateX(20px) translateY(10px) rotate(2deg) scale(0.95)"
                    zIndex = 20
                    opacity = 0.7
                  } else {
                    transform = `translateX(${(index - currentCard) * 30}px) translateY(${Math.abs(index - currentCard) * 15}px) rotate(${(index - currentCard) * 3}deg) scale(${0.9 - Math.abs(index - currentCard) * 0.05})`
                    zIndex = 10 - Math.abs(index - currentCard)
                    opacity = Math.max(0.3, 1 - Math.abs(index - currentCard) * 0.2)
                  }

                  return (
                    <div
                      key={card.id}
                      className="absolute inset-0 transition-all duration-500 ease-out"
                      style={{
                        transform,
                        zIndex,
                        opacity,
                      }}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl p-6 h-full overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarImage src={card.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {card.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold truncate">{card.author.name}</p>
                              <p className="text-sm text-gray-500 truncate">{card.time}</p>
                            </div>
                          </div>
                          <Badge className={`${card.statusColor} flex-shrink-0 ml-2`}>{card.status}</Badge>
                        </div>

                        <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 line-clamp-2 flex-shrink-0">
                          {card.title}
                        </h3>

                        <div
                          className={`aspect-video bg-gradient-to-br ${card.gradient} rounded-xl mb-4 relative overflow-hidden flex-shrink-0`}
                        >
                          <img
                            src={card.image || "/placeholder.svg"}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center max-w-[calc(100%-24px)]">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{card.location}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1 text-sm md:text-base leading-relaxed">
                          {card.content}
                        </p>

                        <div className="flex items-center justify-between pt-2 flex-shrink-0">
                          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                            <button className="flex items-center gap-1 text-red-500 flex-shrink-0">
                              <Heart className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">{card.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-gray-600 flex-shrink-0">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm">{card.comments}</span>
                            </button>
                            <button className="flex items-center gap-1 text-gray-600 min-w-0">
                              <Share2 className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm truncate">Compartir</span>
                            </button>
                          </div>
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 flex-shrink-0 ml-2 text-xs md:text-sm"
                          >
                            Leer más
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Navigation Controls */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-white/80 hover:bg-white"
                  onClick={prevCard}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-2">
                  {journalCards.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentCard ? "bg-amber-600 w-6" : "bg-gray-300"
                      }`}
                      onClick={() => {
                        setCurrentCard(index)
                        setIsAutoPlaying(false)
                        setTimeout(() => setIsAutoPlaying(true), 10000)
                      }}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-white/80 hover:bg-white"
                  onClick={nextCard}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce">
                <Camera className="w-6 h-6 text-amber-600" />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-3 shadow-lg">
                <Globe className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Características que Enamoran
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              Todo lo que necesitas para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                documentar
              </span>{" "}
              tus aventuras
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde la primera foto hasta el último recuerdo, Travelog te acompaña en cada paso de tu viaje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenLine className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Editor Intuitivo</h3>
              <p className="text-gray-600 mb-6">
                Escribe tus experiencias con nuestro editor rico en funciones. Añade fotos, mapas y emociones con solo
                unos clics.
              </p>
              <div className="flex items-center text-amber-600 font-medium">
                <span>Comenzar a escribir</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Mapas Interactivos</h3>
              <p className="text-gray-600 mb-6">
                Visualiza tu ruta de viaje en mapas interactivos. Marca tus lugares favoritos y revive cada momento.
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>Explorar mapas</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Comparte Fácilmente</h3>
              <p className="text-gray-600 mb-6">
                Comparte tus aventuras con amigos y familia. Crea enlaces únicos o publica en redes sociales.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Compartir ahora</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Comunidad Viajera</h3>
              <p className="text-gray-600 mb-6">
                Conecta con otros viajeros, descubre nuevos destinos y encuentra inspiración para tu próxima aventura.
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                <span>Unirse a la comunidad</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-red-400 to-rose-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Acceso Sin Conexión</h3>
              <p className="text-gray-600 mb-6">
                Escribe y lee tus bitácoras incluso sin internet. Perfecto para esos lugares remotos y mágicos.
              </p>
              <div className="flex items-center text-red-600 font-medium">
                <span>Probar offline</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Recuerdos Eternos</h3>
              <p className="text-gray-600 mb-6">
                Tus bitácoras se conservan para siempre con nuestro diseño nostálgico que hace que cada recuerdo sea
                especial.
              </p>
              <div className="flex items-center text-yellow-600 font-medium">
                <span>Crear recuerdos</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
              <Users className="w-4 h-4 mr-2" />
              Historias Reales
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              Lo que dicen nuestros{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                viajeros
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Travelog transformó completamente cómo documento mis viajes. Ahora cada aventura se convierte en una
                historia que puedo revivir una y otra vez. ¡Es como tener un diario mágico!"
              </p>
              <div className="flex items-center">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">María Carmen</p>
                  <p className="text-sm text-gray-500">Viajera por 15 países</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "La función de mapas es increíble. Puedo ver exactamente dónde estuve y revivir cada momento. Mis amigos
                siempre me piden que les muestre mis bitácoras porque son súper visuales."
              </p>
              <div className="flex items-center">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Alejandro Ruiz</p>
                  <p className="text-sm text-gray-500">Fotógrafo de viajes</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Como blogger de viajes, he probado muchas apps, pero Travelog tiene esa magia especial. El diseño
                nostálgico hace que cada entrada se sienta como una carta de amor a mis aventuras."
              </p>
              <div className="flex items-center">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Lucía González</p>
                  <p className="text-sm text-gray-500">Blogger de viajes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-white"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-32 right-1/3 w-28 h-28 rounded-full bg-white"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold font-serif mb-6">Tu próxima aventura te está esperando</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Únete a miles de viajeros que ya están creando recuerdos inolvidables.
            <strong> Es gratis</strong> y puedes empezar ahora mismo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <PenLine className="mr-2 h-5 w-5" />
              Crear mi Primera Bitácora Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 text-lg font-semibold"
            >
              <Compass className="mr-2 h-5 w-5" />
              Explorar Ejemplos
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Gratis para siempre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Comienza en 30 segundos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">10K+</div>
              <div className="text-gray-600">Viajeros Activos</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600">Bitácoras Creadas</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">120+</div>
              <div className="text-gray-600">Países Documentados</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">4.9★</div>
              <div className="text-gray-600">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
