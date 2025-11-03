"use client"
import { useState,useMemo } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet,SheetContent,SheetHeader,SheetTitle,SheetFooter,SheetClose } from "@/components/ui/sheet"
import { ExternalLink,ArrowLeft } from "lucide-react"

type SubAccount={id:string;name:string;phone:string}
type Site={id:string;code:string;accountId:string;name:string;owner:string;phone:string;address:string;users:number;startDate:string;status:"active"|"inactive";alarm?:boolean;memo?:string;subAccounts?:SubAccount[]}

const initialData:Site[]=[
{id:"1",code:"SAMJU001",accountId:"samju-admin",name:"삼주이엔씨 1공장",owner:"김삼주",phone:"010-1001-0001",address:"경기도 화성시",users:150,startDate:"2023-01-15",status:"active",subAccounts:[]},
{id:"2",code:"DAEHAN001",accountId:"daehan-admin",name:"대한기계 본사",owner:"이대한",phone:"010-1001-0003",address:"부산시 강서구",users:95,startDate:"2023-02-20",status:"inactive",subAccounts:[]},
{id:"3",code:"HANIL001",accountId:"hanil-admin",name:"한일산업 2공장",owner:"박한일",phone:"010-2002-0002",address:"인천 남동구",users:123,startDate:"2023-03-10",status:"active",subAccounts:[]},
{id:"4",code:"KANGWON001",accountId:"kangwon-admin",name:"강원기계 본사",owner:"최강원",phone:"010-3003-0003",address:"강원도 원주시",users:88,startDate:"2023-04-05",status:"active",subAccounts:[]},
{id:"5",code:"HANYANG001",accountId:"hanyang-admin",name:"한양테크 1공장",owner:"정한양",phone:"010-4004-0004",address:"경기도 수원시",users:176,startDate:"2023-05-25",status:"inactive",subAccounts:[]},
{id:"6",code:"SEJIN001",accountId:"sejin-admin",name:"세진산업 본사",owner:"이세진",phone:"010-5005-0005",address:"충청북도 청주시",users:142,startDate:"2023-06-18",status:"active",subAccounts:[]},
{id:"7",code:"DAESUNG001",accountId:"daesung-admin",name:"대성ENG 1공장",owner:"유대성",phone:"010-6006-0006",address:"대구 달서구",users:200,startDate:"2023-07-01",status:"inactive",subAccounts:[]},
{id:"8",code:"HYUNDAE001",accountId:"hyundae-admin",name:"현대금속 3공장",owner:"문현대",phone:"010-7007-0007",address:"울산 남구",users:240,startDate:"2023-08-10",status:"active",subAccounts:[]},
{id:"9",code:"SEWON001",accountId:"sewon-admin",name:"세원테크 본사",owner:"배세원",phone:"010-8008-0008",address:"서울 구로구",users:164,startDate:"2023-09-12",status:"active",subAccounts:[]},
{id:"10",code:"MIRAE001",accountId:"mirae-admin",name:"미래전기 2공장",owner:"윤미래",phone:"010-9009-0009",address:"광주 광산구",users:132,startDate:"2023-10-08",status:"inactive",subAccounts:[]}
]

type SortOrder="asc"|"desc"
type SortKey=Extract<keyof Site,"startDate">
type SheetMode="add"|"edit"|"dashboard"|"sub"
type Errors=Partial<Record<"code"|"name"|"owner"|"phone"|"address"|"startDate",string>>

