"use client"

import { useState, useEffect } from "react"
import { useUserAuthStore } from "@/hooks/use-user-auth-store"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import {
  Search,
  Filter,
  Eye,
  Package,
  DollarSign,
  Calendar,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
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

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/v1/admin/orders")
        const ordersData = response.data.orders || response.data
        setOrders(ordersData)
        setFilteredOrders(ordersData)
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar órdenes")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    let filtered = orders

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.total.includes(searchTerm),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 hover:bg-green-200",
        }
      case "pending":
        return {
          variant: "secondary" as const,
          icon: Clock,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        }
      case "cancelled":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          className: "bg-red-100 text-red-800 hover:bg-red-200",
        }
      default:
        return {
          variant: "outline" as const,
          icon: AlertCircle,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const getTotalItems = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  if (loading) {
    return (
      <div className="container py-6 sm:py-12 px-4 max-w-7xl">
        <BackButton />
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-6 sm:py-12 px-4 max-w-7xl">
        <BackButton />
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status.toLowerCase() === "paid").length,
    pending: orders.filter((o) => o.status.toLowerCase() === "pending").length,
    revenue: orders.reduce((sum, order) => sum + Number.parseFloat(order.total), 0),
  }

  return (
    <div className="container py-6 sm:py-12 px-4 max-w-7xl">
      <BackButton />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestión de Órdenes</h1>
            <p className="text-muted-foreground">Administra y supervisa todas las órdenes del sistema</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Órdenes</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pagadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.revenue.toString())}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por ID, email o total..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="paid">Pagadas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Órdenes ({filteredOrders.length})
            </CardTitle>
            <CardDescription>Lista completa de órdenes con detalles y acciones disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No se encontraron órdenes</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusConfig = getStatusConfig(order.status)
                      const StatusIcon = statusConfig.icon

                      return (
                        <TableRow key={order.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{order.user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{order.user?.email || "N/A"}</p>
                                <p className="text-sm text-muted-foreground">ID: {order.user?.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{getTotalItems(order.items)}</span>
                              <span className="text-sm text-muted-foreground">
                                {getTotalItems(order.items) === 1 ? "producto" : "productos"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig.variant} className={statusConfig.className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDate(order.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Ver detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
