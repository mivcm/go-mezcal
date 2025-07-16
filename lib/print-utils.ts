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

interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline"
  icon: any
  className: string
  label: string
}

export const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number.parseFloat(amount))
}

export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

export const getStatusConfig = (status: string): StatusConfig => {
  switch (status?.toLowerCase()) {
    case "paid":
      return {
        variant: "default" as const,
        icon: null,
        className: "bg-green-100 text-green-800 hover:bg-green-200",
        label: "Pagada",
      }
    case "completed":
      return {
        variant: "default" as const,
        icon: null,
        className: "bg-green-100 text-green-800 hover:bg-green-200",
        label: "Completada",
      }
    case "pending":
      return {
        variant: "secondary" as const,
        icon: null,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        label: "Pendiente",
      }
    case "cancelled":
      return {
        variant: "destructive" as const,
        icon: null,
        className: "bg-red-100 text-red-800 hover:bg-red-200",
        label: "Cancelada",
      }
    default:
      return {
        variant: "outline" as const,
        icon: null,
        className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        label: status,
      }
  }
}

export const getTotalItems = (order: Order) => {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}

export const getSubtotal = (order: Order) => {
  return order.items.reduce((total, item) => total + Number.parseFloat(item.price) * item.quantity, 0)
}

export const printOrder = (order: Order, onError?: (message: string) => void) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    onError?.("No se pudo abrir la ventana de impresión. Verifica que los bloqueadores de ventanas emergentes estén deshabilitados.")
    return
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Orden #${order.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .customer-info, .order-details {
            flex: 1;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .items-table th, .items-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .items-table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .total-section {
            margin-top: 30px;
            text-align: right;
          }
          .total-row {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
          }
          .status-paid { background-color: #d4edda; color: #155724; }
          .status-completed { background-color: #d4edda; color: #155724; }
          .status-pending { background-color: #fff3cd; color: #856404; }
          .status-cancelled { background-color: #f8d7da; color: #721c24; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Orden #${order.id}</h1>
          <p>Fecha: ${formatDate(order.created_at)}</p>
          <span class="status-badge status-${order.status.toLowerCase()}">${getStatusConfig(order.status).label}</span>
        </div>

        <div class="order-info">
          <div class="customer-info">
            <h3>Información del Cliente</h3>
            <p><strong>Email:</strong> ${order.user?.email || 'N/A'}</p>
            <p><strong>ID de Cliente:</strong> ${order.user?.id || 'N/A'}</p>
          </div>
          <div class="order-details">
            <h3>Detalles de la Orden</h3>
            <p><strong>ID de Transacción:</strong> #${order.transaction_id}</p>
            <p><strong>Total de Artículos:</strong> ${getTotalItems(order)}</p>
          </div>
        </div>

        <h3>Productos</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>ID</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.product.id}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.product.price)}</td>
                <td>${formatCurrency((Number.parseFloat(item.price) * item.quantity).toString())}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div>
            <span>Subtotal: ${formatCurrency(getSubtotal(order).toString())}</span>
          </div>
          <div>
            <span>Impuestos: Incluidos</span>
          </div>
          <div>
            <span>Envío: Gratis</span>
          </div>
          <div class="total-row">
            <span>Total: ${formatCurrency(order.total)}</span>
          </div>
        </div>

        <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
          <p>Documento generado el ${new Date().toLocaleString('es-MX')}</p>
        </div>
      </body>
    </html>
  `

  printWindow.document.write(printContent)
  printWindow.document.close()

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
} 