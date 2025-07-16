"use client"

import { useEffect, useState } from "react"
import { useUserAuthStore } from "@/hooks/use-user-auth-store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/types"
import api from "@/lib/axios"
import {
  Package,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Eye,
  RotateCcw,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"

interface OrderItem {
  product: Product
  quantity: number
  price: string
}

interface Order {
  id: number
  created_at: string
  status: "pending" | "paid" | "completed" | "cancelled"
  total: string
  items: OrderItem[]
  user: {
    id: number
    email: string
  }
  transaction_id: number
  shipping_address?: string
  payment_method?: string
}

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  paid: { label: "Pagado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  completed: { label: "Completado", color: "bg-blue-100 text-blue-800", icon: Package },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function OrdersPage() {
  const { token } = useUserAuthStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/v1/orders")
        const ordersData = data.orders || data
        setOrders(ordersData)
        setFilteredOrders(ordersData)
      } catch (err: any) {
        setError(err.message || "Error al cargar órdenes")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [token, router])

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        (order.id + "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "highest":
          return parseFloat(b.total) - parseFloat(a.total)
        case "lowest":
          return parseFloat(a.total) - parseFloat(b.total)
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, sortBy])

  console.log(filteredOrders);
  

  const OrderSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="container py-12 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-16 max-w-6xl">
        <Card className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar órdenes</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Mis Órdenes</h1>
        <Badge variant="secondary" className="ml-auto">
          {orders.length} {orders.length === 1 ? "orden" : "órdenes"}
        </Badge>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de orden o producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="paid">Pagado</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más reciente</SelectItem>
                <SelectItem value="oldest">Más antiguo</SelectItem>
                <SelectItem value="highest">Mayor precio</SelectItem>
                <SelectItem value="lowest">Menor precio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="text-center p-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {orders.length === 0 ? "No tienes órdenes aún" : "No se encontraron órdenes"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {orders.length === 0
              ? "Cuando realices tu primera compra, aparecerá aquí."
              : "Intenta ajustar los filtros de búsqueda."}
          </p>
          {orders.length === 0 && (
            <Button onClick={() => router.push("/products")}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Explorar productos
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig["pending"];
            const StatusIcon = statusInfo.icon

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Orden #{order.id}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${parseFloat(order.total).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">MXN</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Payment and Shipping Info */}
                  {(order.payment_method || order.shipping_address) && (
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      {order.payment_method && (
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{order.payment_method}</span>
                        </div>
                      )}
                      {order.shipping_address && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{order.shipping_address}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Products */}
                  <div>
                    <h4 className="font-medium mb-3">Productos ({order.items.length})</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={`${item.product.id}-${index}`}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                        >
                          <div className="relative h-16 w-16 bg-muted rounded-md overflow-hidden">
                            <Image
                              src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : "/placeholder.svg?height=64&width=64"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium truncate">{item.product.name}</h5>
                            <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${Number.parseFloat(item.price).toLocaleString()} MXN</div>
                            <div className="text-sm text-muted-foreground">
                              ${(Number.parseFloat(item.price) / item.quantity).toLocaleString()} c/u
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </Button>
                    {order.status === "completed" && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reordenar
                      </Button>
                    )}
                    {order.status === "pending" && (
                      <Button variant="destructive" size="sm">
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
