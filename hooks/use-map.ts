"use client"

import { useCallback } from "react"
import { useMapProvider } from "@/providers/map-provider"
import type { LatLng } from "@/types"
import type { MapMarker, MapRoute, GeocodingResult, MapConfig, MapEventHandlers } from "@/lib/maps"

export function useMap() {
  const provider = useMapProvider()

  const initialize = useCallback(
    (container: HTMLElement, config: MapConfig) => provider.initialize(container, config),
    [provider]
  )

  const destroy = useCallback(() => provider.destroy(), [provider])

  const addMarker = useCallback(
    (marker: MapMarker) => provider.addMarker(marker),
    [provider]
  )

  const removeMarker = useCallback(
    (id: string) => provider.removeMarker(id),
    [provider]
  )

  const clearMarkers = useCallback(() => provider.clearMarkers(), [provider])

  const updateMarker = useCallback(
    (id: string, updates: Partial<MapMarker>) => provider.updateMarker(id, updates),
    [provider]
  )

  const drawRoute = useCallback(
    (route: MapRoute) => provider.drawRoute(route),
    [provider]
  )

  const removeRoute = useCallback(
    (id: string) => provider.removeRoute(id),
    [provider]
  )

  const clearRoutes = useCallback(() => provider.clearRoutes(), [provider])

  const panTo = useCallback(
    (position: LatLng) => provider.panTo(position),
    [provider]
  )

  const setZoom = useCallback(
    (zoom: number) => provider.setZoom(zoom),
    [provider]
  )

  const fitBounds = useCallback(
    (positions: LatLng[], padding?: number) => provider.fitBounds(positions, padding),
    [provider]
  )

  const geocode = useCallback(
    (address: string): Promise<GeocodingResult[]> => provider.geocode(address),
    [provider]
  )

  const reverseGeocode = useCallback(
    (position: LatLng): Promise<GeocodingResult> => provider.reverseGeocode(position),
    [provider]
  )

  const getCurrentLocation = useCallback(
    (): Promise<LatLng> => provider.getCurrentLocation(),
    [provider]
  )

  const setEventHandlers = useCallback(
    (handlers: MapEventHandlers) => provider.setEventHandlers(handlers),
    [provider]
  )

  return {
    initialize,
    destroy,
    addMarker,
    removeMarker,
    clearMarkers,
    updateMarker,
    drawRoute,
    removeRoute,
    clearRoutes,
    panTo,
    setZoom,
    fitBounds,
    geocode,
    reverseGeocode,
    getCurrentLocation,
    setEventHandlers,
  }
}
