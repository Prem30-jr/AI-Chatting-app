"use client"

import type { ChatSession, Message, ChatStore } from "./types"

const STORAGE_KEY = "chat_sessions"
const CURRENT_SESSION_KEY = "current_session_id"

let store: ChatStore = {
  sessions: [],
  currentSessionId: null,
  createSession: () => "",
  deleteSession: () => {},
  addMessage: () => {},
  updateMessage: () => {},
  getSession: () => undefined,
  getCurrentSession: () => undefined,
  setCurrentSession: () => {},
}

// Load from localStorage
function loadStore() {
  if (typeof window === "undefined") return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const currentId = localStorage.getItem(CURRENT_SESSION_KEY)

    if (stored) {
      store.sessions = JSON.parse(stored)
      store.currentSessionId = currentId
    } else {
      // Initialize with first session
      const firstSession = createNewSession("Chat 1")
      store.sessions = [firstSession]
      store.currentSessionId = firstSession.id
      saveStore()
    }
  } catch (error) {
    console.error("Failed to load store:", error)
  }
}

function saveStore() {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.sessions))
    localStorage.setItem(CURRENT_SESSION_KEY, store.currentSessionId || "")
  } catch (error) {
    console.error("Failed to save store:", error)
  }
}

function createNewSession(title: string): ChatSession {
  return {
    id: Date.now().toString(),
    title,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

// Initialize store
loadStore()

// Create the store object
store = {
  sessions: store.sessions,
  currentSessionId: store.currentSessionId,

  createSession: (title: string) => {
    const session = createNewSession(title)
    store.sessions.unshift(session)
    store.currentSessionId = session.id
    saveStore()
    return session.id
  },

  deleteSession: (id: string) => {
    store.sessions = store.sessions.filter((s) => s.id !== id)
    if (store.currentSessionId === id) {
      store.currentSessionId = store.sessions[0]?.id || null
    }
    saveStore()
  },

  addMessage: (sessionId: string, message: Message) => {
    const session = store.sessions.find((s) => s.id === sessionId)
    if (session) {
      session.messages.push(message)
      session.updatedAt = Date.now()
      saveStore()
    }
  },

  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => {
    const session = store.sessions.find((s) => s.id === sessionId)
    if (session) {
      const message = session.messages.find((m) => m.id === messageId)
      if (message) {
        Object.assign(message, updates)
        session.updatedAt = Date.now()
        saveStore()
      }
    }
  },

  getSession: (id: string) => {
    return store.sessions.find((s) => s.id === id)
  },

  getCurrentSession: () => {
    if (!store.currentSessionId) return undefined
    return store.sessions.find((s) => s.id === store.currentSessionId)
  },

  setCurrentSession: (id: string) => {
    if (store.sessions.find((s) => s.id === id)) {
      store.currentSessionId = id
      saveStore()
    }
  },

  clearAllSessions: () => {
    store.sessions = []
    store.currentSessionId = null
    saveStore()
  },
}

export function getChatStore(): ChatStore {
  return store
}

export function resetStore() {
  store.sessions = []
  store.currentSessionId = null
  loadStore()
}
