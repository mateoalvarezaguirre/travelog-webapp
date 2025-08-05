"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, MapPin, Plus, Save, Share2, Trash2, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreateJournalPage() {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])

  const handleImageUpload = () => {
    // In a real app, this would handle file uploads
    // For demo purposes, we'll just add a placeholder
    setImages([...images, "/placeholder.svg?height=200&width=300"])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/journals"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Bitácoras
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-serif mb-8">Crear Nueva Bitácora</h1>

        <form className="space-y-8">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Título de la Bitácora</Label>
              <Input
                id="title"
                placeholder="Ingresa un título para tu bitácora..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="date">Fecha</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="location">Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="¿A dónde fuiste?"
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="write">
            <TabsList className="mb-4">
              <TabsTrigger value="write">Escribir</TabsTrigger>
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
            </TabsList>

            <TabsContent value="write">
              <div className="grid gap-3">
                <Label htmlFor="content">Contenido de la Bitácora</Label>
                <Textarea
                  id="content"
                  placeholder="Escribe sobre tu aventura..."
                  className="min-h-[300px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="border rounded-lg p-6 min-h-[300px] prose prose-amber max-w-none">
                {content ? (
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
                ) : (
                  <p className="text-muted-foreground">El contenido de tu bitácora aparecerá aquí...</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-3">
            <Label>Fotos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group aspect-square border rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Journal image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleImageUpload}
                className="flex flex-col items-center justify-center gap-2 aspect-square border border-dashed rounded-lg p-4 text-muted-foreground hover:text-foreground hover:border-amber-300 transition-colors"
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">Subir Foto</span>
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Ubicación en el Mapa</Label>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">Añade tu ubicación al mapa</p>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Añadir Ubicación
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Save className="mr-2 h-4 w-4" /> Guardar Bitácora
            </Button>
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" /> Guardar como Borrador
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Compartir
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
