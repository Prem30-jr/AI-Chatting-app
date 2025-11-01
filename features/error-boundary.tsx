"use client"

import { Component, type ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="flex flex-col items-center gap-4 max-w-md">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-lg font-semibold">Something went wrong</h1>
                <p className="text-sm text-muted-foreground">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
              </div>
              <Button onClick={this.handleReset} className="w-full">
                Try again
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
