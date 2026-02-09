"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, MapPin, Save, Share2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { journalSchema, type JournalFormData } from "@/lib/validations/journal"
import { useCreateJournal } from "@/hooks/use-journals"
import { LocationPicker } from "@/components/map/location-picker"
import { ImageUpload } from "@/components/image-upload"
import type { LatLng } from "@/types"
import { toast } from "sonner"

interface UploadedImage {
  url: string
  publicId: string
}

export default function CreateJournalPage() {
  const router = useRouter()
  const { create, isLoading, error } = useCreateJournal()

  useEffect(() => { document.title = "Nueva Bitácora — Travelog" }, [])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [locationData, setLocationData] = useState<{ address: string; coordinates: LatLng } | undefined>()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      status: "published",
      isPublic: true,
      tags: [],
    },
  })

  const content = watch("content")

  const handleLocationChange = (value: { address: string; coordinates: LatLng }) => {
    setLocationData(value)
    setValue("location", value.address)
    setValue("coordinates", value.coordinates)
  }

  const onSubmit = async (data: JournalFormData) => {
    const result = await create(data)
    if (result) {
      toast.success("Bitácora creada exitosamente")
      router.push(`/journals/${result.id}`)
    } else {
      toast.error("Error al crear la bitácora")
    }
  }

  const onSaveDraft = async () => {
    const formData = watch()
    setValue("status", "draft")
    const result = await create({ ...formData, status: "draft" })
    if (result) {
      toast.success("Borrador guardado exitosamente")
      router.push(`/journals/${result.id}`)
    } else {
      toast.error("Error al guardar el borrador")
    }
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Título de la Bitácora</Label>
              <Input
                id="title"
                placeholder="Ingresa un título para tu bitácora..."
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
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
                    {...register("date")}
                  />
                </div>
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="location">Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="¿A dónde fuiste?"
                    className="pl-10"
                    {...register("location")}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
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
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
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
            <ImageUpload images={uploadedImages} onChange={setUploadedImages} />
          </div>

          <div className="grid gap-3">
            <Label>Ubicación en el Mapa</Label>
            <LocationPicker value={locationData} onChange={handleLocationChange} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" /> {isLoading ? "Guardando..." : "Guardar Bitácora"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" /> Guardar como Borrador
            </Button>
            <Button type="button" variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Compartir
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
