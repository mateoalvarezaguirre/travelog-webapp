"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  ChevronDown,
  Filter,
  Flag,
  Globe,
  Heart,
  Info,
  Layers,
  MapPin,
  Plus,
  Search,
  Settings,
  Share2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { usePlaces } from "@/hooks/use-places"
import { useUserStats } from "@/hooks/use-profile"
import { MapView } from "@/components/map/map-view"
import type { MapConfig, MapMarker } from "@/lib/maps"

const mapConfig: MapConfig = {
  center: { lat: 20, lng: 0 },
  zoom: 2,
}

export default function TravelMapPage() {
  useEffect(() => { document.title = "Mapa de Viajes — Travelog" }, [])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("visited")
  const [showVisited, setShowVisited] = useState(true)
  const [showPlanned, setShowPlanned] = useState(true)
  const [showWishlist, setShowWishlist] = useState(true)

  const { visited, planned, wishlist, isLoading } = usePlaces()
  const { stats } = useUserStats()

  const mapMarkers: MapMarker[] = useMemo(() => {
    const markers: MapMarker[] = []
    if (showVisited) {
      visited.forEach(p => markers.push({
        id: String(p.id),
        position: p.coordinates,
        type: "visited",
        title: `${p.name}, ${p.country}`,
        label: p.journalCount ? String(p.journalCount) : undefined,
      }))
    }
    if (showPlanned) {
      planned.forEach(p => markers.push({
        id: String(p.id),
        position: p.coordinates,
        type: "planned",
        title: `${p.name}, ${p.country}`,
      }))
    }
    if (showWishlist) {
      wishlist.forEach(p => markers.push({
        id: String(p.id),
        position: p.coordinates,
        type: "wishlist",
        title: `${p.name}, ${p.country}`,
      }))
    }
    return markers
  }, [visited, planned, wishlist, showVisited, showPlanned, showWishlist])

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col w-80 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } absolute md:relative z-10 h-full`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-serif">Mi Mapa de Viajes</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
              aria-label="Cerrar barra lateral"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar lugares..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="visited" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="visited" className="flex-1">
                Visitados
              </TabsTrigger>
              <TabsTrigger value="planned" className="flex-1">
                Planeados
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex-1">
                Lista de Deseos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="visited" className="p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">{visited.length} lugares</div>
                <Select defaultValue="date-desc">
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Más recientes primero</SelectItem>
                    <SelectItem value="date-asc">Más antiguos primero</SelectItem>
                    <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                    <SelectItem value="country-asc">País (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : (
                <div className="space-y-3">
                  {visited.map((place) => (
                    <div
                      key={place.id}
                      className="flex gap-3 p-3 border rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={place.image || "/placeholder.svg"}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{place.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Globe className="h-3 w-3 mr-1" /> {place.country}
                        </div>
                        {place.date && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" /> {place.date}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        {place.journalCount != null && (
                          <Badge variant="outline" className="bg-amber-50">
                            {place.journalCount} {place.journalCount === 1 ? "bitácora" : "bitácoras"}
                          </Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MapPin className="h-4 w-4 text-amber-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="planned" className="p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">{planned.length} lugares</div>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Añadir Viaje
                </Button>
              </div>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : (
                <div className="space-y-3">
                  {planned.map((place) => (
                    <div
                      key={place.id}
                      className="flex gap-3 p-3 border rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={place.image || "/placeholder.svg"}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{place.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Globe className="h-3 w-3 mr-1" /> {place.country}
                        </div>
                        {place.date && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" /> {place.date}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Planeado
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="wishlist" className="p-4 h-full">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tu Lista de Deseos está Vacía</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Guarda lugares que te gustaría visitar en el futuro en tu lista de deseos
                  </p>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="h-4 w-4 mr-2" /> Añadir a Lista de Deseos
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((place) => (
                    <div
                      key={place.id}
                      className="flex gap-3 p-3 border rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={place.image || "/placeholder.svg"}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{place.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Globe className="h-3 w-3 mr-1" /> {place.country}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                          Deseo
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MapPin className="h-4 w-4 text-rose-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>

          {activeTab === "visited" && stats && (
            <div className="p-4 border-t">
              <h3 className="font-medium mb-3">Estadísticas de Viaje</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="text-muted-foreground">Países</div>
                  <div className="text-xl font-bold text-amber-600">{stats.countriesVisited}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="text-muted-foreground">Ciudades</div>
                  <div className="text-xl font-bold text-amber-600">{stats.citiesExplored}</div>
                </div>
                <div className="col-span-2 bg-amber-50 rounded-lg p-2">
                  <div className="text-muted-foreground">Distancia Total</div>
                  <div className="text-xl font-bold text-amber-600">{stats.totalDistance}</div>
                </div>
              </div>
            </div>
          )}
        </Tabs>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Map Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir barra lateral"
          >
            <ChevronDown className="h-4 w-4 rotate-90 mr-2" />
            Lugares
          </Button>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white">
                  <Layers className="h-4 w-4 mr-2" />
                  Capas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-visited" className="text-sm cursor-pointer">
                      Lugares Visitados
                    </Label>
                    <Switch id="show-visited" checked={showVisited} onCheckedChange={setShowVisited} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-planned" className="text-sm cursor-pointer">
                      Viajes Planeados
                    </Label>
                    <Switch id="show-planned" checked={showPlanned} onCheckedChange={setShowPlanned} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-wishlist" className="text-sm cursor-pointer">
                      Lista de Deseos
                    </Label>
                    <Switch id="show-wishlist" checked={showWishlist} onCheckedChange={setShowWishlist} />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>

            <Button variant="outline" size="sm" className="bg-white">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Map View */}
        <div className="h-full w-full">
          <MapView config={mapConfig} markers={mapMarkers} />
        </div>

        {/* Add Place Button */}
        <Button className="absolute bottom-4 left-4 bg-amber-600 hover:bg-amber-700 z-10">
          <Flag className="mr-2 h-4 w-4" /> Añadir Lugar
        </Button>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md p-3 flex items-center gap-4 z-10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
            <span className="text-xs">Visitados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-xs">Planeados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-600 rounded-full"></div>
            <span className="text-xs">Lista de Deseos</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
