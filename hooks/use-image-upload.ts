"use client"

import { useState, useCallback } from "react"
import { uploadToCloudinary } from "@/lib/cloudinary"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

interface UploadedImage {
  url: string
  publicId: string
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File): Promise<UploadedImage | null> => {
    setError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Tipo de archivo no permitido. Usa JPEG, PNG, WebP o GIF.")
      return null
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo es demasiado grande. El tamaño máximo es 10MB.")
      return null
    }

    setIsUploading(true)
    try {
      const result = await uploadToCloudinary(file)
      return result
    } catch {
      setError("Error al subir la imagen. Intenta de nuevo.")
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  return { upload, isUploading, error }
}
