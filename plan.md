
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Plan to implement                                                                                                                                              │
│                                                                                                                                                                │
│ Travelog MVP Implementation Plan                                                                                                                               │
│                                                                                                                                                                │
│ Context                                                                                                                                                        │
│                                                                                                                                                                │
│ Travelog is a Spanish-language travel journal web app. The UI is ~85% built with Next.js 16 (App Router), but all data is hardcoded/mock — no auth, no API     │
│ integration, no real persistence. A Laravel backend with PostgreSQL already exists in a separate repo. This plan covers wiring the frontend to that backend    │
│ and filling the remaining functional gaps.                                                                                                                     │
│                                                                                                                                                                │
│ Key decisions:                                                                                                                                                 │
│ - Auth: NextAuth.js (Auth.js v5) — credentials + Google OAuth, backed by the Laravel API                                                                       │
│ - Images: Cloudinary (unsigned uploads for MVP)                                                                                                                │
│ - Maps: Google Maps — behind a port/adapter abstraction so the provider can be swapped                                                                         │
│ - Backend: Laravel (separate repo), PostgreSQL — already exists                                                                                                │
│                                                                                                                                                                │
│ ---                                                                                                                                                            │
│ Phase 1: Foundation (Env, API Client, Auth, Middleware)                                                                                                        │
│                                                                                                                                                                │
│ 1.1 Environment variables                                                                                                                                      │
│                                                                                                                                                                │
│ Create .env.local and .env.example:                                                                                                                            │
│ NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api                                                                                                             │
│ NEXTAUTH_URL=http://localhost:3000                                                                                                                             │
│ NEXTAUTH_SECRET=<generate>                                                                                                                                     │
│ GOOGLE_CLIENT_ID=                                                                                                                                              │
│ GOOGLE_CLIENT_SECRET=                                                                                                                                          │
│ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=                                                                                                                               │
│ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=                                                                                                                             │
│ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=                                                                                                                          │
│                                                                                                                                                                │
│ 1.2 Shared TypeScript types                                                                                                                                    │
│                                                                                                                                                                │
│ Create types/index.ts — all domain types used across services, hooks, and components:                                                                          │
│ ┌──────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐                   │
│ │         Type         │                                                    Key fields                                                     │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ User                 │ id, name, email, username, bio, avatar, coverPhoto, location                                                      │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ Journal              │ id, title, content, excerpt, date, location, coordinates, images, tags, status, likesCount, commentsCount, author │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ JournalImage         │ id, url, caption, order                                                                                           │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ CreateJournalPayload │ title, content, date, location, coordinates?, tags?, status, isPublic, imageIds?                                  │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ Comment              │ id, text, user, createdAt, likesCount                                                                             │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ UserSummary          │ id, name, username, avatar                                                                                        │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ UserProfile          │ extends User + journalCount, followersCount, followingCount, countriesVisited, isFollowing?                       │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ LatLng               │ lat, lng                                                                                                          │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ MarkerType           │ 'visited' | 'planned' | 'wishlist'                                                                                │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ MapPlace             │ id, name, country, date, coordinates, markerType, journalCount?, image?                                           │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ PaginatedResponse<T> │ data, meta (currentPage, lastPage, perPage, total)                                                                │                   │
│ ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                   │
│ │ ApiError             │ message, errors?, statusCode                                                                                      │                   │
│ └──────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘                   │
│ Create types/next-auth.d.ts — module augmentation to add accessToken to Session and JWT.                                                                       │
│                                                                                                                                                                │
│ 1.3 API client service layer                                                                                                                                   │
│                                                                                                                                                                │
│ Create lib/api/client.ts — core fetch wrapper:                                                                                                                 │
│ - Reads NEXT_PUBLIC_API_BASE_URL from env                                                                                                                      │
│ - Attaches Authorization: Bearer <token> header                                                                                                                │
│ - JSON serialization, standardized error handling into ApiError                                                                                                │
│                                                                                                                                                                │
│ Create API modules (each exports typed functions calling the Laravel API):                                                                                     │
│ ┌─────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐                                              │
│ │        File         │                                        Functions                                        │                                              │
│ ├─────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤                                              │
│ │ lib/api/auth.ts     │ loginWithCredentials, loginWithGoogle, registerUser, forgotPassword, getMe              │                                              │
│ ├─────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤                                              │
│ │ lib/api/journals.ts │ getJournals, getJournal, createJournal, updateJournal, deleteJournal, getPublicJournals │                                              │
│ ├─────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤                                              │
│ │ lib/api/social.ts   │ likeJournal, unlikeJournal, getComments, addComment, followUser, unfollowUser           │                                              │
│ ├─────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤                                              │
│ │ lib/api/profile.ts  │ getUserProfile, updateProfile, getUserStats                                             │                                              │
│ ├─────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤                                              │
│ │ lib/api/places.ts   │ getPlaces, addPlace, removePlace                                                        │                                              │
│ └─────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘                                              │
│ 1.4 NextAuth.js                                                                                                                                                │
│                                                                                                                                                                │
│ Install: npm install next-auth@beta                                                                                                                            │
│                                                                                                                                                                │
│ Create lib/auth.ts — NextAuth configuration:                                                                                                                   │
│ - CredentialsProvider: calls loginWithCredentials() from lib/api/auth.ts                                                                                       │
│ - GoogleProvider: exchanges Google ID token with Laravel via loginWithGoogle()                                                                                 │
│ - JWT callback stores accessToken from Laravel                                                                                                                 │
│ - Session callback exposes accessToken and user.id                                                                                                             │
│ - Custom pages: signIn: "/login"                                                                                                                               │
│                                                                                                                                                                │
│ Create app/api/auth/[...nextauth]/route.ts — route handler exporting { GET, POST } from handlers.                                                              │
│                                                                                                                                                                │
│ 1.5 Auth provider and hook                                                                                                                                     │
│                                                                                                                                                                │
│ Create providers/auth-provider.tsx — wraps children with SessionProvider from next-auth/react.                                                                 │
│                                                                                                                                                                │
│ Modify app/layout.tsx — wrap body content with <AuthProvider>.                                                                                                 │
│                                                                                                                                                                │
│ Create hooks/use-auth.ts — exposes { user, accessToken, isAuthenticated, isLoading, signIn, signOut }.                                                         │
│                                                                                                                                                                │
│ 1.6 Middleware                                                                                                                                                 │
│                                                                                                                                                                │
│ Create middleware.ts — protects /journals, /create, /map, /profile routes. Redirects unauthenticated users to /login?callbackUrl=....                          │
│                                                                                                                                                                │
│ 1.7 Wire auth pages                                                                                                                                            │
│                                                                                                                                                                │
│ Modify app/login/page.tsx — replace setTimeout simulation with signIn("credentials", ...). Replace Google button with signIn("google", ...).                   │
│                                                                                                                                                                │
│ Modify app/register/page.tsx — call registerUser() then signIn("credentials", ...). Keep existing Zod schema.                                                  │
│                                                                                                                                                                │
│ Modify app/forgot-password/page.tsx — call forgotPassword() from lib/api/auth.ts.                                                                              │
│                                                                                                                                                                │
│ Phase 1 file summary                                                                                                                                           │
│ ┌────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐                                 │
│ │ Action │                                                       Path                                                        │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Create │ .env.local, .env.example                                                                                          │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Create │ types/index.ts, types/next-auth.d.ts                                                                              │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Create │ lib/api/client.ts, lib/api/auth.ts, lib/api/journals.ts, lib/api/social.ts, lib/api/profile.ts, lib/api/places.ts │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Create │ lib/auth.ts                                                                                                       │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Create │ app/api/auth/[...nextauth]/route.ts                                                                               │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Create │ providers/auth-provider.tsx                                                                                       │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Create │ hooks/use-auth.ts                                                                                                 │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Create │ middleware.ts                                                                                                     │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Modify │ app/layout.tsx                                                                                                    │                                 │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ Modify │ app/login/page.tsx, app/register/page.tsx, app/forgot-password/page.tsx                                           │                                 │
│ └────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘                                 │
│ ---                                                                                                                                                            │
│ Phase 2: Core Data (Replace mock data with API calls)                                                                                                          │
│                                                                                                                                                                │
│ 2.1 Custom data hooks                                                                                                                                          │
│ ┌───────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────┐                                 │
│ │         File          │                                               Hooks                                                │                                 │
│ ├───────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ hooks/use-journals.ts │ useJournals(params?), useJournal(id), useCreateJournal(), useUpdateJournal(id), useDeleteJournal() │                                 │
│ ├───────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ hooks/use-profile.ts  │ useProfile(username?), useUpdateProfile()                                                          │                                 │
│ ├───────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ hooks/use-social.ts   │ useLike(journalId) (optimistic toggle), useComments(journalId), useFollow(userId)                  │                                 │
│ ├───────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ hooks/use-explore.ts  │ useExplore(params?)                                                                                │                                 │
│ ├───────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────┤                                 │
│ │ hooks/use-places.ts   │ usePlaces()                                                                                        │                                 │
│ └───────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────┘                                 │
│ 2.2 Journal form validation                                                                                                                                    │
│                                                                                                                                                                │
│ Create lib/validations/journal.ts — Zod schema for create/edit journal form (title, date, location, content, coordinates?, tags?, status, isPublic).           │
│                                                                                                                                                                │
│ 2.3 Replace mock data in pages                                                                                                                                 │
│ Page: app/journals/page.tsx                                                                                                                                    │
│ Changes: Remove hardcoded array + Pixabay key. Use useJournals(). Wire search input.                                                                           │
│ ────────────────────────────────────────                                                                                                                       │
│ Page: app/journals/[id]/page.tsx                                                                                                                               │
│ Changes: Remove hardcoded journal + Pixabay fetch. Use useJournal(id), useLike(), useComments().                                                               │
│ ────────────────────────────────────────                                                                                                                       │
│ Page: app/explore/page.tsx                                                                                                                                     │
│ Changes: Remove featuredJournals, popularDestinations, trendingTopics. Use useExplore().                                                                       │
│ ────────────────────────────────────────                                                                                                                       │
│ Page: app/profile/page.tsx                                                                                                                                     │
│ Changes: Remove hardcoded userData. Use useProfile().                                                                                                          │
│ ────────────────────────────────────────                                                                                                                       │
│ Page: app/map/page.tsx                                                                                                                                         │
│ Changes: Remove visitedPlaces, plannedTrips, travelStats. Use usePlaces(). (Map rendering is Phase 3.)                                                         │
│ ────────────────────────────────────────                                                                                                                       │
│ Page: app/create/page.tsx                                                                                                                                      │
│ Changes: Refactor from raw useState to react-hook-form + Zod. Wire onSubmit to useCreateJournal(). Redirect to /journals/${id} on success.                     │
│ ---                                                                                                                                                            │
│ Phase 3: Map Abstraction (Port/Adapter Pattern)                                                                                                                │
│                                                                                                                                                                │
│ The core architectural requirement: no page or component ever imports Google Maps directly. All map operations go through a MapProvider interface.             │
│                                                                                                                                                                │
│ 3.1 Port (interface)                                                                                                                                           │
│                                                                                                                                                                │
│ Create lib/maps/types.ts — MapMarker, MapRoute, GeocodingResult, MapConfig, MapEventHandlers.                                                                  │
│                                                                                                                                                                │
│ Create lib/maps/map-provider.ts — the MapProvider interface:                                                                                                   │
│                                                                                                                                                                │
│ interface MapProvider {                                                                                                                                        │
│   // Lifecycle                                                                                                                                                 │
│   initialize(container: HTMLElement, config: MapConfig): Promise<void>;                                                                                        │
│   destroy(): void;                                                                                                                                             │
│                                                                                                                                                                │
│   // Markers                                                                                                                                                   │
│   addMarker(marker: MapMarker): void;                                                                                                                          │
│   removeMarker(markerId: string): void;                                                                                                                        │
│   clearMarkers(): void;                                                                                                                                        │
│   updateMarker(markerId: string, updates: Partial<MapMarker>): void;                                                                                           │
│                                                                                                                                                                │
│   // Routes                                                                                                                                                    │
│   drawRoute(route: MapRoute): void;                                                                                                                            │
│   removeRoute(routeId: string): void;                                                                                                                          │
│   clearRoutes(): void;                                                                                                                                         │
│                                                                                                                                                                │
│   // Camera                                                                                                                                                    │
│   panTo(position: LatLng): void;                                                                                                                               │
│   setZoom(zoom: number): void;                                                                                                                                 │
│   fitBounds(positions: LatLng[], padding?: number): void;                                                                                                      │
│                                                                                                                                                                │
│   // Geocoding                                                                                                                                                 │
│   geocode(address: string): Promise<GeocodingResult[]>;                                                                                                        │
│   reverseGeocode(position: LatLng): Promise<GeocodingResult>;                                                                                                  │
│                                                                                                                                                                │
│   // User location                                                                                                                                             │
│   getCurrentLocation(): Promise<LatLng>;                                                                                                                       │
│                                                                                                                                                                │
│   // Events                                                                                                                                                    │
│   setEventHandlers(handlers: MapEventHandlers): void;                                                                                                          │
│ }                                                                                                                                                              │
│                                                                                                                                                                │
│ 3.2 Adapter (Google Maps implementation)                                                                                                                       │
│                                                                                                                                                                │
│ Install: npm install @googlemaps/js-api-loader and npm install -D @types/google.maps                                                                           │
│                                                                                                                                                                │
│ Create lib/maps/google-maps-adapter.ts — GoogleMapsAdapter implements MapProvider:                                                                             │
│ - Uses @googlemaps/js-api-loader to lazily load the SDK                                                                                                        │
│ - Maps MarkerType to amber/blue/rose colors matching the existing design                                                                                       │
│ - Uses AdvancedMarkerElement for markers                                                                                                                       │
│ - Polyline for routes (dashed option for planned trips)                                                                                                        │
│ - Geocoder for geocode/reverseGeocode                                                                                                                          │
│                                                                                                                                                                │
│ Create lib/maps/index.ts — barrel exports + createMapProvider() factory function. This is the only place that references the concrete adapter. To swap         │
│ providers, change this one file.                                                                                                                               │
│                                                                                                                                                                │
│ 3.3 React integration                                                                                                                                          │
│                                                                                                                                                                │
│ Create providers/map-provider.tsx — React context that holds a MapProvider instance via createMapProvider(). Exports useMapProvider() hook.                    │
│                                                                                                                                                                │
│ Create hooks/use-map.ts — wraps useMapProvider() with convenience methods: addMarker, removeMarker, drawRoute, panTo, fitBounds, geocode, reverseGeocode,      │
│ getCurrentLocation, etc.                                                                                                                                       │
│                                                                                                                                                                │
│ 3.4 Map components                                                                                                                                             │
│                                                                                                                                                                │
│ Create components/map/map-view.tsx — reusable map component:                                                                                                   │
│ - Accepts config, markers[], routes[], eventHandlers as props                                                                                                  │
│ - Wraps itself in <MapProviderWrapper>                                                                                                                         │
│ - Syncs markers/routes via effects                                                                                                                             │
│                                                                                                                                                                │
│ Create components/map/location-picker.tsx — for the /create page:                                                                                              │
│ - Search input with geocoding                                                                                                                                  │
│ - Click-to-place-pin on map                                                                                                                                    │
│ - Calls onChange({ address, coordinates }) to update the form                                                                                                  │
│                                                                                                                                                                │
│ 3.5 Integrate into pages                                                                                                                                       │
│ ┌────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐           │
│ │            Page            │                                                     Integration                                                     │           │
│ ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤           │
│ │ app/map/page.tsx           │ Replace fake marker divs + SVG paths with <MapView>. Layer toggles filter which markers/routes are passed as props. │           │
│ ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤           │
│ │ app/create/page.tsx        │ Replace "Ubicacion en el Mapa" placeholder with <LocationPicker>.                                                   │           │
│ ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤           │
│ │ app/journals/[id]/page.tsx │ Replace map placeholder with small <MapView> showing a single marker at the journal's coordinates.                  │           │
│ ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤           │
│ │ app/profile/page.tsx       │ "Mapa de Viajes" tab: replace placeholder with <MapView> showing user's visited places.                             │           │
│ ├────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤           │
│ │ app/explore/page.tsx       │ "Explorar el Mundo" section: replace placeholder with <MapView> showing popular destinations.                       │           │
│ └────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘           │
│ Phase 3 file summary                                                                                                                                           │
│ ┌────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐                                     │
│ │ Action │                                                     Path                                                      │                                     │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                     │
│ │ Create │ lib/maps/types.ts, lib/maps/map-provider.ts, lib/maps/google-maps-adapter.ts, lib/maps/index.ts               │                                     │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                     │
│ │ Create │ providers/map-provider.tsx                                                                                    │                                     │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                     │
│ │ Create │ hooks/use-map.ts                                                                                              │                                     │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                     │
│ │ Create │ components/map/map-view.tsx, components/map/location-picker.tsx                                               │                                     │
│ ├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                     │
│ │ Modify │ app/map/page.tsx, app/create/page.tsx, app/journals/[id]/page.tsx, app/profile/page.tsx, app/explore/page.tsx │                                     │
│ └────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘                                     │
│ ---                                                                                                                                                            │
│ Phase 4: Media (Cloudinary Image Upload)                                                                                                                       │
│                                                                                                                                                                │
│ 4.1 Cloudinary service                                                                                                                                         │
│                                                                                                                                                                │
│ Create lib/cloudinary.ts:                                                                                                                                      │
│ - uploadToCloudinary(file: File) — unsigned upload via fetch to Cloudinary's upload API using the upload preset from env                                       │
│ - cloudinaryUrl(publicId, options?) — generates optimized URLs with width/height/crop/quality transforms                                                       │
│                                                                                                                                                                │
│ 4.2 Upload hook and component                                                                                                                                  │
│                                                                                                                                                                │
│ Create hooks/use-image-upload.ts — useImageUpload() returns { upload, isUploading, error }. Validates file type (image only) and size (10MB max).              │
│                                                                                                                                                                │
│ Create components/image-upload.tsx — grid of uploaded image thumbnails + upload button. Handles file input, shows upload progress, delete per image.           │
│                                                                                                                                                                │
│ 4.3 Integrate                                                                                                                                                  │
│                                                                                                                                                                │
│ Modify app/create/page.tsx — replace the placeholder image grid with <ImageUpload>. Track image URLs in form state, send to API on submit.                     │
│                                                                                                                                                                │
│ Modify app/profile/page.tsx — "Editar Perfil" uses useImageUpload() for avatar and cover photo.                                                                │
│                                                                                                                                                                │
│ Modify next.config.mjs — add images.remotePatterns for res.cloudinary.com and api.dicebear.com.                                                                │
│                                                                                                                                                                │
│ ---                                                                                                                                                            │
│ Phase 5: Polish (Errors, Loading, Search, Navbar)                                                                                                              │
│                                                                                                                                                                │
│ 5.1 Error pages                                                                                                                                                │
│                                                                                                                                                                │
│ Create app/error.tsx — global error boundary with retry button (Spanish copy, amber theme).                                                                    │
│                                                                                                                                                                │
│ Create app/not-found.tsx — 404 page with compass icon and "Volver al inicio" link.                                                                             │
│                                                                                                                                                                │
│ Create app/journals/[id]/not-found.tsx and app/journals/error.tsx — route-specific error handling.                                                             │
│                                                                                                                                                                │
│ 5.2 Loading skeletons                                                                                                                                          │
│                                                                                                                                                                │
│ Modify app/journals/loading.tsx — skeleton grid of 6 journal cards (currently returns null).                                                                   │
│                                                                                                                                                                │
│ Modify app/map/loading.tsx — sidebar + map area skeleton.                                                                                                      │
│                                                                                                                                                                │
│ Modify app/explore/loading.tsx — explore page layout skeleton.                                                                                                 │
│                                                                                                                                                                │
│ 5.3 Navbar auth state                                                                                                                                          │
│                                                                                                                                                                │
│ Modify components/navbar.tsx:                                                                                                                                  │
│ - Use useAuth() hook                                                                                                                                           │
│ - Authenticated: show avatar from session, notifications, "Nueva Bitacora", user dropdown (profile, settings, logout via signOut())                            │
│ - Unauthenticated: show "Iniciar Sesion" / "Registrarse" buttons, hide notifications and create button                                                         │
│                                                                                                                                                                │
│ 5.4 Search                                                                                                                                                     │
│                                                                                                                                                                │
│ Create hooks/use-debounce.ts — generic debounce hook.                                                                                                          │
│                                                                                                                                                                │
│ Create hooks/use-search.ts — debounced search hook that calls a provided search function.                                                                      │
│                                                                                                                                                                │
│ Create lib/api/search.ts — searchJournals, searchUsers, searchPlaces.                                                                                          │
│                                                                                                                                                                │
│ Wire search inputs in navbar, /journals, /explore, and /map to useSearch.                                                                                      │
│                                                                                                                                                                │
│ 5.5 Cleanup                                                                                                                                                    │
│                                                                                                                                                                │
│ Remove the hardcoded Pixabay API key from app/page.tsx, app/journals/page.tsx, app/journals/[id]/page.tsx. Landing page keeps static images from               │
│ /public/trips/. Journal pages now get images from the API.                                                                                                     │
│                                                                                                                                                                │
│ ---                                                                                                                                                            │
│ Dependencies to Install                                                                                                                                        │
│                                                                                                                                                                │
│ npm install next-auth@beta                  # Phase 1                                                                                                          │
│ npm install @googlemaps/js-api-loader       # Phase 3                                                                                                          │
│ npm install -D @types/google.maps           # Phase 3                                                                                                          │
│                                                                                                                                                                │
│ New Directory Structure                                                                                                                                        │
│                                                                                                                                                                │
│ types/                                                                                                                                                         │
│   index.ts                                                                                                                                                     │
│   next-auth.d.ts                                                                                                                                               │
│ lib/                                                                                                                                                           │
│   auth.ts                                                                                                                                                      │
│   cloudinary.ts                                                                                                                                                │
│   utils.ts                    (existing)                                                                                                                       │
│   api/                                                                                                                                                         │
│     client.ts                                                                                                                                                  │
│     auth.ts                                                                                                                                                    │
│     journals.ts                                                                                                                                                │
│     social.ts                                                                                                                                                  │
│     profile.ts                                                                                                                                                 │
│     places.ts                                                                                                                                                  │
│     search.ts                                                                                                                                                  │
│   maps/                                                                                                                                                        │
│     index.ts                                                                                                                                                   │
│     types.ts                                                                                                                                                   │
│     map-provider.ts                                                                                                                                            │
│     google-maps-adapter.ts                                                                                                                                     │
│   validations/                                                                                                                                                 │
│     journal.ts                                                                                                                                                 │
│ hooks/                                                                                                                                                         │
│   use-auth.ts                                                                                                                                                  │
│   use-journals.ts                                                                                                                                              │
│   use-profile.ts                                                                                                                                              │
│   use-social.ts                                                                                                                                                │
│   use-explore.ts                                                                                                                                              │
│   use-places.ts                                                                                                                                                │
│   use-map.ts                                                                                                                                                   │
│   use-image-upload.ts                                                                                                                                          │
│   use-search.ts                                                                                                                                                │
│   use-debounce.ts                                                                                                                                            │
│ providers/                                                                                                                                                     │
│   auth-provider.tsx                                                                                                                                            │
│   map-provider.tsx                                                                                                                                             │
│ components/                                                                                                                                                    │
│   navbar.tsx                  (modified)                                                                                                                       │
│   image-upload.tsx                                                                                                                                             │
│   map/                                                                                                                                                         │
│     map-view.tsx                                                                                                                                               │
│     location-picker.tsx                                                                                                                                        │
│   ui/                         (existing, unchanged)                                                                                                            │
│ app/                                                                                                                                                           │
│   api/auth/[...nextauth]/route.ts                                                                                                                              │
│   error.tsx                                                                                                                                                    │
│   not-found.tsx                                                                                                                                                │
│   journals/error.tsx                                                                                                                                           │
│   journals/[id]/not-found.tsx                                                                                                                                  │
│   profile/edit/page.tsx       (optional)                                                                                                                       │
│ middleware.ts                                                                                                                                                  │
│ .env.local                                                                                                                                                     │
│ .env.example                                                                                                                                                   │
│                                                                                                                                                                │
│ Phase Dependencies                                                                                                                                             │
│                                                                                                                                                                │
│ Phase 1 (Foundation) ──────────────┐                                                                                                                           │
│                                     ├──> Phase 2 (Core Data)                                                                                                   │
│ Phase 3 (Maps: interface + adapter) ┘         │                                                                                                                │
│          │                                     │                                                                                                               │
│          └──> Phase 3.5 (Maps: page integration, needs Phase 2 hooks)                                                                                          │
│                                                │                                                                                                               │
│ Phase 4 (Media) ──────────────────────────────┘                                                                                                                │
│                                                │                                                                                                               │
│ Phase 5 (Polish) ─────────────────────────────┘                                                                                                                │
│                                                                                                                                                                │
│ Phases 1 and 3 (up to 3.2) can run in parallel since the map abstraction layer doesn't depend on auth. Phase 3.5 (integrating maps into pages) needs Phase 2   │
│ hooks for data. Phase 4 and 5 depend on the earlier phases.                                                                                                    │
│                                                                                                                                                                │
│ Verification                                                                                                                                                   │
│                                                                                                                                                                │
│ After each phase, verify by:                                                                                                                                   │
│ 1. npm run build — no TypeScript errors                                                                                                                        │
│ 2. npm run lint — no lint errors                                                                                                                               │
│ 3. Manual testing of the affected pages in the browser                                                                                                         │
│ 4. After Phase 1: login/register/logout flow works end-to-end with the Laravel API                                                                             │
│ 5. After Phase 2: journal list, detail, create pages show real data                                                                                            │
│ 6. After Phase 3: map renders with real markers on /map, location picker works on /create                                                                      │
│ 7. After Phase 4: images upload to Cloudinary and display in journal creation                                                                                  │
│ 8. After Phase 5: error pages render, search returns results, navbar reflects auth state                                                                       │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