export default function SitesPage(){
const router=useRouter()
const[data,setData]=useState<Site[]>(initialData)
const[search,setSearch]=useState("")
const[statusFilter,setStatusFilter]=useState<"all"|"active"|"inactive">("all")
const[sortOrder,setSortOrder]=useState<SortOrder>("desc")
const[page,setPage]=useState(1)
const pageSize=50
const[sheetOpen,setSheetOpen]=useState(false)
const[sheetMode,setSheetMode]=useState<SheetMode>("add")
const[form,setForm]=useState<Site>({id:"",code:"",accountId:"",name:"",owner:"",phone:"",address:"",users:0,startDate:new Date().toISOString().slice(0,10),status:"active",alarm:true,memo:"",subAccounts:[]})
const[subForms,setSubForms]=useState<SubAccount[]>([{id:"",name:"",phone:""}])
const[errors,setErrors]=useState<Errors>({})
const[currentSite,setCurrentSite]=useState<Site|null>(null)
const sortKey:SortKey="startDate"

const filtered=useMemo(()=>data.filter(s=>{const q=search.trim();const matchSearch=!q||[s.name,s.owner,s.code,s.accountId].some(v=>v.includes(q));const matchFilter=statusFilter==="all"||s.status===statusFilter;return matchSearch&&matchFilter}),[data,search,statusFilter])
const sorted=useMemo(()=>{const arr=[...filtered];const dir=sortOrder==="asc"?1:-1;arr.sort((a,b)=>(new Date(a[sortKey]).getTime()-new Date(b[sortKey]).getTime())*dir);return arr},[filtered,sortOrder])
const pageCount=Math.ceil(sorted.length/pageSize)
const paged=useMemo(()=>{const start=(page-1)*pageSize;return sorted.slice(start,start+pageSize)},[sorted,page])

const openAdd=()=>{setSheetMode("add");setForm({id:"",code:"",accountId:"",name:"",owner:"",phone:"",address:"",users:0,startDate:new Date().toISOString().slice(0,10),status:"active",alarm:true,memo:"",subAccounts:[]});setErrors({});setSheetOpen(true)}
const openEdit=(site:Site)=>{setSheetMode("edit");setForm({...site});setErrors({});setSheetOpen(true)}
const openDashboard=(site:Site)=>{setSheetMode("dashboard");setCurrentSite(site);setSheetOpen(true)}
const openSubAccount=(site:Site)=>{setSheetMode("sub");setCurrentSite(site);setSubForms([{id:"",name:"",phone:""}]);setSheetOpen(true)}
const goBackToEdit=()=>{if(currentSite){setForm(currentSite);setSheetMode("edit")}}
const goDashboardPage=(site:Site)=>{router.push(`/dashboard?site=${encodeURIComponent(site.id)}`)}

const handleCodeChange=(v:string)=>{const onlyLetters=v.replace(/[^A-Za-z]/g,"");const generated=onlyLetters?`${onlyLetters.toLowerCase()}-admin`:"";setForm({...form,code:v,accountId:generated})}
const handlePhoneChange=(value:string,callback:(v:string)=>void)=>{const sanitized=value.replace(/[^0-9-]/g,"");callback(sanitized)}

const validate=()=>{const e:Errors={};if(!form.code.trim())e.code="필수 입력";if(!form.name.trim())e.name="필수 입력";if(!form.owner.trim())e.owner="필수 입력";if(!form.phone.trim())e.phone="필수 입력";if(!form.address.trim())e.address="필수 입력";if(!form.startDate.trim())e.startDate="필수 입력";setErrors(e);return Object.keys(e).length===0}
const saveForm=()=>{if(!validate())return;if(sheetMode==="add"){const nid=String(Date.now());setData(p=>[{...form,id:nid},...p])}else if(sheetMode==="edit"){setData(p=>p.map(v=>v.id===form.id?{...form}:v))}setSheetOpen(false)}

const addSubForm=()=>{setSubForms(p=>[...p,{id:"",name:"",phone:""}])}
  
const saveSubAccount=()=>{if(!currentSite)return;const valid=subForms.every(f=>f.name.trim()&&f.phone.trim());if(!valid)return alert("모든 행의 이름과 전화번호를 입력해주세요.");const base=currentSite.accountId.replace("-admin","");const newSubs=subForms.map((s,i)=>({...s,id:`${base}-manager${(currentSite.subAccounts?.length??0)+i+1}`}));const updated={...currentSite,subAccounts:[...(currentSite.subAccounts||[]),...newSubs]};setData(p=>p.map(v=>v.id===currentSite.id?updated:v));setCurrentSite(updated);setSubForms([{id:"",name:"",phone:""}])}

const columns:ColumnDef<Site>[]=[
{id:"no",header:"No.",cell:({row})=><span className="text-slate-500">{row.index+1}</span>,enableSorting:false},
{accessorKey:"code",header:"업장코드"},
{accessorKey:"name",header:"업장명"},
{accessorKey:"accountId",header:"대표계정ID"},
{accessorKey:"owner",header:"대표자명"},
{accessorKey:"phone",header:"연락처"},
{accessorKey:"address",header:"사업장주소지"},
{accessorKey:"users",header:"앱 이용자 수"},
{accessorKey:"startDate",header:"등록일"},
{id:"link",header:"링크",cell:({row})=>(<span onClick={()=>goDashboardPage(row.original)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border bg-white text-gray-600 cursor-pointer hover:bg-gray-50"><ExternalLink className="w-3 h-3"/><span>바로가기</span></span>)},
{accessorKey:"status",header:"상태",cell:({row})=>(<span className={`px-2 py-1 rounded-md text-xs ${row.original.status==="active"?"bg-blue-100 text-blue-600":"bg-gray-100 text-gray-500"}`}>{row.original.status==="active"?"활성":"비활성"}</span>)},
{id:"actions",header:"관리",cell:({row})=>(<div className="flex items-center gap-1 text-[13px]"><span onClick={()=>openDashboard(row.original)} className="text-gray-400 underline cursor-pointer hover:text-gray-700">업장 대시보드</span><span className="text-gray-300">/</span><span onClick={()=>openEdit(row.original)} className="text-gray-400 underline cursor-pointer hover:text-gray-700">편집</span></div>)}
]

const errCls=(k:keyof Errors)=>errors[k]?"border-red-600 focus-visible:ring-red-600":""
const clearErr=(k:keyof Errors)=>{if(errors[k])setErrors(p=>{const n={...p};delete n[k];return n})}
const recent7ForSite=(s:Site|null)=>{if(!s)return 0;const d=new Date(s.startDate).getTime();const now=Date.now();const days=(now-d)/86400000;return days<=7?s.users:0}

return(<main className="p-5 md:p-6 space-y-4">
<div><h1 className="text-lg font-semibold">업장관리</h1></div>
<div className="flex items-center justify-between pt-1"><span className="text-xs text-slate-500">총 {sorted.length}건</span><Button onClick={openAdd} className="bg-[#0a2540] hover:bg-[#071b2e] text-white md:h-9 md:px-4">업장 등록</Button></div>
<div className="flex flex-col md:flex-row gap-3 md:gap-4">
<Input placeholder="업장코드, 업장명, 대표자명, 검색" className="w-full md:w-[300px]" value={search} onChange={e=>setSearch(e.target.value)}/>
<Select value={statusFilter} onValueChange={v=>setStatusFilter(v as"all"|"active"|"inactive")}><SelectTrigger className="w-full md:w-40"><SelectValue placeholder="상태 선택"/></SelectTrigger><SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="active">활성</SelectItem><SelectItem value="inactive">비활성</SelectItem></SelectContent></Select>
<Select value={sortOrder} onValueChange={v=>setSortOrder(v as SortOrder)}><SelectTrigger className="w-full md:w-32"><SelectValue placeholder="정렬"/></SelectTrigger><SelectContent><SelectItem value="desc">최신순</SelectItem><SelectItem value="asc">오래된순</SelectItem></SelectContent></Select>
</div>
<DataTable className="min-w-[900px]" columns={columns} data={paged}/>
<div className="flex justify-center gap-2 mt-4"><Button variant="outline" disabled={page===1} onClick={()=>setPage(p=>p-1)}>이전</Button>{Array.from({length:pageCount},(_,i)=>(<Button key={i} variant={page===i+1?"default":"outline"} onClick={()=>setPage(i+1)}>{i+1}</Button>))}<Button variant="outline" disabled={page===pageCount} onClick={()=>setPage(p=>p+1)}>다음</Button></div>
<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
<SheetContent side="right" className="bg-white w-full sm:max-w-xl p-0 h-full">
{(sheetMode==="add"||sheetMode==="edit")&&(<>
<SheetHeader className="px-4 md:px-6 py-3 border-b"><SheetTitle className="text-base font-semibold">{sheetMode==="add"?"업장등록":"업장편집"}</SheetTitle></SheetHeader>
<div className="overflow-y-auto px-3 md:px-6 py-3">
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
<div className="space-y-1"><Label>업장명<span className="text-red-600 ml-1">*</span></Label><Input className={errCls("name")} value={form.name} onChange={e=>{setForm({...form,name:e.target.value});clearErr("name")}}/></div>
<div className="space-y-1"><Label>업장코드<span className="text-red-600 ml-1">*</span></Label><Input value={form.code} onChange={e=>handleCodeChange(e.target.value)} className={errCls("code")}/></div>
<div className="space-y-1"><Label>대표자명<span className="text-red-600 ml-1">*</span></Label><Input value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})} className={errCls("owner")}/></div>
<div className="space-y-1"><Label>연락처<span className="text-red-600 ml-1">*</span></Label><Input value={form.phone} onChange={e=>handlePhoneChange(e.target.value,v=>setForm({...form,phone:v}))} className={errCls("phone")}/></div>
</div>
<div className="mt-4 space-y-1"><Label>대표계정ID</Label><div className="flex gap-2"><Input readOnly value={form.accountId} className="bg-gray-50"/><Button variant="outline" onClick={()=>openSubAccount(form)}>서브계정 추가</Button></div></div>
<div className="space-y-1 mt-4"><Label>사업장주소지<span className="text-red-600 ml-1">*</span></Label><Input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className={errCls("address")}/></div>
<div className="space-y-1 mt-4"><Label>등록일<span className="text-red-600 ml-1">*</span></Label><Input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} className={errCls("startDate")}/></div>
<div className="space-y-1 mt-4"><Label>메모</Label><Textarea value={form.memo||""} onChange={e=>setForm({...form,memo:e.target.value})} className="min-h-28 resize-y"/></div>
<div className="mt-4 space-y-3"><div className="flex items-center gap-2"><span className="text-xs text-slate-500">알림끄기</span><Switch checked={form.alarm??true} onCheckedChange={c=>setForm({...form,alarm:c})}/><span className="text-xs text-slate-500">알림켜기</span></div><div className="flex items-center gap-2"><span className="text-xs text-slate-500">업장 비활성화</span><Switch checked={form.status==="active"} onCheckedChange={c=>setForm({...form,status:c?"active":"inactive"})}/><span className="text-xs text-slate-500">활성</span></div></div></div>
<SheetFooter className="px-4 md:px-6 py-3 border-t"><SheetClose asChild><Button variant="outline">취소</Button></SheetClose><Button onClick={saveForm} className="bg-[#0a2540] hover:bg-[#071b2e] text-white">{sheetMode==="add"?"등록":"저장"}</Button></SheetFooter></>)}
{sheetMode==="sub"&&(<><SheetHeader className="flex items-center justify-between px-4 md:px-6 py-3 border-b"><div className="flex items-center gap-1 justify-start"><Button variant="ghost" size="icon" onClick={goBackToEdit}><ArrowLeft className="w-5 h-5"/></Button><SheetTitle className="text-base font-semibold">{currentSite?.name} 서브계정 추가</SheetTitle></div></SheetHeader><div className="overflow-y-auto px-3 md:px-6 py-3 space-y-4">{subForms.map((sf,i)=>(<div key={i} className="border border-slate-200 rounded-md p-3 grid grid-cols-1 md:grid-cols-2 gap-3"><div className="space-y-1"><Label>서브계정ID</Label><Input readOnly value={`${currentSite?.accountId.replace("-admin","")}-manager${(currentSite?.subAccounts?.length??0)+i+1}`} className="bg-gray-50"/></div><div className="space-y-1"><Label>이름</Label><Input value={sf.name} onChange={e=>setSubForms(p=>p.map((x,idx)=>idx===i?{...x,name:e.target.value}:x))}/></div><div className="space-y-1"><Label>휴대전화번호</Label><Input value={sf.phone} onChange={e=>handlePhoneChange(e.target.value,v=>setSubForms(p=>p.map((x,idx)=>idx===i?{...x,phone:v}:x)))}/></div></div>))}<div className="flex justify-between"><Button variant="outline" onClick={addSubForm}>서브계정 추가</Button><Button onClick={saveSubAccount} className="bg-[#0a2540] hover:bg-[#071b2e] text-white">등록</Button></div>{(currentSite?.subAccounts?.length??0)>0&&(<div className="mt-4"><div className="text-sm font-semibold mb-2 text-slate-700">등록된 서브계정</div><div className="border border-slate-200 rounded-md divide-y divide-slate-100">{currentSite?.subAccounts?.map((s,i)=>(<div key={i} className="flex justify-between items-center p-2 text-sm"><div className="flex gap-4"><span className="text-gray-600">{s.id}</span><span>{s.name}</span><span>{s.phone}</span></div><span className="text-gray-400">등록됨</span></div>))}</div></div>)}</div></>)}
{sheetMode==="dashboard"&&(<><SheetHeader className="px-4 md:px-6 py-3 border-b"><SheetTitle className="text-base font-semibold">{currentSite?.name} 업장 대시보드</SheetTitle></SheetHeader><div className="h-[calc(100%-6rem)] overflow-y-auto px-3 md:px-6 py-3"><div className="grid grid-cols-2 gap-3 mb-3"><div className="rounded-lg border p-3"><div className="text-slate-500 text-xs">총 앱 이용자수</div><div className="text-xl font-semibold">{(currentSite?.users??0).toLocaleString()}</div></div><div className="rounded-lg border p-3"><div className="text-slate-500 text-xs">최근 7일 가입</div><div className="text-xl font-semibold">{recent7ForSite(currentSite).toLocaleString()}</div></div></div><div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg border p-3"><div className="text-slate-500">업장코드</div><div className="font-medium">{currentSite?.code}</div></div><div className="rounded-lg border p-3"><div className="text-slate-500">대표자명</div><div className="font-medium">{currentSite?.owner}</div></div><div className="rounded-lg border p-3"><div className="text-slate-500">연락처</div><div className="font-medium">{currentSite?.phone}</div></div><div className="rounded-lg border p-3"><div className="text-slate-500">등록일</div><div className="font-medium">{currentSite?.startDate}</div></div><div className="rounded-lg border p-3 col-span-2"><div className="text-slate-500">사업장주소지</div><div className="font-medium">{currentSite?.address}</div></div><div className="rounded-lg border p-3 col-span-2"><div className="text-slate-500">상태</div><div className={`inline-block mt-1 px-2 py-1 rounded-md text-xs font-medium ${currentSite?.status==="active"?"bg-blue-100 text-blue-600":"bg-gray-100 text-gray-500"}`}>{currentSite?.status==="active"?"활성":"비활성"}</div></div><div className="rounded-lg border p-3 col-span-2"><div className="text-slate-500">서브계정 수</div><div className="font-medium">{currentSite?.subAccounts?.length??0}</div></div>{(currentSite?.subAccounts?.length??0)>0&&(<div className="rounded-lg border p-3 col-span-2"><div className="text-slate-500 mb-2">등록된 서브계정</div><div className="border border-slate-200 rounded-md divide-y divide-slate-100">{currentSite?.subAccounts?.map((s,i)=>(<div key={i} className="flex justify-between items-center p-2 text-sm"><div className="flex gap-4"><span className="text-gray-600">{s.id}</span><span>{s.name}</span><span>{s.phone}</span></div><span className="text-gray-400">등록됨</span></div>))}</div></div>)}</div></div></>)}
</SheetContent></Sheet></main>)
}