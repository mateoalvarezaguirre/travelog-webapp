import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Compass } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Compass className="h-16 w-16 mx-auto text-amber-600 mb-6" />
      <h1 className="text-4xl font-bold font-serif mb-4">404</h1>
      <h2 className="text-xl font-medium mb-4">Página no encontrada</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Parece que te has perdido. La página que buscas no existe o ha sido movida.
      </p>
      <Link href="/">
        <Button className="bg-amber-600 hover:bg-amber-700">
          Volver al inicio
        </Button>
      </Link>
    </div>
  )
}
