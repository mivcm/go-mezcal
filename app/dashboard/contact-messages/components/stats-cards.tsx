"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, AlertCircle, Calendar, CheckCircle } from "lucide-react"

interface StatsResponse {
  total_messages: number
  unread_messages: number
  recent_messages: number
  read_percentage: number
}

interface StatsCardsProps {
  stats: StatsResponse | null
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.total_messages}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Sin leer</span>
          </div>
          <p className="text-2xl font-bold">{stats.unread_messages}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Recientes</span>
          </div>
          <p className="text-2xl font-bold">{stats.recent_messages}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Leídos</span>
          </div>
          <p className="text-2xl font-bold">{stats.read_percentage}%</p>
        </CardContent>
      </Card>
    </div>
  )
} 