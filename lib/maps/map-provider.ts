import type { LatLng } from "@/types"
import type { MapMarker, MapRoute, GeocodingResult, MapConfig, MapEventHandlers } from "./types"

export interface MapProvider {
  // Lifecycle
  initialize(container: HTMLElement, config: MapConfig): Promise<void>
  destroy(): void

  // Markers
  addMarker(marker: MapMarker): void
  removeMarker(markerId: string): void
  clearMarkers(): void
  updateMarker(markerId: string, updates: Partial<MapMarker>): void

  // Routes
  drawRoute(route: MapRoute): void
  removeRoute(routeId: string): void
  clearRoutes(): void

  // Camera
  panTo(position: LatLng): void
  setZoom(zoom: number): void
  fitBounds(positions: LatLng[], padding?: number): void

  // Geocoding
  geocode(address: string): Promise<GeocodingResult[]>
  reverseGeocode(position: LatLng): Promise<GeocodingResult>

  // User location
  getCurrentLocation(): Promise<LatLng>

  // Events
  setEventHandlers(handlers: MapEventHandlers): void
}
