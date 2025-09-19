// src/app/settings/page.tsx
"use client"
import {useState} from "react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Card,CardHeader,CardTitle,CardContent} from "@/components/ui/card"

type UserProfile={company:string;email:string;phone:string;id:string;owner:string}
type PasswordForm={current:string;next:string;confirm:string}
const VERSION="v1.3.0";const BUILD_DATE="2025-08-27"

export default function SettingsPage(){
const [profile,setProfile]=useState<UserProfile>({
company:"주식회사 재일노무법인",
id:"master",
email:"admin@example.com",
phone:"01012345678",
owner:"박재일"
})
const [draft,setDraft]=useState<UserProfile>(profile)
const [pwd,setPwd]=useState<PasswordForm>({current:"",next:"",confirm:""})

const emailOk=(v:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const phoneOk=(v:string)=>/^[0-9]{9,15}$/.test(v)
const formatPhone=(v:string)=>v.replace(/^(\d{3})(\d{3,4})(\d{4})$/,"$1-$2-$3")

const saveAll=()=>{
const email=draft.email
if(!emailOk(email))return window.alert("이메일 형식이 올바르지 않습니다.")
if(!phoneOk(draft.phone))return window.alert("연락처는 숫자만 9~15자리로 입력하세요.")
if(pwd.current||pwd.next||pwd.confirm){
if(pwd.next.length<8)return window.alert("새 비밀번호는 8자 이상이어야 합니다.")
if(pwd.next!==pwd.confirm)return window.alert("새 비밀번호가 일치하지 않습니다.")
}
setPwd({current:"",next:"",confirm:""})
setProfile(draft)
window.alert("설정이 저장되었습니다.")
}

const splitEmail=(e:string)=>{const [id,domain]=e.split("@");return{id,domain:domain||""}}
const emailParts=splitEmail(draft.email)

return(
<main className="p-5 md:p-6 space-y-5">
<h1 className="text-lg font-semibold">설정</h1>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<Card>
<CardHeader className="pb-2"><CardTitle className="text-base">계정 정보</CardTitle></CardHeader>
<CardContent className="space-y-3 text-sm">
<div><div className="text-slate-500 text-xs">시스템 계정</div><div className="font-medium">{profile.id||"—"}</div></div>
<div><div className="text-slate-500 text-xs">회사명</div><div className="font-medium">{profile.company||"—"}</div></div>
<div><div className="text-slate-500 text-xs">대표자명</div><div className="font-medium">{profile.owner||"—"}</div></div>
<div><div className="text-slate-500 text-xs">대표 이메일</div><div className="font-medium break-all">{profile.email||"—"}</div></div>
<div><div className="text-slate-500 text-xs">대표 연락처</div><div className="font-medium">{profile.phone?formatPhone(profile.phone):"—"}</div></div>
</CardContent>
</Card>
<Card className="md:col-span-2">
<CardHeader className="pb-2"><CardTitle className="text-base">설정 변경</CardTitle></CardHeader>
<CardContent className="space-y-6">
<div className="space-y-4">
<div className="space-y-1">
<Label htmlFor="emailId">대표 이메일</Label>
<div className="flex items-center gap-2">
<Input id="emailId" value={emailParts.id} onChange={e=>setDraft({...draft,email:`${e.target.value}@${emailParts.domain}`})}/>
<span>@</span>
<Input id="emailDomain" value={emailParts.domain} onChange={e=>setDraft({...draft,email:`${emailParts.id}@${e.target.value}`})}/>
</div>
</div>
<div className="space-y-1">
<Label htmlFor="phone">대표 연락처</Label>
<Input id="phone" type="tel" inputMode="numeric" pattern="[0-9]*" value={draft.phone} onChange={e=>{if(/^[0-9]*$/.test(e.target.value))setDraft({...draft,phone:e.target.value})}}/>
</div>
</div>
<div className="pt-4 border-t space-y-3">
<div className="text-sm font-medium">비밀번호 변경</div>
<div className="space-y-3">
<div className="space-y-1"><Label htmlFor="cur">현재 비밀번호</Label><Input id="cur" type="password" value={pwd.current} onChange={e=>setPwd({...pwd,current:e.target.value})}/></div>
<div className="space-y-1"><Label htmlFor="new">새 비밀번호</Label><Input id="new" type="password" value={pwd.next} onChange={e=>setPwd({...pwd,next:e.target.value})}/></div>
<div className="space-y-1"><Label htmlFor="con">새 비밀번호 확인</Label><Input id="con" type="password" value={pwd.confirm} onChange={e=>setPwd({...pwd,confirm:e.target.value})}/></div>
</div>
</div>
</CardContent>
</Card>
</div>
<div className="flex justify-end"><Button onClick={saveAll} className="bg-[#0a2540] hover:bg-[#071b2e] text-white">저장</Button></div>
</main>
)}