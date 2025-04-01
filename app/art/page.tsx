"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PaintbrushIcon as PaintBrush, ArrowLeft, ImageIcon, Loader2, AlertCircle, Download } from "lucide-react"
import Link from "next/link"

export default function ArtPage() {
  const [keyword, setKeyword] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const generateArt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim() || isLoading) return

    setIsLoading(true)
    setError("")

    // Revoke previous object URL to prevent memory leaks
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
      setImageUrl("")
    }

    try {
      // Call our proxy API endpoint
      const response = await fetch("/api/art-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to generate art: ${response.status}`)
      }

      // Get the response as a blob
      const blob = await response.blob()

      // Create an object URL from the blob
      const objectUrl = URL.createObjectURL(blob)
      setImageUrl(objectUrl)
    } catch (error) {
      console.error("Error generating art:", error)
      setError(
        `${error instanceof Error ? error.message : "Unknown error"}. Please try again with a different keyword.`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return

    const a = document.createElement("a")
    a.href = imageUrl
    a.download = "staries-art.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      generateArt(e)
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
              <PaintBrush className="h-5 w-5 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Staries Art</h1>
            </div>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto flex-1 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Generate AI Art</h2>
              <form onSubmit={generateArt} className="flex gap-2">
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a description for your art..."
                  className="bg-gray-700 border-gray-600"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !keyword.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PaintBrush className="h-4 w-4" />}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md flex items-center gap-2 text-red-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col items-center">
            {isLoading ? (
              <div className="h-80 w-full flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 text-purple-400 animate-spin mb-4" />
                  <p className="text-gray-400">Generating your masterpiece...</p>
                </div>
              </div>
            ) : imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Generated AI Art"
                  className="rounded-lg border border-gray-700 shadow-lg max-w-full"
                />
                <Button
                  onClick={handleDownload}
                  className="absolute bottom-4 right-4 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ) : (
              <div className="h-80 w-full flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-gray-400 text-center max-w-md">
                    Enter a description above to generate unique AI artwork
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

