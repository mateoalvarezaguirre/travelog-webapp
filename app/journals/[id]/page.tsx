"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Calendar, Clock, Download, Heart, MapPin, MessageSquare, Share2, ThumbsUp, Trash2 } from "lucide-react"
import { useJournal, useDeleteJournal } from "@/hooks/use-journals"
import { useLike, useComments } from "@/hooks/use-social"
import { MapView } from "@/components/map/map-view"
import type { MapMarker, MapConfig } from "@/lib/maps"
import { toast } from "sonner"

export default function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { journal, isLoading, error } = useJournal(id)
  const { isLiked, likesCount, toggleLike } = useLike(id, journal?.isLiked ?? false, journal?.likesCount ?? 0)
  const { comments, submitComment, isSubmitting } = useComments(id)
  const { remove: deleteJournal, isLoading: isDeleting } = useDeleteJournal()
  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    if (journal) document.title = `${journal.title} — Travelog`
  }, [journal])

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return
    const success = await submitComment(commentText)
    if (success) {
      setCommentText("")
      toast.success("Comentario publicado")
    } else {
      toast.error("Error al publicar el comentario")
    }
  }

  const handleDelete = async () => {
    const success = await deleteJournal(id)
    if (success) {
      toast.success("Bitácora eliminada")
      router.push("/journals")
    } else {
      toast.error("Error al eliminar la bitácora")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="aspect-video bg-gray-200 rounded-lg" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !journal) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error || "Bitácora no encontrada"}</p>
        <Link href="/journals">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Bitácoras
          </Button>
        </Link>
      </div>
    )
  }

  const mapConfig: MapConfig = {
    center: journal.coordinates || { lat: 0, lng: 0 },
    zoom: 12,
  }

  const mapMarkers: MapMarker[] = journal.coordinates
    ? [{ id: `journal-${journal.id}`, position: journal.coordinates, type: "visited", title: journal.location }]
    : []

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

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-serif mb-4">{journal.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" /> {journal.date}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" /> {journal.location}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" /> 5 min de lectura
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={journal.author.avatar || undefined} alt={journal.author.name} />
                <AvatarFallback>{journal.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/profile/${journal.author.username}`} className="font-medium hover:text-amber-600">
                  {journal.author.name}
                </Link>
                <div className="text-sm text-muted-foreground">@{journal.author.username}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" /> Guardar Sin Conexión
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> Compartir
              </Button>
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-1 ${isLiked ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                onClick={toggleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`} /> {likesCount}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" /> Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar bitácora</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente esta bitácora
                      y todos sus comentarios asociados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </header>

        {journal.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {journal.images.slice(0, 3).map((image, index) => (
              <div
                key={image.id}
                className={`rounded-lg overflow-hidden ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <img
                  src={image.url}
                  alt={image.caption || `Imagen ${index + 1}`}
                  className="w-full h-full object-cover aspect-video"
                />
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-amber max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: journal.content }} />
        </div>

        {journal.coordinates && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-semibold mb-4 font-serif">Ubicación</h2>
            <div className="aspect-video rounded-lg mb-4 overflow-hidden">
              <MapView config={mapConfig} markers={mapMarkers} />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" /> {journal.location}
            </div>
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6 font-serif">Comentarios ({comments.length})</h2>

          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={c.user.avatar || undefined} alt={c.user.name} />
                  <AvatarFallback>{c.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{c.user.name}</span>
                      <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                    </div>
                    <p className="text-sm">{c.text}</p>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <button className="flex items-center mr-4">
                      <ThumbsUp className="mr-1 h-3 w-3" /> Me gusta
                    </button>
                    <button className="flex items-center">
                      <MessageSquare className="mr-1 h-3 w-3" /> Responder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Dejar un Comentario</h3>
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>TU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Comparte tus pensamientos..."
                  className="mb-3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !commentText.trim()}
                >
                  {isSubmitting ? "Publicando..." : "Publicar Comentario"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}
