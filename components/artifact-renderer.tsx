"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Copy } from "lucide-react"
import type { Artifact } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface ArtifactRendererProps {
  artifact: Artifact
  onToggleExpand: (id: string) => void
}

export function ArtifactRenderer({ artifact, onToggleExpand }: ArtifactRendererProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(artifact.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-lg border border-border bg-muted/50 overflow-hidden">
      {/* Artifact Header */}
      <div
        className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-muted/80 hover:bg-muted transition-colors cursor-pointer"
        onClick={() => onToggleExpand(artifact.id)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(artifact.id)
            }}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            {artifact.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold truncate">
              {artifact.title || `${artifact.type.charAt(0).toUpperCase()}${artifact.type.slice(1)}`}
            </h4>
            {artifact.language && <p className="text-xs text-muted-foreground font-mono">{artifact.language}</p>}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleCopy()
          }}
          className="flex-shrink-0 h-6 px-2 gap-1 text-xs"
        >
          <Copy className="w-3 h-3" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Artifact Content */}
      {artifact.isExpanded && (
        <div className="p-4">
          {artifact.type === "code" && (
            <pre className="overflow-x-auto bg-background rounded p-3 text-xs leading-relaxed font-mono text-foreground">
              <code>{artifact.content}</code>
            </pre>
          )}

          {artifact.type === "markdown" && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="space-y-2 text-sm">
                {artifact.content.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          )}

          {artifact.type === "html" && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none rounded bg-background p-3"
              dangerouslySetInnerHTML={{ __html: artifact.content }}
            />
          )}
        </div>
      )}

      {/* Collapsed Preview */}
      {!artifact.isExpanded && (
        <div className="px-4 py-2 text-xs text-muted-foreground bg-background">Click to expand...</div>
      )}
    </div>
  )
}
