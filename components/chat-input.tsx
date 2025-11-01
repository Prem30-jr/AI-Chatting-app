"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AutocompleteDropdown } from "./autocomplete-dropdown"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

interface SearchResult {
  id: string
  title?: string
  category?: string
  url?: string
}

interface Person {
  id: string
  name: string
  username: string
  avatar: string
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [peopleResults, setPeopleResults] = useState<Person[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchMode, setSearchMode] = useState<"general" | "people" | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px"
    }
  }, [input])

  const getSearchQuery = useCallback(() => {
    const cursorPos = textareaRef.current?.selectionStart || input.length
    const textBeforeCursor = input.substring(0, cursorPos)

    // Check for mention (@)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    if (mentionMatch) {
      return { query: mentionMatch[1], mode: "people" as const }
    }

    // Check for general search (when text starts with specific keywords or has certain patterns)
    const generalMatch = textBeforeCursor.match(/\b([a-zA-Z]{2,})$/)
    if (generalMatch && textBeforeCursor.length > 2) {
      return { query: generalMatch[1], mode: "general" as const }
    }

    return { query: "", mode: null }
  }, [input])

  useEffect(() => {
    const { query, mode } = getSearchQuery()

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!query || query.length < 1) {
      setShowAutocomplete(false)
      setSearchResults([])
      setPeopleResults([])
      setSearchMode(null)
      return
    }

    setIsSearching(true)
    setSearchMode(mode)
    setSelectedIndex(0)

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const endpoint = mode === "people" ? "/api/search/people" : "/api/search"
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`)
        const data = await response.json()

        if (mode === "people") {
          setPeopleResults(data.people || [])
        } else {
          setSearchResults(data.results || [])
        }

        setShowAutocomplete(true)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsSearching(false)
      }
    }, 200)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [input, getSearchQuery])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const items = searchMode === "people" ? peopleResults : searchResults
    const isOpen = showAutocomplete && items.length > 0

    if (!isOpen) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleSubmit(e as any)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % items.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length)
        break
      case "Enter":
        e.preventDefault()
        handleSelectItem(items[selectedIndex])
        break
      case "Escape":
        e.preventDefault()
        setShowAutocomplete(false)
        break
      default:
        break
    }
  }

  const handleSelectItem = (item: SearchResult | Person) => {
    const cursorPos = textareaRef.current?.selectionStart || input.length
    const textBeforeCursor = input.substring(0, cursorPos)

    let newInput = input
    if (searchMode === "people") {
      const person = item as Person
      const mentionStart = textBeforeCursor.lastIndexOf("@")
      newInput = input.substring(0, mentionStart) + person.username + " " + input.substring(cursorPos)
    } else {
      const searchStart = textBeforeCursor.search(/\b([a-zA-Z]{2,})$/)
      if (searchStart !== -1) {
        const result = item as SearchResult
        newInput = input.substring(0, searchStart) + (result.title || "") + " " + input.substring(cursorPos)
      }
    }

    setInput(newInput)
    setShowAutocomplete(false)
    setSearchResults([])
    setPeopleResults([])

    // Refocus textarea and move cursor to end
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const newPos = newInput.length
        textareaRef.current.setSelectionRange(newPos, newPos)
      }
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput("")
      setShowAutocomplete(false)
      setSearchResults([])
      setPeopleResults([])
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false)
      }
    }

    if (showAutocomplete) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAutocomplete])

  const currentResults = searchMode === "people" ? peopleResults : searchResults

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 border-t border-border">
      <div className="flex gap-2 items-end max-w-4xl mx-auto relative" ref={containerRef}>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Type @ for mentions, Ctrl+Enter to send)"
            className="w-full resize-none bg-input border border-border rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring"
            rows={1}
            disabled={isLoading}
          />
          <AutocompleteDropdown
            items={currentResults}
            query={getSearchQuery().query}
            selectedIndex={selectedIndex}
            onSelect={handleSelectItem}
            isPeople={searchMode === "people"}
            isLoading={isSearching}
          />
        </div>
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
          Send
        </Button>
      </div>
    </form>
  )
}
