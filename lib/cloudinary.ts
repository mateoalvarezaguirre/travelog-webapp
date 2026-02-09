const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""

export async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  )

  if (!response.ok) {
    throw new Error("Error al subir la imagen")
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}

interface CloudinaryUrlOptions {
  width?: number
  height?: number
  crop?: "fill" | "fit" | "scale" | "thumb"
  quality?: "auto" | number
}

export function cloudinaryUrl(publicId: string, options?: CloudinaryUrlOptions): string {
  const transforms: string[] = []

  if (options?.width) transforms.push(`w_${options.width}`)
  if (options?.height) transforms.push(`h_${options.height}`)
  if (options?.crop) transforms.push(`c_${options.crop}`)
  if (options?.quality) transforms.push(`q_${options.quality}`)

  const transformStr = transforms.length > 0 ? `/${transforms.join(",")}` : ""
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload${transformStr}/${publicId}`
}
