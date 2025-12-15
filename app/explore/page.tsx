"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Filter,
  Globe,
  Heart,
  MapPin,
  MessageSquare,
  Search,
  TrendingUp,
  Users,
  Compass,
  Bookmark,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import KyotoImg from "@/public/trips/kyoto.jpg";
import MachuPichuImg from "@/public/trips/machu-pichu.jpg";
import AfricaImg from "@/public/trips/africa.jpg";
import SantoriniImg from "@/public/trips/santorini.jpg";
import KyotoImage2 from "@/public/trips/kyoto-2.jpeg";
import BaliImg from "@/public/trips/bali.jpeg";
import MoroccoImg from "@/public/trips/morocco.jpeg";
import VeniceImg from "@/public/trips/venice.jpeg";

// Sample data for featured journals
const featuredJournals = [
  {
    id: 1,
    title: "Perdido en las Calles de Kioto",
    date: "May 12, 2023",
    location: "Kyoto, Japan",
    excerpt:
      "Vagando por las antiguas calles de Kioto, descubrí templos y jardines ocultos que parecían intocados por el tiempo...",
    image: KyotoImg.src,
    likes: 156,
    comments: 42,
    author: {
      name: "Emma Wilson",
      avatar: "https://api.dicebear.com/9.x/notionists/png?seed=emmawanders",
      username: "emmawanders",
    },
    tags: ["Japan", "Asia", "Culture", "History"],
  },
  {
    id: 2,
    title: "Caminando el Sendero Inca a Machu Picchu",
    date: "March 8, 2023",
    location: "Cusco, Peru",
    excerpt:
      "Cuatro días de terreno desafiante, vistas impresionantes y ruinas antiguas culminando con el amanecer sobre Machu Picchu...",
    image: MachuPichuImg.src,
    likes: 203,
    comments: 67,
    author: {
      name: "Carlos Mendoza",
      avatar: "https://api.dicebear.com/9.x/notionists/png?seed=carlostreks",
      username: "carlostreks",
    },
    tags: ["Peru", "South America", "Hiking", "Ancient Ruins"],
  },
  {
    id: 3,
    title: "Aventuras de Safari en el Serengeti",
    date: "April 22, 2023",
    location: "Serengeti National Park, Tanzania",
    excerpt:
      "Presenciar la gran migración a través de las llanuras del Serengeti fue una experiencia humillante que me conectó con el ritmo de la naturaleza...",
    image: AfricaImg.src,
    likes: 178,
    comments: 53,
    author: {
      name: "Aisha Okafor",
      avatar: "https://api.dicebear.com/9.x/notionists/png?seed=aishaadventures",
      username: "aishaadventures",
    },
    tags: ["Tanzania", "Africa", "Wildlife", "Safari"],
  },
]

// Sample data for popular destinations
const popularDestinations = [
  {
    id: 1,
    name: "Santorini",
    country: "Greece",
    image: SantoriniImg.src,
    journalCount: 1243,
  },
  {
    id: 2,
    name: "Kyoto",
    country: "Japan",
    image: KyotoImage2.src,
    journalCount: 987,
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    image: BaliImg.src,
    journalCount: 1876,
  },
  {
    id: 4,
    name: "Marrakech",
    country: "Morocco",
    image: MoroccoImg.src,
    journalCount: 756,
  },
  {
    id: 5,
    name: "Machu Picchu",
    country: "Peru",
    image: MachuPichuImg.src,
    journalCount: 1102,
  },
  {
    id: 6,
    name: "Venice",
    country: "Italy",
    image: VeniceImg.src,
    journalCount: 1543,
  },
]

