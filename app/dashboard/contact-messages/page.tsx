"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/ui/back-button"
import { Search, RefreshCw, MessageSquare } from "lucide-react"
import { useContactMessages } from "./hooks/use-contact-messages"
//  import { StatsCards } from "./components/stats-cards"
import { MessageCard } from "./components/message-card"

export default function ContactMessagesPage() {
  const {
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
  } = useContactMessages()

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Mensajes de Contacto</h1>
              <p className="text-muted-foreground">Gestiona los mensajes enviados por los visitantes</p>
            </div>

            <Button onClick={() => { loadMessages(); }} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>

          {/* Estadísticas */}
          {/* <StatsCards stats={stats} /> */}

          {/* Filtros */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos los mensajes</option>
              <option value="false">Sin leer</option>
              <option value="true">Leídos</option>
            </select>
          </div>
        </div>

        {/* Lista de mensajes */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No hay mensajes</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterRead !== "all"
                ? "No se encontraron mensajes con los filtros aplicados"
                : "Aún no has recibido mensajes de contacto"
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onMarkAsRead={markAsRead}
                onDelete={deleteMessage}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Paginación */}
        {pagination && pagination.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>

              <span className="text-sm text-muted-foreground">
                Página {pagination.current_page} de {pagination.total_pages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                disabled={currentPage === pagination.total_pages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 