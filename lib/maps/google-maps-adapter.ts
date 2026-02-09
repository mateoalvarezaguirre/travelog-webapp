import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
import type { LatLng } from "@/types"
import type { MapProvider } from "./map-provider"
import type { MapMarker, MapRoute, GeocodingResult, MapConfig, MapEventHandlers } from "./types"

const MARKER_COLORS: Record<MapMarker["type"], string> = {
  visited: "#d97706",
  planned: "#2563eb",
  wishlist: "#e11d48",
}

// ✅ para no llamar setOptions múltiples veces
let optionsInitialized = false

function ensureGoogleMapsOptions(apiKey: string, mapId?: string) {
  if (optionsInitialized) return
  if (!apiKey) throw new Error("Falta NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")

  setOptions({
    key: apiKey,
    v: "weekly",
    libraries: ["marker", "geocoding"],
    ...(mapId ? { mapIds: [mapId] } : {}),
  })

  optionsInitialized = true
}

export class GoogleMapsAdapter implements MapProvider {
  private map: google.maps.Map | null = null
  private markers: Map<string, google.maps.marker.AdvancedMarkerElement> = new Map()
  private routes: Map<string, google.maps.Polyline> = new Map()
  private geocoder: google.maps.Geocoder | null = null
  private handlers: MapEventHandlers = {}

  async initialize(container: HTMLElement, config: MapConfig): Promise<void> {
    ensureGoogleMapsOptions(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", config.mapId)

    // ✅ cargar librerías necesarias (on-demand)
    const [{ Map }] = await Promise.all([
      importLibrary("maps") as Promise<google.maps.MapsLibrary>,
      importLibrary("marker"),
      importLibrary("geocoding"),
    ])

    this.map = new Map(container, {
      center: config.center,
      zoom: config.zoom,
      mapId: config.mapId || "travelog-map",
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })

    this.geocoder = new google.maps.Geocoder()

    this.map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng && this.handlers.onClick) {
        this.handlers.onClick({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      }
    })

    this.map.addListener("zoom_changed", () => {
      if (this.map && this.handlers.onZoomChange) {
        this.handlers.onZoomChange(this.map.getZoom() || 0)
      }
    })
  }

  destroy(): void {
    this.clearMarkers()
    this.clearRoutes()
    this.map = null
    this.geocoder = null
  }

  addMarker(marker: MapMarker): void {
    if (!this.map) return

    const pinElement = document.createElement("div")
    pinElement.style.width = marker.label ? "28px" : "20px"
    pinElement.style.height = marker.label ? "28px" : "20px"
    pinElement.style.borderRadius = "50%"
    pinElement.style.backgroundColor = MARKER_COLORS[marker.type]
    pinElement.style.border = "2px solid white"
    pinElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"
    pinElement.style.display = "flex"
    pinElement.style.alignItems = "center"
    pinElement.style.justifyContent = "center"
    pinElement.style.cursor = "pointer"
    pinElement.style.transition = "transform 0.2s"

    if (marker.label) {
      pinElement.style.color = "white"
      pinElement.style.fontSize = "11px"
      pinElement.style.fontWeight = "bold"
      pinElement.textContent = marker.label
    }

    pinElement.addEventListener("mouseenter", () => (pinElement.style.transform = "scale(1.25)"))
    pinElement.addEventListener("mouseleave", () => (pinElement.style.transform = "scale(1)"))

    const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      position: marker.position,
      title: marker.title,
      content: pinElement,
    })

    advancedMarker.addListener("click", () => {
      marker.onClick?.()
      this.handlers.onMarkerClick?.(marker.id)
    })

    this.markers.set(marker.id, advancedMarker)
  }

  removeMarker(markerId: string): void {
    const marker = this.markers.get(markerId)
    if (marker) {
      marker.map = null
      this.markers.delete(markerId)
    }
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => {
      marker.map = null
    })
    this.markers.clear()
  }

  updateMarker(markerId: string, updates: Partial<MapMarker>): void {
    const existing = this.markers.get(markerId)
    if (!existing) return
    if (updates.position) existing.position = updates.position
    if (updates.title) existing.title = updates.title
  }

  drawRoute(route: MapRoute): void {
    if (!this.map) return

    const polyline = new google.maps.Polyline({
      path: route.path,
      strokeColor: route.color || MARKER_COLORS.visited,
      strokeWeight: 2,
      strokeOpacity: route.dashed ? 0 : 0.8,
      map: this.map,
    })

    if (route.dashed) {
      polyline.setOptions({
        strokeOpacity: 0,
        icons: [
          {
            icon: { path: "M 0,-1 0,1", strokeOpacity: 0.8, strokeWeight: 2, scale: 3 },
            offset: "0",
            repeat: "15px",
          },
        ],
      })
    }

    this.routes.set(route.id, polyline)
  }

  removeRoute(routeId: string): void {
    const route = this.routes.get(routeId)
    if (route) {
      route.setMap(null)
      this.routes.delete(routeId)
    }
  }

  clearRoutes(): void {
    this.routes.forEach((route) => route.setMap(null))
    this.routes.clear()
  }

  panTo(position: LatLng): void {
    this.map?.panTo(position)
  }

  setZoom(zoom: number): void {
    this.map?.setZoom(zoom)
  }

  fitBounds(positions: LatLng[], padding = 50): void {
    if (!this.map || positions.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    positions.forEach((pos) => bounds.extend(pos))
    this.map.fitBounds(bounds, padding)
  }

  async geocode(address: string): Promise<GeocodingResult[]> {
    if (!this.geocoder) return []
    const response = await this.geocoder.geocode({ address })
    return response.results.map((result) => ({
      address: result.formatted_address,
      position: { lat: result.geometry.location.lat(), lng: result.geometry.location.lng() },
    }))
  }

  async reverseGeocode(position: LatLng): Promise<GeocodingResult> {
    if (!this.geocoder) return { address: "", position }
    const response = await this.geocoder.geocode({ location: position })
    const result = response.results[0]
    return { address: result?.formatted_address || "", position }
  }

  getCurrentLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("Geolocalización no soportada"))
      navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(new Error(err.message))
      )
    })
  }

  setEventHandlers(handlers: MapEventHandlers): void {
    this.handlers = handlers
  }
}