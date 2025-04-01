import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Sparkles, MessageSquare, PaintbrushIcon as PaintBrush } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Staries AI</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Advanced AI for Chat & Art Generation</h2>
          <p className="text-gray-300 mb-12 text-lg">
            Experience the power of Staries AI - a cybersecurity-focused AI assistant and creative art generator in one
            platform.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Staries Chat</h3>
                <p className="text-gray-400 mb-6 text-center">
                  Interact with our cybersecurity-focused AI assistant for insights and analysis.
                </p>
                <Link href="/chat" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Chatting</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <PaintBrush className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Staries Art</h3>
                <p className="text-gray-400 mb-6 text-center">
                  Generate unique AI artwork based on your creative prompts.
                </p>
                <Link href="/art" className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Create Art</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Staries AI • Created by Painzy</p>
      </footer>
    </div>
  )
}

