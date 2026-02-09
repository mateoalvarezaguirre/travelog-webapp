"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function JournalsErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="h-16 w-16 mx-auto text-amber-600 mb-6" />
      <h1 className="text-3xl font-bold font-serif mb-4">Error al cargar las bitácoras</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        No pudimos cargar las bitácoras. Por favor, intenta de nuevo.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={reset} className="bg-amber-600 hover:bg-amber-700">
          Intentar de nuevo
        </Button>
        <Link href="/">
          <Button variant="outline">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
