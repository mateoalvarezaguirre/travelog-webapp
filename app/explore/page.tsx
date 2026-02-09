"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
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
import { useExplore } from "@/hooks/use-explore"
import { Pagination } from "@/components/pagination"
import { useDebounce } from "@/hooks/use-debounce"
import { MapView } from "@/components/map/map-view"
import type { MapConfig } from "@/lib/maps"

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

const worldMapConfig: MapConfig = {
  center: { lat: 20, lng: 0 },
  zoom: 2,
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  )
}

function ExploreContent() {
  const searchParams = useSearchParams()

  useEffect(() => { document.title = "Explorar — Travelog" }, [])

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [activeTab, setActiveTab] = useState("featured")
  const [destination, setDestination] = useState<string>()
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { journals, meta, isLoading, error } = useExplore({
    page,
    search: debouncedSearch || undefined,
    tab: activeTab,
    destination,
  })

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
            <Select onValueChange={setDestination}>
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
      <Tabs defaultValue="featured" className="mb-10" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="featured">Destacados</TabsTrigger>
          <TabsTrigger value="trending">Tendencias</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="following">Siguiendo</TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando bitácoras destacadas...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {!isLoading && !error && journals.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Journal - Large Card */}
              <div className="lg:col-span-2 group">
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-[16/9]">
                    <img
                      src={journals[0].images[0]?.url || "/placeholder.svg"}
                      alt={journals[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-amber-600 hover:bg-amber-700">Destacados</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> {journals[0].location}
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
                          src={journals[0].author.avatar || undefined}
                          alt={journals[0].author.name}
                        />
                        <AvatarFallback>{journals[0].author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/profile/${journals[0].author.username}`}
                          className="text-sm font-medium hover:text-amber-600"
                        >
                          {journals[0].author.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">{journals[0].date}</div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold font-serif mb-3">{journals[0].title}</h2>
                    <p className="text-muted-foreground mb-4">{journals[0].excerpt}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {journals[0].tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-amber-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className="h-4 w-4" /> {journals[0].likesCount}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" /> {journals[0].commentsCount}
                        </span>
                      </div>
                      <Link href={`/journals/${journals[0].id}`}>
                        <Button className="bg-amber-600 hover:bg-amber-700">Leer Bitácora</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Featured Journals - Smaller Cards */}
              <div className="space-y-6">
                {journals.slice(1, 3).map((journal) => (
                  <div
                    key={journal.id}
                    className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={journal.images[0]?.url || "/placeholder.svg"}
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
                          <AvatarImage src={journal.author.avatar || undefined} alt={journal.author.name} />
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
                            <Heart className="h-3 w-3" /> {journal.likesCount}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" /> {journal.commentsCount}
                          </span>
                        </div>
                        <Link href={`/journals/${journal.id}`}>
                          <Button variant="ghost" size="sm" className="text-amber-600">
                            Leer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isLoading && !error && journals.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No hay bitácoras destacadas</h3>
              <p className="text-muted-foreground">Vuelve pronto para descubrir nuevas historias de viaje</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          ) : journals.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Bitácoras en Tendencia</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Descubre lo que es popular ahora mismo en la comunidad de viajeros
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journals.map((journal) => (
                <div key={journal.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    <img src={journal.images[0]?.url || "/placeholder.svg"} alt={journal.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {journal.location}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold font-serif mb-2">{journal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{journal.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" /> {journal.likesCount}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" /> {journal.commentsCount}
                        </span>
                      </div>
                      <Link href={`/journals/${journal.id}`}>
                        <Button variant="ghost" size="sm" className="text-amber-600">Leer</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          ) : journals.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Bitácoras Recientes</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Las últimas bitácoras de viaje de todo el mundo</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journals.map((journal) => (
                <div key={journal.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    <img src={journal.images[0]?.url || "/placeholder.svg"} alt={journal.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {journal.location}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold font-serif mb-2">{journal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{journal.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" /> {journal.likesCount}
                        </span>
                      </div>
                      <Link href={`/journals/${journal.id}`}>
                        <Button variant="ghost" size="sm" className="text-amber-600">Leer</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="following">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          ) : journals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Siguiendo</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Las bitácoras de viajeros que sigues aparecerán aquí
              </p>
              <Button className="mt-4 bg-amber-600 hover:bg-amber-700">Encontrar Viajeros para Seguir</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journals.map((journal) => (
                <div key={journal.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    <img src={journal.images[0]?.url || "/placeholder.svg"} alt={journal.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={journal.author.avatar || undefined} alt={journal.author.name} />
                        <AvatarFallback>{journal.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{journal.author.name}</span>
                    </div>
                    <h3 className="text-lg font-bold font-serif mb-2">{journal.title}</h3>
                    <Link href={`/journals/${journal.id}`}>
                      <Button variant="ghost" size="sm" className="text-amber-600">Leer</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {meta && (
          <Pagination
            currentPage={meta.currentPage}
            lastPage={meta.lastPage}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </Tabs>

      {/* World Map Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif">Explorar el Mundo</h2>
          <Link href="/map">
            <Button variant="ghost" className="text-amber-600">
              Vista Completa del Mapa
            </Button>
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="aspect-[21/9]">
            <MapView config={worldMapConfig} />
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
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-amber-50 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Temporada de Flores de Cerezo</h4>
                    <p className="text-sm text-muted-foreground">Japón - Marzo a Abril</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-amber-50 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Aurora Boreal</h4>
                    <p className="text-sm text-muted-foreground">Islandia - Septiembre a Marzo</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-amber-50 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-amber-600" />
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
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs">+2.5k</div>
              </div>
              <Link href="/register">
                <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-amber-600">
                  Únete Ahora
                </Button>
              </Link>
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
