"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"
import { createMapProvider, type MapProvider } from "@/lib/maps"

const MapContext = createContext<MapProvider | null>(null)

export function MapProviderWrapper({ children }: { children: ReactNode }) {
  const providerRef = useRef<MapProvider | null>(null)

  if (!providerRef.current) {
    providerRef.current = createMapProvider()
  }

  return (
    <MapContext.Provider value={providerRef.current}>
      {children}
    </MapContext.Provider>
  )
}

export function useMapProvider(): MapProvider {
  const provider = useContext(MapContext)
  if (!provider) {
    throw new Error("useMapProvider must be used within a MapProviderWrapper")
  }
  return provider
}
