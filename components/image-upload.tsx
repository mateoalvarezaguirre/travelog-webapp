"use client"

import { useRef } from "react"
import { Trash2, Upload, Loader2 } from "lucide-react"
import { useImageUpload } from "@/hooks/use-image-upload"

interface UploadedImage {
  url: string
  publicId: string
}

interface ImageUploadProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { upload, isUploading, error } = useImageUpload()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    for (const file of Array.from(files)) {
      if (images.length >= maxImages) break
      const result = await upload(file)
      if (result) {
        onChange([...images, result])
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    const updated = [...images]
    updated.splice(index, 1)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={image.publicId} className="relative group aspect-square border rounded-lg overflow-hidden">
            <img
              src={image.url}
              alt={`Imagen ${index + 1}`}
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

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-col items-center justify-center gap-2 aspect-square border border-dashed rounded-lg p-4 text-muted-foreground hover:text-foreground hover:border-amber-300 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Subiendo...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-sm">Subir Foto</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
