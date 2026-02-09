"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Compass, Download, Globe, LogOut, Menu, PenLine, Search, Settings, User, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isAuthenticated, isLoading, signOut } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsSearchOpen(false)
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-serif">Travelog</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {isAuthenticated && (
              <Link href="/journals" className="font-medium transition-colors hover:text-amber-600">
                Mis Bitácoras
              </Link>
            )}
            <Link href="/explore" className="font-medium transition-colors hover:text-amber-600">
              Explorar
            </Link>
            {isAuthenticated && (
              <Link href="/map" className="font-medium transition-colors hover:text-amber-600">
                Mapa de Viajes
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar bitácoras..."
                className="w-[200px] pl-8 md:w-[300px] rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => { setIsSearchOpen(false); setSearchQuery("") }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar búsqueda</span>
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          )}

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-600 rounded-full"></span>
                <span className="sr-only">Notificaciones</span>
              </Button>

              <Button asChild className="hidden md:flex bg-amber-600 hover:bg-amber-700">
                <Link href="/create">
                  <PenLine className="mr-2 h-4 w-4" /> Nueva Bitácora
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                      <AvatarFallback>
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" /> Configuración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            !isLoading && (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="hidden md:flex">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold font-serif">Travelog</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>

          <div className="p-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar bitácoras..."
                className="w-full pl-8 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <nav className="grid gap-4 text-lg">
              {isAuthenticated && (
                <Link
                  href="/journals"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PenLine className="h-5 w-5" /> Mis Bitácoras
                </Link>
              )}
              <Link
                href="/explore"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                <Compass className="h-5 w-5" /> Explorar
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/map"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Globe className="h-5 w-5" /> Mapa de Viajes
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" /> Perfil
                  </Link>
                </>
              )}
            </nav>

            <div className="mt-6 space-y-3">
              {isAuthenticated ? (
                <>
                  <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                    <Link href="/create" onClick={() => setIsMenuOpen(false)}>
                      <PenLine className="mr-2 h-4 w-4" /> Nueva Bitácora
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={() => { signOut({ callbackUrl: "/" }); setIsMenuOpen(false) }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
