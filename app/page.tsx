"use client"

import { useState, useCallback, useEffect } from "react"
import { useChatStore } from "@/hooks/use-chat-store"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMessages } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { StickyQuestionHeader } from "@/components/sticky-question-header"
import { AppHeader } from "@/components/app-header"
import { ErrorBoundary } from "@/features/error-boundary"
import type { Message } from "@/lib/types"
import { generateMockStreamingResponse, getArtifactsForResponse } from "@/lib/streaming-utils"

export default function ChatPage() {
  const { isLoaded, getCurrentSession, addMessage, updateMessage } = useChatStore()
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<typeof undefined>()
  const [lastUserQuestion, setLastUserQuestion] = useState<string>()

  const session = getCurrentSession()

  useEffect(() => {
    setCurrentSession(session)
    const lastUserMsg = session?.messages?.reverse().find((m) => m.role === "user")?.content
    setLastUserQuestion(lastUserMsg)
  }, [session])

  const generateMockResponse = useCallback(
    async (userMessage: string, sessionId: string) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
        isStreaming: true,
        timestamp: Date.now(),
      }

      addMessage(sessionId, assistantMessage)

      try {
        const generator = generateMockStreamingResponse(userMessage)
        for await (const chunk of generator) {
          updateMessage(sessionId, assistantMessage.id, {
            content: chunk,
          })
        }

        const artifacts = getArtifactsForResponse(userMessage).map((artifact) => ({
          id: "artifact-" + Date.now() + "-" + Math.random(),
          type: artifact.type as "code" | "markdown" | "html",
          language: artifact.language,
          title: artifact.title,
          content: artifact.content,
          isExpanded: true,
        }))

        updateMessage(sessionId, assistantMessage.id, {
          isStreaming: false,
          artifacts: artifacts.length > 0 ? artifacts : undefined,
        })
      } catch (error) {
        console.error("Error generating response:", error)
        updateMessage(sessionId, assistantMessage.id, {
          isStreaming: false,
          content: assistantMessage.content || "Error generating response. Please try again.",
        })
      }

      setIsLoading(false)
    },
    [addMessage, updateMessage],
  )

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!session) return

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      }

      addMessage(session.id, userMessage)
      setLastUserQuestion(text)
      setIsLoading(true)

      setTimeout(() => {
        generateMockResponse(text, session.id)
      }, 500)
    },
    [session, addMessage, generateMockResponse],
  )

  const handleRegenerate = useCallback(
    (messageId: string) => {
      if (!session) return

      const messageIndex = session.messages.findIndex((m) => m.id === messageId)
      if (messageIndex > 0) {
        const userMessage = session.messages[messageIndex - 1]
        if (userMessage.role === "user") {
          setIsLoading(true)
          setTimeout(() => {
            generateMockResponse(userMessage.content, session.id)
          }, 500)
        }
      }
    },
    [session, generateMockResponse],
  )

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-background text-foreground">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 border-r border-border flex-col">
          <ChatSidebar />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header with Menu */}
          <div className="md:hidden">
            <AppHeader />
          </div>

          <StickyQuestionHeader question={lastUserQuestion} />

          <div className="flex-1 overflow-auto">
            <ChatMessages
              messages={currentSession?.messages || []}
              sessionId={currentSession?.id}
              onRegenerate={handleRegenerate}
            />
          </div>

          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </ErrorBoundary>
  )
}
