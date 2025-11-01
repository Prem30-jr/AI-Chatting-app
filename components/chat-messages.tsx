"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MessageContent } from "./message-content"

interface ChatMessagesProps {
  messages: Message[]
  sessionId?: string
  onRegenerate?: (messageId: string) => void
}

export function ChatMessages({ messages, sessionId, onRegenerate }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div ref={containerRef} className="flex flex-col gap-4 py-4 px-4 max-w-4xl mx-auto w-full">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
            <p className="text-sm">Ask me anything to get started.</p>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 animate-in fade-in-50 slide-in-from-bottom-4",
            message.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          <div
            className={cn(
              "max-w-2xl rounded-lg px-4 py-3",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground border border-border",
            )}
          >
            <MessageContent
              message={message}
              sessionId={sessionId}
              onRegenerate={onRegenerate && message.role === "assistant" ? () => onRegenerate(message.id) : undefined}
            />
          </div>
        </div>
      ))}

      {/* Streaming indicator */}
      {messages.some((m) => m.isStreaming) && (
        <div className="flex gap-3 px-4 animate-in fade-in-50">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            Thinking...
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
