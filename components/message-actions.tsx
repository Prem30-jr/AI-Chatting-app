"use client"

import { Copy, RotateCcw, Edit2 } from "lucide-react"
import type { Message } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface MessageActionsProps {
  message: Message
  onRegenerate?: () => void
  onEdit?: (newPrompt: string) => void
}

export function MessageActions({ message, onRegenerate, onEdit }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState("")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEditStart = () => {
    setIsEditing(true)
    setEditText(message.content)
  }

  const handleEditSubmit = () => {
    if (onEdit && editText.trim()) {
      onEdit(editText)
      setIsEditing(false)
    }
  }

  return (
    <>
      {isEditing && (
        <div className="mt-2 p-2 bg-background/50 rounded border border-border">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full resize-none bg-input border border-border rounded px-2 py-1 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleEditSubmit} className="h-6 text-xs">
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-6 text-xs">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="flex gap-2 items-center text-xs opacity-0 group-hover:opacity-100 transition-opacity -mt-2 pt-1">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 h-6 px-2 hover:bg-muted">
            <Copy className="w-3 h-3" />
            {copied ? "Copied!" : "Copy"}
          </Button>

          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} className="gap-1 h-6 px-2 hover:bg-muted">
              <RotateCcw className="w-3 h-3" />
              Regenerate
            </Button>
          )}

          {onEdit && (
            <Button variant="ghost" size="sm" onClick={handleEditStart} className="gap-1 h-6 px-2 hover:bg-muted">
              <Edit2 className="w-3 h-3" />
              Edit
            </Button>
          )}
        </div>
      )}
    </>
  )
}
