// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

export default function LoginPage(){
const [id,setId]=useState('')
const [pw,setPw]=useState('')
const [remember,setRemember]=useState(false)
const [loading,setLoading]=useState(false)
const [error,setError]=useState<string|null>(null)

async function onSubmit(e:React.FormEvent<HTMLFormElement>){
e.preventDefault()
setError(null)

if(!id.trim()){setError('아이디를 입력하세요');return}
if(!pw.trim()){setError('비밀번호를 입력하세요');return}

setLoading(true)
try{
console.log({id,pw,remember})
await new Promise((_,reject)=>setTimeout(()=>reject(new Error("invalid")),600))
}catch{
setError("아이디 또는 비밀번호를 확인해주세요.")
}finally{
setLoading(false)
}
}

return(
<main className="min-h-dvh flex flex-col items-center justify-center bg-[#0b1118] text-white relative">
<div className="w-full flex flex-col items-center">
<div className="mb-8 text-center">
<h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">로그인</h2>
</div>

<div className="w-full max-w-md px-6">
<section className="rounded-2xl border border-white/15 bg-[#0f1623] p-8 shadow-lg">
<h1 className="sr-only">로그인</h1>
<form onSubmit={onSubmit} className="space-y-6">
<div>
<label htmlFor="userId" className="block text-sm mb-1.5 text-white/80">아이디</label>
<input id="userId" type="text" autoComplete="username" value={id} onChange={e=>setId(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0b1118] px-3 py-2.5 text-sm placeholder:text-white/35 outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10" placeholder="아이디를 입력하세요"/>
</div>
<div>
<label htmlFor="password" className="block text-sm mb-1.5 text-white/80">비밀번호</label>
<input id="password" type="password" autoComplete="current-password" value={pw} onChange={e=>setPw(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0b1118] px-3 py-2.5 text-sm placeholder:text-white/35 outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10" placeholder="비밀번호를 입력하세요"/>
</div>
<div className="flex items-center justify-between">
<label htmlFor="remember" className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer">
<Checkbox id="remember" checked={remember} onCheckedChange={v=>setRemember(!!v)} className="border-white/40 data-[state=checked]:bg-[#0F1E3A] data-[state=checked]:border-[#0F1E3A] data-[state=checked]:text-white"/>
<span className="select-none">아이디 저장</span>
</label>
</div>
{error&&<p className="text-sm text-red-400">{error}</p>}
<button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-700 hover:bg-slate-600 px-3 py-3.5 text-sm font-medium text-white transition disabled:opacity-50">{loading?'로그인 중...':'로그인'}</button>
</form>
</section>
</div>
</div>

<footer className="fixed bottom-6 left-1/2 -translate-x-1/2 text-center text-xs text-white/50">
© {new Date().getFullYear()} Pulsewave. All rights reserved
</footer>
</main>
)
}