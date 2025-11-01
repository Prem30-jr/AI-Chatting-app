"use client"
import { cn } from "@/lib/utils"

interface AutocompleteItem {
  id: string
  title?: string
  name?: string
  category?: string
  username?: string
  avatar?: string
}

interface AutocompleteDropdownProps {
  items: AutocompleteItem[]
  query: string
  selectedIndex: number
  onSelect: (item: AutocompleteItem) => void
  isPeople?: boolean
  isLoading?: boolean
}

export function AutocompleteDropdown({
  items,
  query,
  selectedIndex,
  onSelect,
  isPeople = false,
  isLoading = false,
}: AutocompleteDropdownProps) {
  if (!items.length && !isLoading) {
    return null
  }

  const highlightMatch = (text: string) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, "i"))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-semibold bg-yellow-200 text-black">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="absolute bottom-full mb-1 left-0 right-0 bg-background border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
      {isLoading && (
        <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground border-t-foreground animate-spin" />
          Searching...
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="px-3 py-2 text-sm text-muted-foreground">No results found</div>
      )}

      {!isLoading &&
        items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={cn(
              "w-full text-left px-3 py-2 text-sm flex items-center gap-3 hover:bg-accent transition-colors",
              selectedIndex === index && "bg-accent",
            )}
          >
            {isPeople && item.avatar && (
              <img
                src={item.avatar || "/placeholder.svg"}
                alt={item.name}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              {isPeople ? (
                <div>
                  <div className="font-medium truncate">{highlightMatch(item.name || "")}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.username}</div>
                </div>
              ) : (
                <div>
                  <div className="font-medium truncate">{highlightMatch(item.title || "")}</div>
                  {item.category && <div className="text-xs text-muted-foreground">{item.category}</div>}
                </div>
              )}
            </div>
          </button>
        ))}
    </div>
  )
}
