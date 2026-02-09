import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function JournalNotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <BookOpen className="h-16 w-16 mx-auto text-amber-600 mb-6" />
      <h1 className="text-3xl font-bold font-serif mb-4">Bitácora no encontrada</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        La bitácora que buscas no existe o ha sido eliminada.
      </p>
      <Link href="/journals">
        <Button className="bg-amber-600 hover:bg-amber-700">
          Ver todas las bitácoras
        </Button>
      </Link>
    </div>
  )
}
