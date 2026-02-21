"use client"

import { useState, useMemo, Suspense } from "react"
import { companies } from "@/lib/mock-data"
import Input from "@/components/ui/Input"
import Link from "next/link"
import Select from "@/components/ui/Select"
import SyncSearchParams from "@/components/SyncSearchParams"

export default function CompaniesPage() {

  const [search, setSearch] = useState("")
  const [sector, setSector] = useState("")
  const [scoreMin, setScoreMin] = useState(0)

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      return (
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (search ? c.name.toLowerCase().includes(search.toLowerCase()) : true) &&
        (sector ? c.sector === sector : true) &&
      (scoreMin ? c.score >= scoreMin : true)
      )
    })
  }, [search, sector, scoreMin])
 
  function handleSaveSearch() {
    const name = prompt("Enter a name for this search")
    if (!name) return

    const newSearch = {
      id: crypto.randomUUID(),
      name,
      filters: {
        sector,
        search,
        scoreMin
      },
      createdAt: new Date().toISOString()
    }

    const existing =
      JSON.parse(localStorage.getItem("vc-saved-searches") || "[]")

    const updated = [...existing, newSearch]

    localStorage.setItem(
      "vc-saved-searches",
      JSON.stringify(updated)
    )

    alert("Search saved successfully!")
  }

  return (
    <div className="space-y-8">

      <Suspense fallback={<div>Loading companies...</div>}>
        <SyncSearchParams 
          setSearch={setSearch} 
          setSector={setSector} 
          setScoreMin={setScoreMin} 
        />
      </Suspense>
      
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Discover Companies
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Search and filter companies aligned with your thesis.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 max-w-2xl">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
        />

        <Select
          value={sector}
          onChange={setSector}
          options={[
            { label: "All Sectors", value: "" },
            { label: "AI SaaS", value: "AI SaaS" },
            { label: "Fintech", value: "Fintech" },
            { label: "HealthTech", value: "HealthTech" },
            { label: "IT Services", value: "IT Services" },
            { label: "Job Portal", value: "Job Portal" }
          ]}
        />

        <div className="flex">
          <button
            onClick={handleSaveSearch}
            className="w-30 px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-800 transition"
          >
            Save Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-500">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Name</th>
              <th className="text-left px-6 py-3 font-medium">Sector</th>
              <th className="text-left px-6 py-3 font-medium">Stage</th>
              <th className="text-left px-6 py-3 font-medium">Location</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filtered.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-gray-200 transition"
              >
                <td className="px-6 py-4 font-medium">
                  <Link href={`/companies/${company.id}`} className="hover:underline">
                    {company.name}
                  </Link>
                </td>
                <td className="px-6 py-4">{company.sector}</td>
                <td className="px-6 py-4">{company.stage}</td>
                <td className="px-6 py-4">{company.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
