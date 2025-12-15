"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Edit, Globe, Heart, MapPin, MessageSquare, Settings, Share2 } from "lucide-react"
import TokyoImg from "@/public/trips/tokyo.jpg";
import BarcelonaImg from "@/public/trips/barcelona.jpg";
import MachuPichuImg from "@/public/trips/machu-pichu.jpg";

// Sample user data
const userData = {
  name: "John Doe",
  username: "traveljohn",
  bio: "Buscador de aventuras | Entusiasta de la fotografía | 25 países y contando",
  avatar: "https://api.dicebear.com/9.x/notionists/png?seed=john_doe",
  coverPhoto: MachuPichuImg.src,
  location: "San Francisco, CA",
  journalCount: 42,
  followers: 128,
  following: 97,
  countries: ["Spain", "Japan", "Brazil", "Greece", "Italy", "France", "Thailand", "Australia"],
  stats: {
    totalDistance: "87,432 km",
    countriesVisited: 25,
    citiesExplored: 78,
    journalsWritten: 42,
  },
  recentJournals: [
    {
      id: 1,
      title: "Verano en Barcelona",
      date: "June 15, 2023",
      location: "Barcelona, Spain",
      image: BarcelonaImg.src,
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "Aventuras en Tokio",
      date: "April 3, 2023",
      location: "Tokyo, Japan",
      image: TokyoImg.src,
      likes: 42,
      comments: 15,
    },
  ],
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("journals")

  return (
    <div>
      <div className="relative h-48 md:h-64 bg-gray-200 overflow-hidden">
        <img src={userData.coverPhoto || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-black bg-white rounded-full">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="mt-4 md:mt-0">
              <h1 className="text-3xl font-bold font-serif">{userData.name}</h1>
              <p className="text-muted-foreground">@{userData.username}</p>
              <div className="flex items-center mt-2 text-sm">
                <MapPin className="h-4 w-4 mr-1 text-amber-600" /> {userData.location}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Editar Perfil
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Share2 className="mr-2 h-4 w-4" /> Compartir Perfil
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-4">{userData.bio}</p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-amber-600" /> Se unió en enero de 2020
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-amber-600" /> {userData.stats.countriesVisited} países visitados
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{userData.journalCount}</div>
            <div className="text-sm text-muted-foreground">Bitácoras</div>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{userData.stats.countriesVisited}</div>
            <div className="text-sm text-muted-foreground">Países</div>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{userData.followers}</div>
            <div className="text-sm text-muted-foreground">Seguidores</div>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{userData.following}</div>
            <div className="text-sm text-muted-foreground">Siguiendo</div>
          </div>
        </div>

        <Tabs defaultValue="journals" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="journals">Bitácoras</TabsTrigger>
            <TabsTrigger value="map">Mapa de Viajes</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas de Viaje</TabsTrigger>
            <TabsTrigger value="saved">Guardadas</TabsTrigger>
          </TabsList>

          <TabsContent value="journals">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.recentJournals.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      src={journal.image || "/placeholder.svg"}
                      alt={journal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-amber-600" /> {journal.location}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3 mr-1" /> {journal.date}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 font-serif">{journal.title}</h3>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className="h-4 w-4" /> {journal.likes}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" /> {journal.comments}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-amber-600">
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 font-serif">Mi Mapa de Viajes</h2>
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative">
                {/* This would be replaced with an actual map component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    El mapa mundial interactivo con ubicaciones visitadas se mostraría aquí
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {userData.countries.map((country, index) => (
                  <div key={index} className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {country}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 font-serif">Estadísticas de Viaje</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Distancia Total Recorrida</span>
                    <span className="font-medium">{userData.stats.totalDistance}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Países Visitados</span>
                    <span className="font-medium">{userData.stats.countriesVisited}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Ciudades Exploradas</span>
                    <span className="font-medium">{userData.stats.citiesExplored}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Bitácoras Escritas</span>
                    <span className="font-medium">{userData.stats.journalsWritten}</span>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Regiones Más Visitadas</h3>
                  {/* This would be a chart in a real app */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Europa</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Asia</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>América del Norte</span>
                        <span>15%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>América del Sur</span>
                        <span>10%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Oceanía</span>
                        <span>5%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "5%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Aún No Hay Bitácoras Guardadas</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Cuando guardes bitácoras de otros viajeros, aparecerán aquí para fácil acceso
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700">Explorar Bitácoras</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
