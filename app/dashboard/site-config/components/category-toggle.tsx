"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import { CategoryConfig } from "../data"

interface CategoryToggleProps {
  categories: Record<string, CategoryConfig>
  onToggleCategory: (categoryKey: string, isActive: boolean) => void
}

export function CategoryToggle({ categories, onToggleCategory }: CategoryToggleProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <h3 className="font-medium">Gestionar Categorías</h3>
      </div>
      
      <div className="grid gap-3">
        {Object.entries(categories).map(([key, category]) => (
          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <category.icon className="h-4 w-4" />
              <div>
                <div className="font-medium">{category.label}</div>
                <div className="text-sm text-muted-foreground">{category.description}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? "Activa" : "Inactiva"}
              </Badge>
              <Switch
                checked={category.isActive}
                onCheckedChange={(checked) => onToggleCategory(key, checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 