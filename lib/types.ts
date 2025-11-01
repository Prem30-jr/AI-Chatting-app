// Type definitions for the AI Chat application
export type MessageRole = "user" | "assistant"

export interface Artifact {
  id: string
  type: "code" | "markdown" | "html"
  language?: string
  title?: string
  content: string
  isExpanded: boolean
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  artifacts?: Artifact[]
  timestamp: number
  isStreaming?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface ChatStore {
  sessions: ChatSession[]
  currentSessionId: string | null
  createSession: (title: string) => string
  deleteSession: (id: string) => void
  addMessage: (sessionId: string, message: Message) => void
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void
  getSession: (id: string) => ChatSession | undefined
  getCurrentSession: () => ChatSession | undefined
  setCurrentSession: (id: string) => void
  clearAllSessions: () => void
}
