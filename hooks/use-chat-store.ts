"use client"

import { useState, useCallback, useEffect } from "react"
import { getChatStore } from "@/lib/store"
import type { ChatSession, Message } from "@/lib/types"

export function useChatStore() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize store from localStorage
  useEffect(() => {
    const store = getChatStore()
    setSessions([...store.sessions])
    setCurrentSessionId(store.currentSessionId)
    setIsLoaded(true)
  }, [])

  const createSession = useCallback((title: string) => {
    const store = getChatStore()
    const id = store.createSession(title)
    setSessions([...store.sessions])
    setCurrentSessionId(store.currentSessionId)
    return id
  }, [])

  const deleteSession = useCallback((id: string) => {
    const store = getChatStore()
    store.deleteSession(id)
    setSessions([...store.sessions])
    setCurrentSessionId(store.currentSessionId)
  }, [])

  const addMessage = useCallback((sessionId: string, message: Message) => {
    const store = getChatStore()
    store.addMessage(sessionId, message)
    setSessions([...store.sessions])
  }, [])

  const updateMessage = useCallback((sessionId: string, messageId: string, updates: Partial<Message>) => {
    const store = getChatStore()
    store.updateMessage(sessionId, messageId, updates)
    setSessions([...store.sessions])
  }, [])

  const setCurrentSession = useCallback((id: string) => {
    const store = getChatStore()
    store.setCurrentSession(id)
    setSessions([...store.sessions])
    setCurrentSessionId(store.currentSessionId)
  }, [])

  const clearAllSessions = useCallback(() => {
    const store = getChatStore()
    store.clearAllSessions()
    setSessions([])
    setCurrentSessionId(null)
  }, [])

  const getCurrentSession = useCallback(() => {
    if (!currentSessionId) return undefined
    return sessions.find((s) => s.id === currentSessionId)
  }, [sessions, currentSessionId])

  return {
    sessions,
    currentSessionId,
    isLoaded,
    createSession,
    deleteSession,
    addMessage,
    updateMessage,
    setCurrentSession,
    clearAllSessions,
    getCurrentSession,
  }
}
