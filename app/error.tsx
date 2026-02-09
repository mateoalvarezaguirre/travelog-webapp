"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="h-16 w-16 mx-auto text-amber-600 mb-6" />
      <h1 className="text-3xl font-bold font-serif mb-4">Algo salió mal</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
      </p>
      <Button onClick={reset} className="bg-amber-600 hover:bg-amber-700">
        Intentar de nuevo
      </Button>
    </div>
  )
}
