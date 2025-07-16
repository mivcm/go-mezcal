"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

import { useUserAuthStore } from "@/hooks/use-user-auth-store"
import Link from "next/link"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  UserPlus,
  Shield,
  Check,
  X,
  LogIn,
} from "lucide-react"
import api from "@/lib/axios"

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { token, isAdmin } = useUserAuthStore()
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: "bg-gray-200",
  })
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    if (token && !isAdmin) {
      router.push("/productos")
    }
    if (token && isAdmin) {
      router.push("/dashboard")
    }
  }, [token, isAdmin, router])

  useEffect(() => {
    // Validar formulario
    const emailValid = form.email.includes("@") && form.email.length > 0
    const passwordValid = form.password.length >= 6
    const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0

    setIsFormValid(emailValid && passwordValid && passwordsMatch)
  }, [form])

  useEffect(() => {
    // Calcular fortaleza de contraseña
    if (form.password.length === 0) {
      setPasswordStrength({ score: 0, feedback: [], color: "bg-gray-200" })
      return
    }

    let score = 0
    const feedback: string[] = []

    // Longitud
    if (form.password.length >= 8) {
      score += 25
    } else {
      feedback.push("Al menos 8 caracteres")
    }

    // Mayúsculas
    if (/[A-Z]/.test(form.password)) {
      score += 25
    } else {
      feedback.push("Una letra mayúscula")
    }

    // Números
    if (/\d/.test(form.password)) {
      score += 25
    } else {
      feedback.push("Un número")
    }

    // Caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      score += 25
    } else {
      feedback.push("Un carácter especial")
    }

    let color = "bg-red-500"
    if (score >= 75) color = "bg-green-500"
    else if (score >= 50) color = "bg-yellow-500"
    else if (score >= 25) color = "bg-orange-500"

    setPasswordStrength({ score, feedback, color })
  }, [form.password])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await api.post("/api/v1/register", { email: form.email, password: form.password })
      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength.score === 0) return ""
    if (passwordStrength.score < 25) return "Muy débil"
    if (passwordStrength.score < 50) return "Débil"
    if (passwordStrength.score < 75) return "Buena"
    return "Excelente"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-stone-900 dark:via-amber-900/20 dark:to-orange-900/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-full blur-3xl" />
      </div>

      {/* Patrón decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23000000 fillOpacity=0.1%3E%3Ccircle cx=7 cy=7 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] repeat)" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Únete a nosotros
          </h1>
          <p className="text-muted-foreground">Crea tu cuenta y descubre el mundo del mezcal auténtico</p>
        </div>

        {/* Register Card */}
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">Completa los campos para crear tu nueva cuenta</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4 text-amber-600" />
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-12 bg-white/50 dark:bg-stone-800/50 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-amber-600" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-12 bg-white/50 dark:bg-stone-800/50 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {/* Password Strength */}
                {form.password.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fortaleza de contraseña:</span>
                      <span
                        className={`font-medium ${passwordStrength.score >= 75 ? "text-green-600" : passwordStrength.score >= 50 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${passwordStrength.score}%`,
                          backgroundColor: passwordStrength.score >= 75 ? '#10b981' : passwordStrength.score >= 50 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Necesitas:</p>
                        <ul className="space-y-1">
                          {passwordStrength.feedback.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <X className="h-3 w-3 text-red-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4 text-amber-600" />
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-12 bg-white/50 dark:bg-stone-800/50 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {/* Password Match Indicator */}
                {form.confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {form.password === form.confirmPassword ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">Las contraseñas coinciden</span>
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">Las contraseñas no coinciden</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    ¡Registro exitoso! Redirigiendo al login...
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear Cuenta
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-stone-900 px-3 text-xs text-muted-foreground">O</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">¿Ya tienes una cuenta?</p>
              <Button
                asChild
                variant="outline"
                className="w-full h-12 border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20 bg-transparent"
              >
                <Link href="/login" className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Shield className="h-4 w-4 text-amber-500" />
            <span>Registro seguro y protegido</span>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-amber-600 transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-amber-600 transition-colors">
              Términos
            </Link>
            <Link href="/help" className="hover:text-amber-600 transition-colors">
              Ayuda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
