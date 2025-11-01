"use client"

import type React from "react"

import { MessageSquare } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon = <MessageSquare className="w-12 h-12 text-muted-foreground/40" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4 p-6">
      <div className="flex items-center justify-center">{icon}</div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
    </div>
  )
}
