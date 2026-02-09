import type { LatLng } from "@/types"

export interface MapMarker {
  id: string
  position: LatLng
  title?: string
  type: "visited" | "planned" | "wishlist"
  label?: string
  onClick?: () => void
}

export interface MapRoute {
  id: string
  path: LatLng[]
  color?: string
  dashed?: boolean
}

export interface GeocodingResult {
  address: string
  position: LatLng
}

export interface MapConfig {
  center: LatLng
  zoom: number
  mapId?: string
}

export interface MapEventHandlers {
  onClick?: (position: LatLng) => void
  onMarkerClick?: (markerId: string) => void
  onZoomChange?: (zoom: number) => void
}
