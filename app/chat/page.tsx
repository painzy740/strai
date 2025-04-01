"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { ChatMessage } from "@/components/chat-message"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input
    setInput("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Call our proxy API endpoint
      const response = await fetch("/api/chat-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch response")
      }

      const data = await response.json()

      // Add AI response to chat - now using data.result instead of data.data
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.result || "Sorry, I couldn't process that request." },
      ])
    } catch (error) {
      console.error("Error fetching chat response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="container mx-auto py-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <h1 className="text-xl font-bold text-white">Staries Chat</h1>
            </div>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto flex-1 py-4 px-4">
        <Card className="bg-gray-800 border-gray-700 h-[calc(100vh-180px)] flex flex-col">
          <CardContent className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Welcome to Staries Chat</h3>
                <p className="text-gray-400 max-w-md">
                  I'm your cybersecurity-focused AI assistant. Ask me about security analysis, ethical hacking, OSINT,
                  or any cyber-related topics.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Type your message..."
                className="bg-gray-700 border-gray-600"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  )
}

