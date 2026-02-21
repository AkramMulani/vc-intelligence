"use client"

import { useState } from "react"

interface Option {
  label: string
  value: string
}

export default function Select({
  options,
  value,
  onChange,
}: {
  options: Option[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative w-48">
      <button
        onClick={() => setOpen(!open)}
        className="w-full border rounded-md px-3 py-2 text-sm text-left text-white flex justify-between items-center"
      >
        <span>{selected?.label || "Select"}</span>
        <span className="text-gray-400">▼</span>
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow z-20">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className="px-3 py-2 text-sm text-black hover:bg-gray-200 cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