---

## Phase 5 — Additions (completing the phase)

The original Phase 5 (inside the box above) covers 5.1–5.5. The following sections complete it.

### 5.6 Toast notifications

Install shadcn/ui Sonner integration: `npx shadcn@latest add sonner`

Modify `app/layout.tsx` — add `<Toaster />` from `sonner` inside the body (after `<AuthProvider>`).

Use `toast.success()` / `toast.error()` in:
- `app/create/page.tsx` — on journal create success/failure
- `app/journals/[id]/page.tsx` — on delete, like, comment actions
- `app/profile/page.tsx` — on profile update success/failure
- `app/login/page.tsx` and `app/register/page.tsx` — on auth errors from the API

### 5.7 Pagination

Create `components/pagination.tsx` — reusable pagination component:
- Accepts `currentPage`, `lastPage`, `onPageChange` props
- Shows previous/next buttons + page numbers
- Uses existing shadcn/ui Button component
- Spanish labels: "Anterior", "Siguiente"

Wire pagination into:
- `app/journals/page.tsx` — paginate user's journal list using `PaginatedResponse<Journal>` from the API
- `app/explore/page.tsx` — paginate public journals feed

### 5.8 Page metadata (SEO)

Add Next.js `metadata` exports to pages for proper titles and descriptions:

