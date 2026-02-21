export default function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-black"
    />
  )
}
