export default function Button({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md bg-black text-white hover:bg-gray-800 transition ${className}`}
    >
      {children}
    </button>
  )
}
