import { NextResponse } from "next/server"
import { fetchLatestLotto } from "@/lib/fetchLatestLotto"

export const revalidate = 600

export async function GET() {
  try {
    return NextResponse.json(await fetchLatestLotto())
  } catch (error) {
    console.error("Error fetching lottery data:", error)
    return NextResponse.json({ error: "Failed to fetch lottery data" }, { status: 500 })
  }
}
