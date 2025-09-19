'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Gauge, Building2, Megaphone, Bell, Settings as Gear, FileDown } from 'lucide-react'
import AdminMenu from '@/components/AdminMenu'

const NAV = [
{ href: '/dashboard', label: '대시보드', Icon: Gauge },
{ href: '/sites', label: '업장관리', Icon: Building2 },
{ href: '/banners', label: '배너관리', Icon: Megaphone },
{ href: '/inbox', label: '알림함', Icon: Bell },
{ href: '/forms', label: '서식관리', Icon: FileDown },
{ href: '/settings', label: '설정', Icon: Gear },
]

export default function ShellLayout({ children }: { children: React.ReactNode }) {
const [open, setOpen] = useState(false)

return (
<div className="h-screen w-screen flex bg-[#EEF3FA]">
<aside className="hidden md:flex md:w-56 bg-[#182339] text-[#EFF3FA] flex-col">
<div className="h-14 flex items-center justify-center">
<Link href="/dashboard" className="flex items-center">
<Image src="/images/logo.png" alt="System Admin" width={150} height={0} style={{ height: 'auto' }} priority/>
</Link>
</div>
<nav className="flex-1 py-3">
<ul className="space-y-1 px-2">
{NAV.map(({ href, label, Icon }) => (
<li key={href}>
<Link href={href} className="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-black/30">
<Icon className="h-4 w-4 opacity-90"/>
<span>{label}</span>
</Link>
</li>
))}
</ul>
</nav>
<div className="p-3 text-xs text-[#EFF3FA]/70 text-center">© {new Date().getFullYear()} Pulsewave</div>
</aside>
{open && (<button aria-label="닫기" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40 md:hidden"/>)}
<aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#182339] text-[#EFF3FA] transform transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`} aria-hidden={!open}>
<div className="h-14 flex items-center justify-between px-4">
<Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center">
<Image src="/images/logo.png" alt="System Admin" width={130} height={0} style={{ height: 'auto' }} priority/>
</Link>
<button aria-label="닫기" onClick={() => setOpen(false)} className="p-2 rounded hover:bg-white/10"><X className="h-5 w-5"/></button>
</div>
<nav className="py-3">
<ul className="space-y-1 px-2">
{NAV.map(({ href, label, Icon }) => (
<li key={href}>
<Link href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-black/30">
<Icon className="h-5 w-5 opacity-90"/>
<span>{label}</span>
</Link>
</li>
))}
</ul>
</nav>
<div className="absolute bottom-0 left-0 right-0 p-3 text-xs text-[#EFF3FA]/70 text-center">© {new Date().getFullYear()} Pulsewave</div>
</aside>
<div className="flex-1 flex flex-col">
<header className="h-12 md:h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
<button className="md:hidden p-2 -ml-2 rounded hover:bg-slate-100" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} onClick={() => setOpen(v => !v)}>
{open ? <X className="h-5 w-5 text-[#182339]"/> : <Menu className="h-5 w-5 text-[#182339]"/>}
</button>
<div className="text-sm text-slate-500 hidden md:block">System Admin</div>
<AdminMenu/>
</header>
<main className="flex-1 bg-[#FDFEFF] overflow-auto">{children}</main>
</div>
</div>
)
}
