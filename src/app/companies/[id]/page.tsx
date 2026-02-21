"use client"

import { useParams } from "next/navigation"
import { companies } from "@/lib/mock-data"
import { useEffect, useState } from "react"
import Button from "@/components/ui/Button"
import Select from "@/components/ui/Select"

export default function CompanyProfilePage() {
    const params = useParams()
    const company = companies.find((c) => c.id === params.id)

    const [enrichment, setEnrichment] = useState<any>(() => {
      if (typeof window !== "undefined" && company?.id) {
        const cached = localStorage.getItem(`enrichment-${company.id}`)
        return cached ? JSON.parse(cached) : null
      }
      return null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [notes, setNotes] = useState(() => {
        if (typeof window !== "undefined" && company?.id) {
            return localStorage.getItem(`notes-${company.id}`) || ""
        }
        return ""
    })

    const [selectedList, setSelectedList] = useState("")
    const [lists, setLists] = useState<any[]>([])
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
      const stored = localStorage.getItem("vc-lists")
      if (stored) {
        setLists(JSON.parse(stored))
      }
    }, [])

    if (!company) {
        return <div>Company not found</div>
    }

    function isInList(list: any) {
      return list.companyIds.includes(company?.id)
    }

    function addToList(listId: string) {
      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          if (!list.companyIds.includes(company?.id)) {
            return {
              ...list,
              companyIds: [...list.companyIds, company?.id]
            }
          }
        }
        return list
      })

      setLists(updatedLists)
      localStorage.setItem("vc-lists", JSON.stringify(updatedLists))
      setShowDropdown(false)
    }

    // Save Notes
    const handleSaveNotes = () => {
        localStorage.setItem(`notes-${company.id}`, notes)
    }

    function calculateScore(company: any, enrichment: any) {
      if (!enrichment) return null

      console.log("Calculating score with enrichment:", enrichment)
      console.log("Company data:", company)

      let score = 0
      let reasons: string[] = []

      const keywords = enrichment.data.keywords.map((k: string) =>
        k.toLowerCase()
      )

      const signals = enrichment.data.signals.map((s: string) =>
        s.toLowerCase()
      )

      // AI focus
      if (
        keywords.includes("ai") ||
        keywords.includes("machine learning")
      ) {
        score += 25
        reasons.push("AI-native positioning")
      }

      // B2B SaaS
      if (keywords.includes("saas") || keywords.includes("b2b")) {
        score += 20
        reasons.push("B2B SaaS model")
      }

      // Early stage preference
      if (company.stage === "Pre-Seed" || company.stage === "Seed") {
        score += 15
        reasons.push("Early-stage company")
      }

      // Hiring signal
      if (signals.some((s: string) => s.includes("hiring") || s.includes("careers") || s.includes("jobs") || s.includes("internships"))) {
        score += 15
        reasons.push("Active hiring signals")
      }

      // Product updates
      if (
        signals.some((s: string) =>
          s.includes("product") || s.includes("changelog")
        )
      ) {
        score += 15
        reasons.push("Product iteration visible")
      }

      // Cap score
      score = Math.min(score, 100)

      return { score, reasons }
    }

    const scoring = enrichment
      ? calculateScore(company, enrichment)
      : null

  return (
    <div className="space-y-10 max-w-4xl text-gray-900">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-white font-semibold tracking-tight">
            {company.name}
          </h1>
          <a
            href={company.website}
            target="_blank"
            className="text-sm text-gray-500 hover:underline"
          >
            {company.website}
          </a>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-2 text-sm font-medium rounded-md bg-black text-white hover:bg-gray-800 transition"
          >
            Add to List
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-20 animate-in fade-in duration-150">
              {lists.length === 0 && (
                <div className="p-3 text-sm text-gray-500">
                  No lists created
                </div>
              )}

              {lists.map((list) => {
                const exists = isInList(list)

                return (
                  <div
                    key={list.id}
                    onClick={() => {
                      if (!exists) addToList(list.id)
                    }}
                    className={`flex justify-between items-center px-3 py-2 text-sm ${
                      exists
                        ? "text-gray-400 cursor-default"
                        : "hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    <span>{list.name}</span>

                    {exists && (
                      <span className="text-green-600 font-medium">
                        ✓
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-medium">Overview</h2>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Sector</p>
            <p>{company.sector}</p>
          </div>

          <div>
            <p className="text-gray-500">Stage</p>
            <p>{company.stage}</p>
          </div>

          <div>
            <p className="text-gray-500">Location</p>
            <p>{company.location}</p>
          </div>

          <div>
            <p className="text-gray-500">Tags</p>
            <p>{company.tags.join(", ")}</p>
          </div>
        </div>
      </div>

      {/* Signals Timeline */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Signals</h2>

        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Recently launched product v2</li>
          <li>• Hiring ML engineers</li>
          <li>• Active blog updates</li>
        </ul>
      </div>

      {/* Notes */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Notes</h2>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          rows={4}
          placeholder="Add your investment notes..."
        />

        <Button onClick={handleSaveNotes}>
          Save Notes
        </Button>
      </div>

      {/* Enrichment Placeholder */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Live Enrichment</h2>

        <button
          onClick={async () => {
            try {
              setLoading(true)
              setError("")

              const res = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: company.website })
              })

              const data = await res.json()

              if (!res.ok) throw new Error(data.error)

              setEnrichment(data)

              localStorage.setItem(
                `enrichment-${company.id}`,
                JSON.stringify(data)
              )

            } catch (err: any) {
              setError(err.message)
            } finally {
              setLoading(false)
            }
          }}
          className="px-4 py-2 text-sm font-medium rounded-md bg-black text-white hover:bg-gray-800 transition"
        >
          {loading ? (
            <span className="animate-pulse">Analyzing website...</span>
          ) : (
            "Enrich from Website"
          )}
        </button>

        {loading && (
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 space-y-2">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-black underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && enrichment && (
          <div className="space-y-4 mt-4 text-sm">

            <div>
              <h3 className="font-medium">Summary</h3>
              <p>{enrichment.data.summary}</p>
            </div>

            <div>
              <h3 className="font-medium">What They Do</h3>
              <ul className="list-disc ml-5">
                {enrichment.data.whatTheyDo.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Keywords</h3>
              <div className="flex gap-2 flex-wrap">
                {enrichment.data.keywords.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium">Derived Signals</h3>
              <ul className="list-disc ml-5">
                {enrichment.data.signals.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-gray-500">
              Source: {enrichment.source} <br />
              Extracted: {new Date(enrichment.timestamp).toLocaleString()}
            </div>

          </div>
        )}
      </div>

      {scoring && (
        <div className="mt-6 p-4 bg-gray-50 border rounded">
          <h3 className="font-medium mb-2">Thesis Match Score</h3>

          <div className="text-2xl font-semibold">
            {scoring.score}%
          </div>

          <ul className="text-sm mt-2 list-disc ml-5">
            {scoring.reasons.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          <p className="text-xs text-gray-500 mt-2">
            Score derived from extracted website signals aligned to fund thesis.
          </p>
        </div>
      )}

    </div>
  )
}
