"use client"

import { Sparkles, User, Copy, Check } from "lucide-react"
import { useState, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  // Parse message content to identify code blocks
  const renderMessageContent = () => {
    // Check if the message contains code blocks (text between \`\`\`)
    if (message.content.includes("```")) {
      const parts = message.content.split(/(```[\s\S]*?```)/g)

      return parts.map((part, index) => {
        // Check if this part is a code block
        if (part.startsWith("```") && part.endsWith("```")) {
          // Extract the code and language (if specified)
          let code = part.substring(3, part.length - 3).trim()
          let language = ""

          // Check if the first line specifies a language
          const firstLineEnd = code.indexOf("\n")
          if (firstLineEnd > 0) {
            language = code.substring(0, firstLineEnd).trim()
            // If there's a language specified, remove it from the code
            if (language && !language.includes(" ")) {
              code = code.substring(firstLineEnd + 1)
            } else {
              language = ""
            }
          }

          return <CodeBlock key={index} code={code} language={language} />
        } else {
          // Regular text
          return (
            <div key={index} className="whitespace-pre-wrap break-words">
              {part}
            </div>
          )
        }
      })
    }

    // If no code blocks, just return the content
    return <div className="whitespace-pre-wrap break-words">{message.content}</div>
  }

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-blue-600" : "bg-blue-500/20"
        }`}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-blue-400" />}
      </div>
      <div className={`rounded-lg p-3 max-w-[80%] ${isUser ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"}`}>
        {renderMessageContent()}
      </div>
    </div>
  )
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [copied])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="relative mt-2 mb-2 rounded-md bg-gray-900 overflow-hidden">
      {language && (
        <div className="px-3 py-1 text-xs text-gray-400 bg-gray-800 border-b border-gray-700">{language}</div>
      )}
      <div className="p-3 overflow-x-auto">
        <pre className="text-sm text-gray-300">{code}</pre>
      </div>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}

