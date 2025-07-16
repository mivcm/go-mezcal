"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"

interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  short_message: string
  read: boolean
  created_at: string
  updated_at: string
}

interface PaginationInfo {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

interface ContactMessagesResponse {
  messages: ContactMessage[]
  pagination: PaginationInfo
}

export function useContactMessages() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRead, setFilterRead] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Cargar mensajes
  const loadMessages = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        per_page: 20,
        ...(searchTerm && { email: searchTerm }),
        ...(filterRead !== "all" && { read: filterRead }),
      }

      const response = await api.get("/api/v1/admin/contact_messages", { params })
      const data: ContactMessagesResponse = response.data
      setMessages(data.messages)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Marcar como leído
  const markAsRead = async (messageId: number) => {
    try {
      await api.patch(`/api/v1/admin/contact_messages/${messageId}/mark_as_read`)

      // Actualizar el mensaje en la lista
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      )

      toast({
        title: "Éxito",
        description: "Mensaje marcado como leído",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar como leído",
        variant: "destructive",
      })
    }
  }

  // Eliminar mensaje
  const deleteMessage = async (messageId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este mensaje?")) return

    try {
      await api.delete(`/api/v1/admin/contact_messages/${messageId}`)

      // Remover el mensaje de la lista
      setMessages(prev => prev.filter(msg => msg.id !== messageId))

      toast({
        title: "Éxito",
        description: "Mensaje eliminado correctamente",
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el mensaje",
        variant: "destructive",
      })
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Cargar datos al montar
  useEffect(() => {
    loadMessages()
  }, [currentPage, searchTerm, filterRead])

  return {
    messages,
    pagination,
    loading,
    searchTerm,
    setSearchTerm,
    filterRead,
    setFilterRead,
    currentPage,
    setCurrentPage,
    loadMessages,
    markAsRead,
    deleteMessage,
    formatDate,
  }
} 