"use client"

import { useEffect, useState } from "react"
import { companies } from "@/lib/mock-data"
import Button from "@/components/ui/Button"

interface VCList {
  id: string
  name: string
  companyIds: string[]
}

export default function ListsPage() {
  const [lists, setLists] = useState<VCList[]>([])
  const [newListName, setNewListName] = useState("")
  const [selectedList, setSelectedList] = useState<VCList | null>(null)

  // Load lists
  useEffect(() => {
    const stored = localStorage.getItem("vc-lists")
    if (stored) setLists(JSON.parse(stored))
  }, [])

  // Persist lists
  const persist = (updated: VCList[]) => {
    setLists(updated)
    localStorage.setItem("vc-lists", JSON.stringify(updated))
  }

  // Create list
  const createList = () => {
    if (!newListName.trim()) return

    const newList: VCList = {
      id: crypto.randomUUID(),
      name: newListName,
      companyIds: []
    }

    persist([...lists, newList])
    setNewListName("")
  }

  // Remove company
  const removeCompany = (companyId: string) => {
    if (!selectedList) return

    const updatedList = {
      ...selectedList,
      companyIds: selectedList.companyIds.filter(
        (id) => id !== companyId
      )
    }

    const updatedLists = lists.map((l) =>
      l.id === updatedList.id ? updatedList : l
    )

    persist(updatedLists)
    setSelectedList(updatedList)
  }

  // Export JSON
  const exportJSON = () => {
    if (!selectedList) return

    const data = companies.filter((c) =>
      selectedList.companyIds.includes(c.id)
    )

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedList.name}.json`
    a.click()
  }

  // Export CSV
  const exportCSV = () => {
    if (!selectedList) return

    const data = companies.filter((c) =>
      selectedList.companyIds.includes(c.id)
    )

    const csv = [
      ["Name", "Sector", "Stage", "Location"].join(","),
      ...data.map((c) =>
        [c.name, c.sector, c.stage, c.location].join(",")
      )
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedList.name}.csv`
    a.click()
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Lists
        </h1>
        <p className="text-sm text-gray-500">
          Organize companies into investment lists.
        </p>
      </div>

      {/* Create List */}
      <div className="flex gap-3">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="border rounded-md px-3 py-2 text-sm"
        />
        <Button onClick={createList}>
          Create
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Lists Sidebar */}
        <div className="space-y-3">
          {lists.map((list) => (
            <div
              key={list.id}
              onClick={() => setSelectedList(list)}
              className={`p-3 border rounded cursor-pointer text-sm ${
                selectedList?.id === list.id
                  ? "bg-gray-100 text-black"
                  : "hover:bg-gray-50 hover:text-black text-gray-500"
              }`}
            >
              {list.name}
            </div>
          ))}
        </div>

        {/* Selected List Content */}
        <div className="md:col-span-2">
          {selectedList ? (
            <div className="space-y-6">

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  {selectedList.name}
                </h2>

                <div className="flex gap-2">
                  <Button onClick={exportJSON}>
                    Export JSON
                  </Button>
                  <Button onClick={exportCSV}>
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className="bg-white border rounded-lg divide-y">
                {selectedList.companyIds.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">
                    No companies in this list.
                  </div>
                )}

                {selectedList.companyIds.map((id) => {
                  const company = companies.find(
                    (c) => c.id === id
                  )
                  if (!company) return null

                  return (
                    <div
                      key={id}
                      className="flex justify-between items-center p-4 text-sm"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">
                          {company.name}
                        </p>
                        <p className="text-gray-500">
                          {company.sector} · {company.stage}
                        </p>
                      </div>

                      <button
                        onClick={() => removeCompany(id)}
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>

            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Select a list to view.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
