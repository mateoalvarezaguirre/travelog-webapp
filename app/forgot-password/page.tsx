"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Ingresa un email válido"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Aquí iría la lógica real para enviar email de recuperación
      console.log("Forgot password data:", data)

      setSuccess(true)
    } catch (err) {
      setError("Error al enviar el email de recuperación")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold font-serif text-amber-800 mb-2">Travelog</h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email enviado</h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Revisa tu correo electrónico</h3>
              <p className="text-gray-600 mb-6">
                Te hemos enviado un enlace para restablecer tu contraseña. Si no ves el email, revisa tu carpeta de
                spam.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                  <Link href="/login">Volver al inicio de sesión</Link>
                </Button>
                <Button variant="outline" onClick={() => setSuccess(false)} className="w-full">
                  Enviar email nuevamente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold font-serif text-amber-800 mb-2">Travelog</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h2>
          <p className="text-gray-600">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`pl-10 ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-amber-600 hover:text-amber-500 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
