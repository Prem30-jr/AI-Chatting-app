"use client"

import { useState, useCallback } from "react"
import type { Message } from "@/lib/types"
import { MessageActions } from "./message-actions"
import { ArtifactRenderer } from "./artifact-renderer"
import { useChatStore } from "@/hooks/use-chat-store"

interface MessageContentProps {
  message: Message
  sessionId?: string
  onRegenerate?: () => void
}

export function MessageContent({ message, sessionId, onRegenerate }: MessageContentProps) {
  const { updateMessage } = useChatStore()
  const [expandedArtifacts, setExpandedArtifacts] = useState<Set<string>>(
    new Set(message.artifacts?.map((a) => a.id) || []),
  )

  const handleToggleExpand = (artifactId: string) => {
    const newSet = new Set(expandedArtifacts)
    if (newSet.has(artifactId)) {
      newSet.delete(artifactId)
    } else {
      newSet.add(artifactId)
    }
    setExpandedArtifacts(newSet)
  }

  const handleEdit = useCallback(
    (newContent: string) => {
      if (sessionId) {
        updateMessage(sessionId, message.id, { content: newContent })
      }
    },
    [sessionId, message.id, updateMessage],
  )

  return (
    <div className="space-y-3 group">
      <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">{message.content}</div>

      {/* Artifacts */}
      {message.artifacts && message.artifacts.length > 0 && (
        <div className="space-y-2">
          {message.artifacts.map((artifact) => (
            <ArtifactRenderer
              key={artifact.id}
              artifact={{
                ...artifact,
                isExpanded: expandedArtifacts.has(artifact.id),
              }}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </div>
      )}

      {/* Message actions */}
      {message.role === "assistant" && !message.isStreaming && (
        <MessageActions message={message} onRegenerate={onRegenerate} onEdit={handleEdit} />
      )}
    </div>
  )
}
