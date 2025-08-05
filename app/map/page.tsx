"use client"

import { useState } from "react"
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

// Sample data for visited places
const visitedPlaces = [
  {
    id: 1,
    name: "Barcelona",
    country: "Spain",
    date: "June 2023",
    coordinates: { lat: 41.3851, lng: 2.1734 },
    journalCount: 3,
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    date: "April 2023",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    journalCount: 2,
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: 3,
    name: "Santorini",
    country: "Greece",
    date: "September 2022",
    coordinates: { lat: 36.3932, lng: 25.4615 },
    journalCount: 1,
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: 4,
    name: "New York City",
    country: "United States",
    date: "December 2022",
    coordinates: { lat: 40.7128, lng: -74.006 },
    journalCount: 2,
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: 5,
    name: "Bali",
    country: "Indonesia",
    date: "February 2023",
    coordinates: { lat: -8.3405, lng: 115.092 },
    journalCount: 1,
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: 6,
    name: "Cairo",
    country: "Egypt",
    date: "November 2022",
    coordinates: { lat: 30.0444, lng: 31.2357 },
    journalCount: 1,
    image: "/placeholder.svg?height=80&width=120",
  },
]

// Sample data for planned trips
const plannedTrips = [
  {
    id: 1,
    name: "Kyoto",
    country: "Japan",
    date: "March 2024",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: 2,
    name: "Machu Picchu",
    country: "Peru",
    date: "July 2024",
    coordinates: { lat: -13.1631, lng: -72.545 },
    image: "/placeholder.svg?height=80&width=120",
  },
]

// Sample travel stats
const travelStats = {
  countriesVisited: 12,
  citiesExplored: 28,
  totalDistance: "87,432 km",
  longestTrip: "21 days (Japan)",
  continents: ["Europe", "Asia", "North America", "Africa"],
}

export default function TravelMapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("visited")

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
                <div className="text-sm text-muted-foreground">{visitedPlaces.length} lugares</div>
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

              <div className="space-y-3">
                {visitedPlaces.map((place) => (
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
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" /> {place.date}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Badge variant="outline" className="bg-amber-50">
                        {place.journalCount} {place.journalCount === 1 ? "bitácora" : "bitácoras"}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MapPin className="h-4 w-4 text-amber-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="planned" className="p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">{plannedTrips.length} lugares</div>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Añadir Viaje
                </Button>
              </div>

              <div className="space-y-3">
                {plannedTrips.map((place) => (
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
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" /> {place.date}
                      </div>
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
            </TabsContent>

            <TabsContent value="wishlist" className="p-4 h-full">
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
            </TabsContent>
          </div>

          {activeTab === "visited" && (
            <div className="p-4 border-t">
              <h3 className="font-medium mb-3">Estadísticas de Viaje</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="text-muted-foreground">Países</div>
                  <div className="text-xl font-bold text-amber-600">{travelStats.countriesVisited}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="text-muted-foreground">Ciudades</div>
                  <div className="text-xl font-bold text-amber-600">{travelStats.citiesExplored}</div>
                </div>
                <div className="col-span-2 bg-amber-50 rounded-lg p-2">
                  <div className="text-muted-foreground">Distancia Total</div>
                  <div className="text-xl font-bold text-amber-600">{travelStats.totalDistance}</div>
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
                    <Switch id="show-visited" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-planned" className="text-sm cursor-pointer">
                      Viajes Planeados
                    </Label>
                    <Switch id="show-planned" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-wishlist" className="text-sm cursor-pointer">
                      Lista de Deseos
                    </Label>
                    <Switch id="show-wishlist" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-routes" className="text-sm cursor-pointer">
                      Rutas de Viaje
                    </Label>
                    <Switch id="show-routes" />
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
        <div className="h-full w-full bg-amber-50 relative">
          {/* This would be replaced with an actual map component */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Placeholder for the map */}
              <img
                src="/placeholder.svg?height=800&width=1200"
                alt="World Map"
                className="w-full h-full object-cover opacity-30"
              />

              {/* Simulated map markers */}
              <div
                className="absolute w-6 h-6 -ml-3 -mt-3 bg-amber-600 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:z-10 hover:scale-125 transition-transform"
                style={{ top: "40%", left: "48%" }}
                title="Barcelona, Spain"
              >
                <span className="text-white text-xs font-bold">3</span>
              </div>

              <div
                className="absolute w-5 h-5 -ml-2.5 -mt-2.5 bg-amber-600 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:z-10 hover:scale-125 transition-transform"
                style={{ top: "35%", left: "82%" }}
                title="Tokyo, Japan"
              >
                <span className="text-white text-xs font-bold">2</span>
              </div>

              <div
                className="absolute w-4 h-4 -ml-2 -mt-2 bg-amber-600 rounded-full border-2 border-white cursor-pointer hover:z-10 hover:scale-125 transition-transform"
                style={{ top: "42%", left: "54%" }}
                title="Santorini, Greece"
              ></div>

              <div
                className="absolute w-5 h-5 -ml-2.5 -mt-2.5 bg-amber-600 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:z-10 hover:scale-125 transition-transform"
                style={{ top: "38%", left: "25%" }}
                title="New York City, USA"
              >
                <span className="text-white text-xs font-bold">2</span>
              </div>

              <div
                className="absolute w-4 h-4 -ml-2 -mt-2 bg-amber-600 rounded-full border-2 border-white cursor-pointer hover:z-10 hover:scale-125 transition-transform"
                style={{ top: "55%", left: "78%" }}
                title="Bali, Indonesia"
              ></div>

              <div
                className="absolute w-4 h-4 -ml-2 -mt-2 bg-amber-600 rounded-full border-2 border-white cursor-pointer hover:z-10 hover:scale-125 transition-transform"
                style={{ top: "45%", left: "55%" }}
                title="Cairo, Egypt"
              ></div>

              {/* Planned trips markers */}
              <div
                className="absolute w-4 h-4 -ml-2 -mt-2 bg-blue-600 rounded-full border-2 border-white cursor-pointer hover:z-10 hover:scale-125 transition-transform"
                style={{ top: "36%", left: "81%" }}
                title="Kyoto, Japan"
              ></div>

              <div
                className="absolute w-4 h-4 -ml-2 -mt-2 bg-blue-600 rounded-full border-2 border-white cursor-pointer hover:z-10 hover:scale-125 transition-transform"
                style={{ top: "60%", left: "28%" }}
                title="Machu Picchu, Peru"
              ></div>

              {/* Simulated travel path */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25% 38% Q 35% 50%, 48% 40%"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                />
                <path
                  d="M48% 40% Q 55% 45%, 54% 42%"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                />
                <path
                  d="M54% 42% Q 65% 30%, 82% 35%"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button variant="outline" size="icon" className="bg-white h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="bg-white h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Place Button */}
          <Button className="absolute bottom-4 left-4 bg-amber-600 hover:bg-amber-700">
            <Flag className="mr-2 h-4 w-4" /> Añadir Lugar
          </Button>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md p-3 flex items-center gap-4">
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
    </div>
  )
}
