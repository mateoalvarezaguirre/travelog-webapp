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

// Sample data for featured journals
const featuredJournals = [
  {
    id: 1,
    title: "Perdido en las Calles de Kioto",
    date: "May 12, 2023",
    location: "Kyoto, Japan",
    excerpt:
      "Vagando por las antiguas calles de Kioto, descubrí templos y jardines ocultos que parecían intocados por el tiempo...",
    image: "https://pixabay.com/get/g5e649639eb85ea082f4c2c948ebcd9f8c303f9aed819302220da1f714eccdae39439b9a904ea11413772cd04fa1b429ad79733ee877e4ab8111ea8003df7eac9_1280.jpg",
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
    image: "https://pixabay.com/get/g7d6e2dba79a2e2bfc66c11a3847d708223332cf37dfa2b27a819281682298e260b1de9e19f3811e1bd814eac3874416eb1e430c75c861531e2d43284fbee5b4c_1280.jpg",
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
    image: "https://pixabay.com/get/g5587c62caff50c59c7f911edae1092fefac4204b7b14d518cf7af166c5c642a869222d762d7a948960268f5dbaa7a85713fbe294863d88385f79d12b7d0b921f_1280.jpg",
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
    image: "https://pixabay.com/get/g13bc7816e754ed6b9016f471c8b0ce5df50238a124f9d248293132371bfb62f578b96b1acaf1e8578ef2f6c0cef9ecd9ff866f20dc14faf2bd34ee6ce0f115c4_1280.jpg",
    journalCount: 1243,
  },
  {
    id: 2,
    name: "Kyoto",
    country: "Japan",
    image: "https://pixabay.com/get/gc3fbd45842ba35fa10178a65cd03ce8e56ae5080a7c0d25eb5c993d497cc60e4d4aae012d982a1dd5fc0ca1e96f31b9cff7f7d5ff808d37b344ef612ed4aec41_1280.jpg",
    journalCount: 987,
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    image: "https://pixabay.com/get/g1408cc527e5ee3788ff6c2f3530421ee73ace37f8382bb74565c3605def4e9a98098d48ca671416a4931bf626bd3a4238e50ca3bd94c2ba11ef288646958e19d_1280.jpg",
    journalCount: 1876,
  },
  {
    id: 4,
    name: "Marrakech",
    country: "Morocco",
    image: "https://pixabay.com/get/g422890c366030c7c3656b65456d3b078aacd8adb20475242ffe1eac225c78881a821bda4421f1952e9795fcabf0901df8846c50507ac7aa255fa658b09d7990b_1280.jpg",
    journalCount: 756,
  },
  {
    id: 5,
    name: "Machu Picchu",
    country: "Peru",
    image: "https://pixabay.com/get/g930351a13fd6bebe939a7c34cad0f845e6c3ec7b90cf49445830f2e48476014041be9edabe390401c3c202a50554982513b9cfced5e233beeb617c8b399a0bdd_1280.jpg",
    journalCount: 1102,
  },
  {
    id: 6,
    name: "Venice",
    country: "Italy",
    image: "https://pixabay.com/get/gef957aa81e300a87a7302c807902960173de8a569bca784949f4fb07138df3de98f7d12acb60ac454b4f4904be53718987e5a7c23a09ec9019d7f6823d1c9f7e_1280.jpg",
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
                    src={featuredJournals[0].image || "/placeholder.svg"}
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
                        src={featuredJournals[0].author.avatar || "/placeholder.svg"}
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
                      src={journal.image || "/placeholder.svg"}
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
                        <AvatarImage src={journal.author.avatar || "/placeholder.svg"} alt={journal.author.name} />
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
                  src={destination.image || "/placeholder.svg"}
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
                      src="/placeholder.svg?height=48&width=48"
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
                      src="/placeholder.svg?height=48&width=48"
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
                      src="/placeholder.svg?height=48&width=48"
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
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
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
