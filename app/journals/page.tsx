"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Filter, Heart, MapPin, MessageSquare, Plus, Search, Share2 } from "lucide-react"
import { useJournals } from "@/hooks/use-journals"
import { Pagination } from "@/components/pagination"
import { useDebounce } from "@/hooks/use-debounce"

export default function JournalsPage() {
  useEffect(() => { document.title = "Mis Bitácoras — Travelog" }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { journals, meta, isLoading, error } = useJournals({
    page,
    search: debouncedSearch || undefined,
    tab: activeTab !== "all" ? activeTab : undefined,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">Mis Bitácoras de Viaje</h1>
          <p className="text-muted-foreground">Revive tus aventuras y crea nuevos recuerdos</p>
        </div>
        <Link href="/create">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="mr-2 h-4 w-4" /> Nueva Bitácora
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar bitácoras..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filtrar
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todas las Bitácoras</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="favorites">Favoritas</TabsTrigger>
          <TabsTrigger value="shared">Compartidas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Cargando bitácoras...</p>
            </div>
          )}
          {error && (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {!isLoading && !error && journals.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No se encontraron bitácoras</p>
              <Link href="/create">
                <Button className="mt-4 bg-amber-600 hover:bg-amber-700">
                  <Plus className="mr-2 h-4 w-4" /> Crear tu primera bitácora
                </Button>
              </Link>
            </div>
          )}
          {journals.map((journal) => (
            <div
              key={journal.id}
              className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={journal.images[0]?.url || "/placeholder.svg"}
                  alt={journal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                    <Heart className={`h-4 w-4 ${journal.isLiked ? "fill-amber-600 text-amber-600" : "text-amber-600"}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                    <Share2 className="h-4 w-4 text-amber-600" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-amber-600" /> {journal.location}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Clock className="h-3 w-3 mr-1" /> {journal.date}
                </div>
                <h3 className="text-xl font-semibold mb-2 font-serif">{journal.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{journal.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4" /> {journal.likesCount}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" /> {journal.commentsCount}
                    </span>
                  </div>
                  <Link href={`/journals/${journal.id}`} className="text-sm text-amber-600 font-medium">
                    Leer Más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Cargando...</p>
              </div>
            )}
            {!isLoading && journals.length === 0 && (
              <div className="col-span-full text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Bitácoras Recientes</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Tus bitácoras de viaje más recientes aparecerán aquí
                </p>
              </div>
            )}
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative">
                  <img
                    src={journal.images[0]?.url || "/placeholder.svg"}
                    alt={journal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-amber-600" /> {journal.location}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Clock className="h-3 w-3 mr-1" /> {journal.date}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 font-serif">{journal.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{journal.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" /> {journal.likesCount}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" /> {journal.commentsCount}
                      </span>
                    </div>
                    <Link href={`/journals/${journal.id}`} className="text-sm text-amber-600 font-medium">
                      Leer Más
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Cargando...</p>
              </div>
            )}
            {!isLoading && journals.length === 0 && (
              <div className="col-span-full text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Bitácoras Favoritas</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Las bitácoras que has marcado como favoritas aparecerán aquí
                </p>
              </div>
            )}
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative">
                  <img
                    src={journal.images[0]?.url || "/placeholder.svg"}
                    alt={journal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-amber-600" /> {journal.location}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 font-serif">{journal.title}</h3>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" /> {journal.likesCount}
                      </span>
                    </div>
                    <Link href={`/journals/${journal.id}`} className="text-sm text-amber-600 font-medium">
                      Leer Más
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shared">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Cargando...</p>
              </div>
            )}
            {!isLoading && journals.length === 0 && (
              <div className="col-span-full text-center py-8">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Bitácoras Compartidas</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Las bitácoras que has compartido con otros aparecerán aquí
                </p>
              </div>
            )}
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative">
                  <img
                    src={journal.images[0]?.url || "/placeholder.svg"}
                    alt={journal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-amber-600" /> {journal.location}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 font-serif">{journal.title}</h3>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" /> {journal.likesCount}
                      </span>
                    </div>
                    <Link href={`/journals/${journal.id}`} className="text-sm text-amber-600 font-medium">
                      Leer Más
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {meta && (
          <Pagination
            currentPage={meta.currentPage}
            lastPage={meta.lastPage}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </Tabs>
    </div>
  )
}
