"use client"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function AdminMenu() {
const [open, setOpen] = useState(false)
const menuRef = useRef<HTMLDivElement>(null)

useEffect(() => {
const handler = (e: MouseEvent) => {
if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
setOpen(false)
}
}
document.addEventListener("mousedown", handler)
return () => document.removeEventListener("mousedown", handler)
}, [])

return (
<div className="relative" ref={menuRef}>
<button
onClick={() => setOpen(v => !v)}
className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer select-none"
>
<div className="w-7 h-7 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-semibold">
재일
</div>
<span className="text-sm font-normal text-slate-700">master</span>
<ChevronDown className="w-4 h-4 text-slate-500" />
</button>
{open && (
<div className="absolute right-0 mt-2 w-36 rounded-md border border-slate-200 bg-white shadow-sm">
<button className="w-full text-left text-sm px-3 py-2 hover:bg-slate-50">
로그아웃
</button>
</div>
)}
</div>
)
}