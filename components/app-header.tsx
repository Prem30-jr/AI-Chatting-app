"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommandMenu } from "@/features/command-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChatSidebar } from "./chat-sidebar"

export function AppHeader() {
  return (
    <div className="border-b border-border bg-background sticky top-0 z-40">
      <div className="flex items-center justify-between h-14 px-4 gap-4">
        <div className="hidden md:flex flex-1">
          <h1 className="font-semibold text-lg">AI Chat</h1>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <ChatSidebar />
          </SheetContent>
        </Sheet>

        {/* Command menu */}
        <CommandMenu />
      </div>
    </div>
  )
}
