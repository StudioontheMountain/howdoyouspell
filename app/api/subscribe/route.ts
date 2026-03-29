import { NextRequest, NextResponse } from "next/server"
const AUDIENCE_ID = "f735f6ec-5ac5-4a57-8078-1fc3a8c4eb48"
export async function POST(req: NextRequest) {
  try {
    const { email, term, category } = await req.json()
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    const res = await fetch(
      `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          data: {
            source: "HowDoYouSpell",
            site: "howdoyouspell",
            term: term || "",
            category: category || "",
          },
        }),
      }
    )
    if (!res.ok) {
      const err = await res.json()
      console.error("Resend error:", err)
      return NextResponse.json({ error: "Could not subscribe" }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Subscribe error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
