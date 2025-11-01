"use client"

import { useEffect, useState } from "react"

interface StickyQuestionHeaderProps {
  question?: string
}

export function StickyQuestionHeader({ question }: StickyQuestionHeaderProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(!!question)
  }, [question])

  if (!isVisible || !question) {
    return null
  }

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-b from-card to-card/80 backdrop-blur-sm border-b border-border px-4 py-3 shadow-sm animate-in fade-in-50 duration-200">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-foreground inline-block mr-2">Q:</span>
          <span className="text-muted-foreground break-words">{question}</span>
        </p>
      </div>
    </div>
  )
}
