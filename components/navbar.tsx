"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Bell, Compass, Download, Globe, Menu, PenLine, Search, User, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
            <Link href="/journals" className="font-medium transition-colors hover:text-amber-600">
              Mis Bitácoras
            </Link>
            <Link href="/explore" className="font-medium transition-colors hover:text-amber-600">
              Explorar
            </Link>
            <Link href="/map" className="font-medium transition-colors hover:text-amber-600">
              Mapa de Viajes
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar bitácoras..."
                className="w-[200px] pl-8 md:w-[300px] rounded-full"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar búsqueda</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="hidden md:flex relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-600 rounded-full"></span>
            <span className="sr-only">Notificaciones</span>
          </Button>

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Download className="h-5 w-5" />
            <span className="sr-only">Modo Sin Conexión</span>
          </Button>

          <Button asChild className="hidden md:flex bg-amber-600 hover:bg-amber-700">
            <Link href="/create">
              <PenLine className="mr-2 h-4 w-4" /> Nueva Bitácora
            </Link>
          </Button>

          <Link href="/profile" className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://api.dicebear.com/9.x/notionists/png?seed=john_doe" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Link>
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
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar bitácoras..." className="w-full pl-8 rounded-full" />
            </div>

            <nav className="grid gap-4 text-lg">
              <Link
                href="/journals"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                <PenLine className="h-5 w-5" /> Mis Bitácoras
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                <Compass className="h-5 w-5" /> Explorar
              </Link>
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
              <Link
                href="/offline"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                <Download className="h-5 w-5" /> Modo Sin Conexión
              </Link>
            </nav>

            <div className="mt-6">
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                <Link href="/create" onClick={() => setIsMenuOpen(false)}>
                  <PenLine className="mr-2 h-4 w-4" /> Nueva Bitácora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
