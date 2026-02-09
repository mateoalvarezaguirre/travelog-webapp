import type { Journal, UserSummary, MapPlace } from "@/types"
import { apiClient } from "./client"

export async function searchJournals(query: string, token?: string): Promise<Journal[]> {
  return apiClient<Journal[]>(`/search/journals?q=${encodeURIComponent(query)}`, { token })
}

export async function searchUsers(query: string, token?: string): Promise<UserSummary[]> {
  return apiClient<UserSummary[]>(`/search/users?q=${encodeURIComponent(query)}`, { token })
}

export async function searchPlaces(query: string, token?: string): Promise<MapPlace[]> {
  return apiClient<MapPlace[]>(`/search/places?q=${encodeURIComponent(query)}`, { token })
}
