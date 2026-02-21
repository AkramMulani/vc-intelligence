import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return Response.json({ error: "URL required" }, { status: 400 })
    }

    // Fetch public website
    const response = await fetch(url)
    const html = await response.text()

    // Trim HTML (Gemini also has token limits)
    const trimmed = html.slice(0, 15000)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    })

    const prompt = `
You are a VC intelligence extractor.

Extract structured JSON in this EXACT format:

{
  "summary": "",
  "whatTheyDo": [],
  "keywords": [],
  "signals": []
}

Rules:
- Summary: 1-2 sentences.
- whatTheyDo: 3-6 bullet points.
- keywords: 5-10 keywords.
- signals: 2-4 inferred signals (careers page exists, blog present, changelog, hiring, etc.)
- Return ONLY valid JSON. No markdown. No explanation.

Website HTML:
${trimmed}
`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean possible markdown wrapping
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(cleaned)

    return Response.json({
      data: parsed,
      source: url,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Enrichment failed" },
      { status: 500 }
    )
  }
}
