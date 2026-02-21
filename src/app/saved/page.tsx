"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SavedPage() {
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("vc-saved-searches")
    if (stored) {
      setSavedSearches(JSON.parse(stored))
    }
  }, [])

  function deleteSearch(id: string) {
    const updated = savedSearches.filter((s) => s.id !== id)
    setSavedSearches(updated)
    localStorage.setItem("vc-saved-searches", JSON.stringify(updated))
  }

  function runSearch(search: any) {
    const params = new URLSearchParams()

    if (search.filters.search)
      params.set("search", search.filters.search)

    if (search.filters.sector)
      params.set("sector", search.filters.sector)

    if (search.filters.scoreMin)
      params.set("scoreMin", search.filters.scoreMin)

    router.push(`/companies?${params.toString()}`)
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">
        Saved Searches
      </h1>

      {savedSearches.length === 0 && (
        <p className="text-sm text-gray-500">
          No saved searches yet.
        </p>
      )}

      <div className="space-y-4">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            onClick={() => runSearch(search)}
            className="border rounded-lg p-4 bg-white hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-medium text-gray-900">
                  {search.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Sector: {search.filters.sector || "All"} | 
                  Min Score: {search.filters.scoreMin || 0}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation() // VERY IMPORTANT
                  deleteSearch(search.id)
                }}
                className="text-xs text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
