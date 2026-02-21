"use client"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function SyncSearchParams({ setSearch, setSector, setScoreMin } : 
  { setSearch: (val: string) => void, setSector: (val: string) => void, setScoreMin: (val: number) => void }) {

  const searchParams = useSearchParams()

  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setSector(searchParams.get("sector") || "")
    setScoreMin(Number(searchParams.get("scoreMin") || 0))
  }, [searchParams, setSearch, setSector, setScoreMin])

  return null
}
