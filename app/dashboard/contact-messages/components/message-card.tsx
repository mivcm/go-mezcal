"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Eye, CheckCircle, Trash2, User, Mail, Phone, Calendar } from "lucide-react"

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

interface MessageCardProps {
  message: ContactMessage
  onMarkAsRead: (messageId: number) => void
  onDelete: (messageId: number) => void
  formatDate: (dateString: string) => string
}

export function MessageCard({ message, onMarkAsRead, onDelete, formatDate }: MessageCardProps) {
  return (
    <Card className={`${!message.read ? "border-orange-200 bg-orange-50/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{message.name}</span>
              {!message.read && (
                <Badge variant="destructive" className="text-xs">
                  Sin leer
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {message.email}
              </div>
              {message.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {message.phone}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(message.created_at)}
              </div>
            </div>

            <h4 className="font-medium mb-1">{message.subject}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {message.short_message}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Mensaje de {message.name}</DialogTitle>
                  <DialogDescription>
                    Recibido el {formatDate(message.created_at)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Email:</span>
                      <p>{message.email}</p>
                    </div>
                    {message.phone && (
                      <div>
                        <span className="font-medium">Teléfono:</span>
                        <p>{message.phone}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Asunto:</span>
                    <p>{message.subject}</p>
                  </div>
                  <div>
                    <span className="font-medium">Mensaje:</span>
                    <Textarea
                      value={message.message}
                      readOnly
                      rows={8}
                      className="mt-2"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {!message.read && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead(message.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Leído
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(message.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 