// Sample data for trending topics
const trendingTopics = [
  "Viaje Solo",
  "Turismo Sostenible",
  "Aventuras Gastronómicas",
  "Joyas Ocultas",
  "Inmersión Cultural",
  "Deportes de Aventura",
  "Viajes por Carretera",
  "Salto de Islas",
  "Sitios Históricos",
  "Encuentros con Vida Silvestre",
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">Explorar</h1>
          <p className="text-muted-foreground">Descubre increíbles bitácoras de viaje y encuentra tu próximo destino</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar destinos, temas o usuarios..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="south-america">South America</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Más Filtros
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.slice(0, 6).map((topic, index) => (
            <Badge key={index} variant="outline" className="bg-white hover:bg-amber-100 cursor-pointer">
              {topic}
            </Badge>
          ))}
          <Badge variant="outline" className="bg-white hover:bg-amber-100 cursor-pointer">
            + Más
          </Badge>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="featured" className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="featured">Destacados</TabsTrigger>
          <TabsTrigger value="trending">Tendencias</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="following">Siguiendo</TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Journal - Large Card */}
            <div className="lg:col-span-2 group">
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[16/9]">
                  <img
                    src={featuredJournals[0].image || "/placeholder.png"}
                    alt={featuredJournals[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-amber-600 hover:bg-amber-700">Destacados</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {featuredJournals[0].location}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={featuredJournals[0].author.avatar || "/placeholder.png"}
                        alt={featuredJournals[0].author.name}
                      />
                      <AvatarFallback>{featuredJournals[0].author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/profile/${featuredJournals[0].author.username}`}
                        className="text-sm font-medium hover:text-amber-600"
                      >
                        {featuredJournals[0].author.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{featuredJournals[0].date}</div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold font-serif mb-3">{featuredJournals[0].title}</h2>
                  <p className="text-muted-foreground mb-4">{featuredJournals[0].excerpt}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredJournals[0].tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-amber-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" /> {featuredJournals[0].likes}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" /> {featuredJournals[0].comments}
                      </span>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700">Leer Bitácora</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Featured Journals - Smaller Cards */}
            <div className="space-y-6">
              {featuredJournals.slice(1, 3).map((journal) => (
                <div
                  key={journal.id}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video">
                    <img
                      src={journal.image || "/placeholder.png"}
                      alt={journal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {journal.location}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={journal.author.avatar || "/placeholder.png"} alt={journal.author.name} />
                        <AvatarFallback>{journal.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-xs">
                        <Link href={`/profile/${journal.author.username}`} className="font-medium hover:text-amber-600">
                          {journal.author.name}
                        </Link>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-serif mb-2 line-clamp-1">{journal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{journal.excerpt}</p>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" /> {journal.likes}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" /> {journal.comments}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-amber-600">
                        Leer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Bitácoras en Tendencia</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Descubre lo que es popular ahora mismo en la comunidad de viajeros
            </p>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Bitácoras Recientes</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Las últimas bitácoras de viaje de todo el mundo</p>
          </div>
        </TabsContent>

        <TabsContent value="following">
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Siguiendo</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Las bitácoras de viajeros que sigues aparecerán aquí
            </p>
            <Button className="mt-4 bg-amber-600 hover:bg-amber-700">Encontrar Viajeros para Seguir</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Popular Destinations Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif">Destinos Populares</h2>
          <Button variant="ghost" className="text-amber-600">
            Ver Todo
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((destination) => (
            <div key={destination.id} className="group relative rounded-xl overflow-hidden cursor-pointer">
              <div className="aspect-square">
                <img
                  src={destination.image || "/placeholder.png"}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-3">
                <h3 className="text-white font-medium">{destination.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">{destination.country}</span>
                  <span className="text-white/80 text-xs">{destination.journalCount} bitácoras</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* World Map Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif">Explorar el Mundo</h2>
          <Button variant="ghost" className="text-amber-600">
            Vista Completa del Mapa
          </Button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="aspect-[21/9] bg-amber-50 relative">
            {/* This would be replaced with an actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-16 w-16 mx-auto text-amber-600 mb-4" />
                <p className="text-muted-foreground mb-4">Mapa mundial interactivo con destinos populares</p>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Compass className="mr-2 h-4 w-4" /> Explorar Mapa
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Inspiration Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif">Inspiración de Viaje</h2>
          <Button variant="ghost" className="text-amber-600">
            Más Ideas
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold font-serif mb-3">Temas en Tendencia</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {trendingTopics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="bg-amber-50 hover:bg-amber-100 cursor-pointer">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold font-serif mb-3">Favoritos de Temporada</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.png?height=48&width=48"
                      alt="Cherry blossoms in Japan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Temporada de Flores de Cerezo</h4>
                    <p className="text-sm text-muted-foreground">Japón - Marzo a Abril</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.png?height=48&width=48"
                      alt="Northern Lights"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Aurora Boreal</h4>
                    <p className="text-sm text-muted-foreground">Islandia - Septiembre a Marzo</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.png?height=48&width=48"
                      alt="Autumn in New England"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Follaje de Otoño</h4>
                    <p className="text-sm text-muted-foreground">Nueva Inglaterra - Septiembre a Octubre</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl overflow-hidden shadow-sm text-white">
            <div className="p-6">
              <h3 className="text-xl font-bold font-serif mb-3">Únete a Nuestra Comunidad</h3>
              <p className="mb-4">
                Conéctate con otros viajeros, comparte tus experiencias y descubre nuevos destinos juntos.
              </p>
              <div className="flex gap-3 mb-4">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/placeholder.png?height=32&width=32" alt="User" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/placeholder.png?height=32&width=32" alt="User" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/placeholder.png?height=32&width=32" alt="User" />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs">+2.5k</div>
              </div>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-amber-600">
                Únete Ahora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-amber-50 border border-amber-100 rounded-xl p-8 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-serif mb-3">Recibe Inspiración de Viaje en tu Bandeja de Entrada</h2>
          <p className="text-muted-foreground mb-6">
            Regístrate en nuestro boletín para recibir bitácoras de viaje seleccionadas, guías de destinos y ofertas
            exclusivas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input type="email" placeholder="Ingresa tu correo electrónico" className="flex-grow" />
            <Button className="bg-amber-600 hover:bg-amber-700 whitespace-nowrap">Suscribirse</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
