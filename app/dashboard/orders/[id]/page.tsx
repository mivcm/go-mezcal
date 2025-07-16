"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUserAuthStore } from "@/hooks/use-user-auth-store"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"
import { printOrder } from "@/lib/print-utils"
import {
  Package,
  User,
  Calendar,
  CreditCard,
  Mail,
  ShoppingCart,
  Hash,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Edit,
  Download,
  Printer,
} from "lucide-react"

interface OrderItem {
  product: {
    id: number
    name: string
    price: string
    images: string[]
  }
  quantity: number
  price: string
}

interface Order {
  id: number
  total: string
  status: string
  created_at: string
  user: {
    id: number
    email: string
  }
  transaction_id: number
  items: OrderItem[]
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useUserAuthStore()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/api/v1/admin/orders/${params.id}`)
        setOrder(response.data.order || response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la orden")
      } finally {
        setLoading(false)
      }
    }

    if (token && params.id) {
      fetchOrder()
    }
  }, [token, params.id])

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
            variant: "default" as const,
            icon: CheckCircle,
            className: "bg-green-100 text-green-800 hover:bg-green-200",
            label: "Pagada",
          }
      case "completed":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 hover:bg-green-200",
          label: "Completada",
        }
      case "pending":
        return {
          variant: "secondary" as const,
          icon: Clock,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
          label: "Pendiente",
        }
      case "cancelled":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          className: "bg-red-100 text-red-800 hover:bg-red-200",
          label: "Cancelada",
        }
      default:
        return {
          variant: "outline" as const,
          icon: AlertCircle,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
          label: status,
        }
    }
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number.parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return

    setUpdatingStatus(true)
    try {
      await api.patch(`/api/v1/admin/orders/${order.id}/status`, {
        status: newStatus,
      })

      setOrder({ ...order, status: newStatus })
      toast({
        title: "Estado actualizado",
        description: `La orden ha sido marcada como ${newStatus}`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Error al actualizar el estado",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getTotalItems = () => {
    if (!order) return 0
    return order.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    if (!order) return 0
    return order.items.reduce((total, item) => total + Number.parseFloat(item.price) * item.quantity, 0)
  }

  const handlePrint = () => {
    if (!order) return
    printOrder(order, (errorMessage) => {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    })
  }

  if (loading) {
    return (
      <div className="container py-6 sm:py-12 px-4 max-w-6xl">
        <BackButton />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container py-6 sm:py-12 px-4 max-w-6xl">
        <BackButton />
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Orden no encontrada"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="container py-6 sm:py-12 px-4 max-w-6xl">
      <BackButton />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orden #{order.id}</h1>
            <p className="text-muted-foreground">Creada el {formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={statusConfig.variant} className={`${statusConfig.className} text-sm px-3 py-1`}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {statusConfig.label}
            </Badge>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">
                      {order.user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.user?.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">ID: {order.user?.id}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos ({getTotalItems()} {getTotalItems() === 1 ? "artículo" : "artículos"})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="relative">
                        <img
                          src={item.product.images[0] || "/placeholder.svg?height=64&width=64"}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-md object-cover border"
                        />
                        {item.quantity > 1 && (
                          <Badge
                            variant="secondary"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {item.quantity}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">ID: {item.product.id}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            Cantidad: <span className="font-medium">{item.quantity}</span>
                          </span>
                          <span className="text-sm">
                            Precio unitario: <span className="font-medium">{formatCurrency(item.product.price)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatCurrency((Number.parseFloat(item.price) * item.quantity).toString())}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transaction Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Información de Transacción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">ID de Transacción</p>
                      <p className="font-medium">#{order.transaction_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Procesamiento</p>
                      <p className="font-medium">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Resumen de Orden
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(getSubtotal().toString())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Impuestos:</span>
                  <span>Incluidos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Gestionar Estado
                </CardTitle>
                <CardDescription>Actualiza el estado de la orden</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado actual:</label>
                  <Badge variant={statusConfig.variant} className={statusConfig.className}>
                    <StatusIcon className="h-4 w-4 mr-2" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cambiar a:</label>
                  <Select onValueChange={handleStatusUpdate} disabled={updatingStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nuevo estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="paid">Pagada</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {updatingStatus && <p className="text-sm text-muted-foreground">Actualizando estado...</p>}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Factura
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email al Cliente
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push(`/admin/orders`)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Ver Todas las Órdenes
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}
