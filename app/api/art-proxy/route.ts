import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json()

    // Check if keyword is provided
    if (!keyword || keyword.trim() === "") {
      return NextResponse.json(
        { error: "Keyword is required", details: "Masukkan kata kunci setelah ?keyword=" },
        { status: 400 },
      )
    }

    // Encode the keyword for the API
    const encodedKeyword = encodeURIComponent(keyword)

    // Call the external API with the keyword parameter
    const apiUrl = `https://zexs-api.vercel.app/artai?keyword=${encodedKeyword}`

    const response = await fetch(apiUrl, {
      method: "GET",
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    // Get the image as a blob and return it directly
    const imageBlob = await response.blob()

    // Return the blob with the appropriate content type
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": imageBlob.type,
        "Content-Disposition": "inline",
      },
    })
  } catch (error) {
    console.error("Error in art-proxy:", error)
    return NextResponse.json(
      { error: "Failed to fetch response from Art AI service", details: (error as Error).message },
      { status: 500 },
    )
  }
}

