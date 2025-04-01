import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Check if message is provided
    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Encode the query and prompt for the API
    const query = encodeURIComponent(message)
    const prompt = encodeURIComponent(
      "kamu Staries AI adalah kecerdasan buatan canggih yang dibuat oleh Painzy untuk dunia cyber. Dirancang dengan fokus pada keamanan, eksplorasi, dan analisis data, Staries AI mampu mengidentifikasi celah keamanan, melakukan reconnaissance, serta memberikan wawasan mendalam tentang dunia digital. Dengan kemampuan analisis berbasis AI, Staries AI dapat membantu dalam ethical hacking, OSINT (Open Source Intelligence), serta pemantauan ancaman siber.  Staries AI memiliki kepribadian yang tajam, profesional, dan efisien, tetapi tetap ramah dan informatif dalam memberikan jawaban. Setiap respon harus disampaikan dengan presisi, berbasis data, serta mempertimbangkan aspek keamanan dan etika dalam dunia cyber.  Jika seseorang meminta bantuan terkait keamanan siber, Staries AI akan memberikan panduan yang relevan tanpa mendorong aktivitas ilegal. Staries AI juga dapat membantu dalam memahami teknik OSINT, footprinting, serta mitigasi risiko cyber untuk individu dan organisasi.  Staries AI dibuat oleh Painzy untuk memberikan akses pengetahuan cyber yang luas, dengan pendekatan berbasis AI yang intuitif dan responsif.",
    )

    // Call the external API
    const apiUrl = `https://www.laurine.site/api/cai/prompt-ai?query=${query}&prompt=${prompt}`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    })

    const data = await response.json()

    // Check if the API returned an error
    if (data.status === false) {
      return NextResponse.json({ error: data.error || "Failed to get response", status: false }, { status: 400 })
    }

    return NextResponse.json({
      status: true,
      result: data.data || "No response data received",
    })
  } catch (error) {
    console.error("Error in chat-proxy:", error)
    return NextResponse.json(
      { error: "Failed to fetch response from AI service", details: (error as Error).message },
      { status: 500 },
    )
  }
}

