export type { MapMarker, MapRoute, GeocodingResult, MapConfig, MapEventHandlers } from "./types"
export type { MapProvider } from "./map-provider"

import { GoogleMapsAdapter } from "./google-maps-adapter"
import type { MapProvider } from "./map-provider"

// Factory function — change this to swap providers
export function createMapProvider(): MapProvider {
  return new GoogleMapsAdapter()
}
