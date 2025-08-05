"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Clock, Download, Heart, MapPin, MessageSquare, Share2, ThumbsUp } from "lucide-react"

const API_KEY = "12588265-86c13fc3629bd8729dadccbe1";

export default function JournalDetailPage({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false)
  const [images, setImages] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const getLandscapeImage = async (filter: string): Promise<string> => {
      try {
        const response = await fetch(
          `https://pixabay.com/api/?key=${API_KEY}&q=landscape,${encodeURIComponent(filter)}&image_type=photo&min_width=600`
        );
        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
          // Retorna las primeras 3 URLs de las imágenes
          return data.hits.slice(1, 4).map((hit: any) => hit.largeImageURL);
        }

        return  [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ];
      } catch (error) {
        console.error("Error fetching image from pixabay", error);
        return "";
      }
    };

    const fetchImages = async () => {
      const fetchedImages = await getLandscapeImage('Barcelona, Spain');

      setImages(fetchedImages);
    };

    fetchImages();
  },[]);

  // This would normally be fetched from an API based on the ID
  const journal = {
    id: params.id,
    title: "Verano en Barcelona",
    date: "June 15, 2023",
    location: "Barcelona, Spain",
    content: `
      <p>Las calles bañadas por el sol de Barcelona nos recibieron con los brazos abiertos. Pasamos nuestras mañanas en los cafés locales, las tardes explorando las obras maestras de Gaudí, y las noches saboreando tapas junto al Mediterráneo.</p>

      <p>La Sagrada Familia era aún más impresionante de lo que había imaginado. La forma en que la luz se filtraba a través de las vidrieras, proyectando sombras coloridas sobre el interior de piedra blanca, era simplemente mágica. Pasamos horas simplemente caminando, con el cuello estirado hacia arriba, absorbiendo cada detalle intrincado.</p>

      <p>El Parque Güell ofreció vistas panorámicas de la ciudad que hicieron que la caminata cuesta arriba valiera completamente la pena. Los bancos de mosaico y las estructuras caprichosas eran como algo salido de un cuento de hadas. Nos sentamos allí mientras el sol comenzaba a ponerse, viendo la ciudad transformarse de una metrópolis bulliciosa a un mar centelleante de luces.</p>

      <p>La comida fue lo más destacado del viaje. Desde el simple placer del pan con tomate para el desayuno hasta las elaboradas paellas de mariscos para la cena, cada comida era una celebración. Los mercados locales eran un festín para los sentidos: productos coloridos, especias fragantes y la charla animada de vendedores y compradores.</p>

      <p>Las playas proporcionaron un respiro perfecto de la exploración urbana. El Mediterráneo estaba refrescantemente fresco, y pasamos tardes perezosas alternando entre nadar y dormir la siesta bajo sombrillas coloridas.</p>

      <p>Cuando nuestro tiempo en Barcelona llegó a su fin, me encontré ya planeando un viaje de regreso. Hay algo sobre esta ciudad que se mete bajo tu piel: la mezcla perfecta de historia y modernidad, relajación y emoción, familiaridad y descubrimiento.</p>
    `,
    mapLocation: { lat: 41.3851, lng: 2.1734 },
    likes: 24,
    comments: [
      {
        id: 1,
        user: {
          name: "Maria Garcia",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        text: "¡Tus fotos son increíbles! Estoy planeando un viaje a Barcelona el próximo mes. ¿Alguna recomendación de lugares para quedarse?",
        date: "June 16, 2023",
      },
      {
        id: 2,
        user: {
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        text: "La Sagrada Familia es verdaderamente una obra maestra. ¿Tuviste la oportunidad de visitar también la Casa Batlló?",
        date: "June 17, 2023",
      },
    ],
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
                <AvatarImage src="https://api.dicebear.com/9.x/notionists/png?seed=john_doe" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">Entusiasta de Viajes</div>
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
                variant={liked ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-1 ${liked ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-white" : ""}`} /> {liked ? journal.likes + 1 : journal.likes}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {images.map((image, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Travel image ${index + 1}`}
                className="w-full h-full object-cover aspect-video"
              />
            </div>
          ))}
        </div>

        <div className="prose prose-amber max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: journal.content }} />
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4 font-serif">Ubicación</h2>
          <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative">
            {/* This would be replaced with an actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">El mapa interactivo se mostraría aquí</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" /> {journal.location}
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6 font-serif">Comentarios ({journal.comments.length})</h2>

          <div className="space-y-6">
            {journal.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
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
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your Avatar" />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Comparte tus pensamientos..."
                  className="mb-3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button className="bg-amber-600 hover:bg-amber-700">Publicar Comentario</Button>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}