| Page | Title |
|------|-------|
| `app/layout.tsx` | Default: "Travelog — Tu Diario de Viaje" |
| `app/login/page.tsx` | "Iniciar Sesion — Travelog" |
| `app/register/page.tsx` | "Registrarse — Travelog" |
| `app/journals/page.tsx` | "Mis Bitacoras — Travelog" |
| `app/explore/page.tsx` | "Explorar — Travelog" |
| `app/map/page.tsx` | "Mapa de Viajes — Travelog" |
| `app/profile/page.tsx` | "Mi Perfil — Travelog" |
| `app/create/page.tsx` | "Nueva Bitacora — Travelog" |

For pages that are Client Components (`"use client"`), use `document.title` in a `useEffect` instead of the static `metadata` export.

### 5.9 Delete confirmation dialog

Install shadcn/ui AlertDialog: `npx shadcn@latest add alert-dialog`

Use `<AlertDialog>` for destructive actions:
- `app/journals/[id]/page.tsx` — confirm before deleting a journal ("Eliminar bitacora", "Esta accion no se puede deshacer")
- Calls `useDeleteJournal()` on confirm, redirects to `/journals` on success

### Phase 5 file summary

| Action | Path |
|--------|------|
| Create | `app/error.tsx`, `app/not-found.tsx` |
| Create | `app/journals/[id]/not-found.tsx`, `app/journals/error.tsx` |
| Create | `hooks/use-debounce.ts`, `hooks/use-search.ts` |
| Create | `lib/api/search.ts` |
| Create | `components/pagination.tsx` |
| Modify | `app/journals/loading.tsx`, `app/map/loading.tsx`, `app/explore/loading.tsx` |
| Modify | `components/navbar.tsx` |
| Modify | `app/layout.tsx` (add `<Toaster />`) |
| Modify | `app/create/page.tsx`, `app/journals/[id]/page.tsx`, `app/profile/page.tsx` (toast + delete confirm) |
| Modify | `app/journals/page.tsx`, `app/explore/page.tsx` (pagination + search wiring) |
| Modify | `app/login/page.tsx`, `app/register/page.tsx` (toast on auth errors) |
| Modify | All page files (metadata / document.title) |
| Cleanup | Remove Pixabay API key from `app/page.tsx`, `app/journals/page.tsx`, `app/journals/[id]/page.tsx` |

---

## Additional Dependencies (Phase 5 additions)

```
npx shadcn@latest add sonner          # 5.6 — toast notifications
npx shadcn@latest add alert-dialog    # 5.9 — delete confirmation
```

## Additional Directory Structure (Phase 5 additions)

```
components/
  pagination.tsx              # 5.7
  ui/
    sonner.tsx                # 5.6 (auto-installed by shadcn)
    alert-dialog.tsx          # 5.9 (auto-installed by shadcn)
```

## Updated Verification (Phase 5)

After Phase 5, additionally verify:
9. Toast notifications appear on create/delete/update actions
10. Pagination works on /journals and /explore (page changes, URL updates)
11. Browser tab shows correct page titles
12. Delete journal shows confirmation dialog before proceeding
13. `app/journals/[id]/not-found.tsx` renders when accessing a non-existent journal ID
