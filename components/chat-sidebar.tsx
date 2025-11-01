"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/hooks/use-chat-store"
import { cn } from "@/lib/utils"

export function ChatSidebar() {
  const { sessions, currentSessionId, createSession, deleteSession, setCurrentSession } = useChatStore()

  const handleNewChat = () => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    createSession(`Chat - ${timestamp}`)
  }

  return (
    <div className="w-full md:w-64 border-r border-border bg-card flex flex-col h-screen">
      {/* Header with new chat button */}
      <div className="p-4 border-b border-border">
        <Button onClick={handleNewChat} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No chats yet. Create one to get started!</div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "px-3 py-2 mx-2 my-1 rounded-lg cursor-pointer transition-colors flex items-center gap-2 group",
                currentSessionId === session.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
              onClick={() => setCurrentSession(session.id)}
            >
              <div className="flex-1 truncate text-sm">{session.title}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSession(session.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 hover:text-destructive" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">AI Chat App</div>
    </div>
  )
}
