"use client"

import { useRef, useEffect } from "react"
import { MapProviderWrapper, useMapProvider } from "@/providers/map-provider"
import type { MapMarker, MapRoute, MapConfig, MapEventHandlers } from "@/lib/maps"

interface MapViewInnerProps {
  config: MapConfig
  markers?: MapMarker[]
  routes?: MapRoute[]
  eventHandlers?: MapEventHandlers
  className?: string
}

function MapViewInner({ config, markers = [], routes = [], eventHandlers, className }: MapViewInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const provider = useMapProvider()
  const initializedRef = useRef(false)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return

    let mounted = true
    provider.initialize(containerRef.current, config).then(() => {
      if (!mounted) return
      initializedRef.current = true

      // Set initial markers
      markers.forEach(m => provider.addMarker(m))
      routes.forEach(r => provider.drawRoute(r))

      if (eventHandlers) {
        provider.setEventHandlers(eventHandlers)
      }

      // Fit bounds if we have markers
      if (markers.length > 0) {
        provider.fitBounds(markers.map(m => m.position))
      }
    })

    return () => {
      mounted = false
      provider.destroy()
      initializedRef.current = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync markers
  useEffect(() => {
    if (!initializedRef.current) return
    provider.clearMarkers()
    markers.forEach(m => provider.addMarker(m))
  }, [markers, provider])

  // Sync routes
  useEffect(() => {
    if (!initializedRef.current) return
    provider.clearRoutes()
    routes.forEach(r => provider.drawRoute(r))
  }, [routes, provider])

  // Sync event handlers
  useEffect(() => {
    if (!initializedRef.current || !eventHandlers) return
    provider.setEventHandlers(eventHandlers)
  }, [eventHandlers, provider])

  return <div ref={containerRef} className={className || "w-full h-full"} />
}

interface MapViewProps extends MapViewInnerProps {}

export function MapView(props: MapViewProps) {
  return (
    <MapProviderWrapper>
      <MapViewInner {...props} />
    </MapProviderWrapper>
  )
}
