"use client"

import { useEffect, useState } from "react"
import { useChatStore } from "@/hooks/use-chat-store"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { MoreHorizontal, Plus, Trash2, Settings } from "lucide-react"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const { createSession, sessions, clearAllSessions } = useChatStore()

  // Listen for ⌘K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleNewChat = () => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    createSession(`Chat - ${timestamp}`)
    setOpen(false)
  }

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      clearAllSessions()
      setOpen(false)
    }
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search actions..." />
        <CommandList>
          <CommandEmpty>No actions found.</CommandEmpty>

          <CommandGroup heading="Chat">
            <CommandItem onSelect={handleNewChat}>
              <Plus className="mr-2 h-4 w-4" />
              <span>New Chat</span>
            </CommandItem>
            <CommandItem onSelect={handleClearHistory} disabled={sessions.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Clear All History</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Help text in header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MoreHorizontal className="w-3 h-3" />
        <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted rounded border border-border">⌘K</kbd>
      </div>
    </>
  )
}
