"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Search } from "lucide-react"
import { MapView } from "./map-view"
import type { LatLng } from "@/types"
import type { MapConfig, MapMarker, MapEventHandlers } from "@/lib/maps"

interface LocationPickerProps {
  value?: { address: string; coordinates: LatLng }
  onChange: (value: { address: string; coordinates: LatLng }) => void
}

const DEFAULT_CENTER: LatLng = { lat: 20, lng: 0 }
const DEFAULT_ZOOM = 2

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [searchInput, setSearchInput] = useState(value?.address || "")
  const [isSearching, setIsSearching] = useState(false)
  const [marker, setMarker] = useState<MapMarker | null>(
    value?.coordinates
      ? { id: "picked", position: value.coordinates, type: "visited", title: value.address }
      : null
  )

  const config: MapConfig = {
    center: value?.coordinates || DEFAULT_CENTER,
    zoom: value?.coordinates ? 12 : DEFAULT_ZOOM,
  }

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return
    setIsSearching(true)
    try {
      // Use the Geocoding API directly for the search since the map provider
      // geocode method requires initialization
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      if (data.results?.[0]) {
        const result = data.results[0]
        const coordinates: LatLng = {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        }
        const address = result.formatted_address
        setMarker({ id: "picked", position: coordinates, type: "visited", title: address })
        setSearchInput(address)
        onChange({ address, coordinates })
      }
    } catch {
      // Silently fail for now
    } finally {
      setIsSearching(false)
    }
  }, [searchInput, onChange])

  const handleMapClick = useCallback((position: LatLng) => {
    setMarker({ id: "picked", position, type: "visited" })
    // Reverse geocode will be handled when the user saves
    onChange({ address: searchInput || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`, coordinates: position })
  }, [searchInput, onChange])

  const eventHandlers: MapEventHandlers = {
    onClick: handleMapClick,
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar ubicación..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={isSearching}
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden border">
        <MapView
          config={config}
          markers={marker ? [marker] : []}
          eventHandlers={eventHandlers}
        />
      </div>
      {value?.coordinates && (
        <p className="text-sm text-muted-foreground flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {value.address || `${value.coordinates.lat.toFixed(4)}, ${value.coordinates.lng.toFixed(4)}`}
        </p>
      )}
    </div>
  )
}
