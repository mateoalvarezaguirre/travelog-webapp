"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Edit, Globe, Heart, MapPin, MessageSquare, Settings, Share2 } from "lucide-react"
import { useProfile, useUserStats } from "@/hooks/use-profile"
import { useJournals } from "@/hooks/use-journals"
import { MapView } from "@/components/map/map-view"
import { usePlaces } from "@/hooks/use-places"
import type { MapConfig, MapMarker } from "@/lib/maps"

const mapConfig: MapConfig = {
  center: { lat: 20, lng: 0 },
  zoom: 2,
}

export default function ProfilePage() {
  const { profile, isLoading: profileLoading } = useProfile()

  useEffect(() => {
    if (profile) document.title = `${profile.name} — Travelog`
    else document.title = "Mi Perfil — Travelog"
  }, [profile])
  const { stats, isLoading: statsLoading } = useUserStats()
  const { journals, isLoading: journalsLoading } = useJournals()
  const { places } = usePlaces()

  const mapMarkers: MapMarker[] = places.map(p => ({
    id: String(p.id),
    position: p.coordinates,
    type: p.markerType,
    title: p.name,
    label: p.journalCount ? String(p.journalCount) : undefined,
  }))

  if (profileLoading) {
    return (
      <div>
        <div className="h-48 md:h-64 bg-gray-200 animate-pulse" />
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 mb-8 flex flex-col md:flex-row md:items-end gap-4">
            <div className="h-32 w-32 rounded-full bg-gray-300 animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">No se pudo cargar el perfil</p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative h-48 md:h-64 bg-gray-200 overflow-hidden">
        {profile.coverPhoto && (
          <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        )}
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-black bg-white rounded-full">
              <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="mt-4 md:mt-0">
              <h1 className="text-3xl font-bold font-serif">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.location && (
                <div className="flex items-center mt-2 text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-amber-600" /> {profile.location}
                </div>
              )}
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
          {profile.bio && <p className="mb-4">{profile.bio}</p>}

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-amber-600" /> Se unió en enero de 2020
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-amber-600" /> {profile.countriesVisited} países visitados
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{profile.journalCount}</div>
            <div className="text-sm text-muted-foreground">Bitácoras</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{profile.countriesVisited}</div>
            <div className="text-sm text-muted-foreground">Países</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{profile.followersCount}</div>
            <div className="text-sm text-muted-foreground">Seguidores</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{profile.followingCount}</div>
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
            {journalsLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando bitácoras...</p>
              </div>
            ) : journals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aún no has escrito bitácoras</p>
                <Link href="/create">
                  <Button className="bg-amber-600 hover:bg-amber-700">Crear tu primera bitácora</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journals.map((journal) => (
                  <div
                    key={journal.id}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                        <Calendar className="h-3 w-3 mr-1" /> {journal.date}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 font-serif">{journal.title}</h3>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart className="h-4 w-4" /> {journal.likesCount}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" /> {journal.commentsCount}
                          </span>
                        </div>
                        <Link href={`/journals/${journal.id}`}>
                          <Button variant="ghost" size="sm" className="text-amber-600">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 font-serif">Mi Mapa de Viajes</h2>
              <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                <MapView config={mapConfig} markers={mapMarkers} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 font-serif">Estadísticas de Viaje</h2>
              {statsLoading ? (
                <p className="text-muted-foreground">Cargando estadísticas...</p>
              ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Distancia Total Recorrida</span>
                      <span className="font-medium">{stats.totalDistance}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Países Visitados</span>
                      <span className="font-medium">{stats.countriesVisited}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Ciudades Exploradas</span>
                      <span className="font-medium">{stats.citiesExplored}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Bitácoras Escritas</span>
                      <span className="font-medium">{stats.journalsWritten}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Regiones Más Visitadas</h3>
                    <div className="space-y-3">
                      {stats.regions.map((region) => (
                        <div key={region.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{region.name}</span>
                            <span>{region.percentage}%</span>
                          </div>
                          <div className="w-full bg-amber-200 rounded-full h-2">
                            <div
                              className="bg-amber-600 h-2 rounded-full"
                              style={{ width: `${region.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay estadísticas disponibles</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Aún No Hay Bitácoras Guardadas</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Cuando guardes bitácoras de otros viajeros, aparecerán aquí para fácil acceso
              </p>
              <Link href="/explore">
                <Button className="bg-amber-600 hover:bg-amber-700">Explorar Bitácoras</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
