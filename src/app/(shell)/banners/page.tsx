"use client"
import {useState,useMemo,useEffect} from "react"
import {ColumnDef} from "@tanstack/react-table"
import {DataTable} from "@/components/data-table"
import {Input} from "@/components/ui/input"
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Sheet,SheetContent,SheetHeader,SheetTitle,SheetFooter,SheetClose} from "@/components/ui/sheet"

type BannerStatus="active"|"inactive"
type Banner={id:string;title:string;body:string;url?:string;position:number;status:BannerStatus;createdAt:string;updatedAt:string;memo?:string}
type SheetMode="add"|"edit"
type Errors=Partial<Record<"title"|"body"|"url",string>>

const initialData:Banner[]=[
{id:"b1",title:"법률 대응 지원",body:"중대재해처벌법 관련 법률 자문",url:"https://example.com/law",position:1,status:"active",createdAt:"2024-05-20",updatedAt:"2024-05-20"},
{id:"b2",title:"산재 예방 교육",body:"정기 안전보건 교육 지원",url:"https://example.com/123",position:2,status:"active",createdAt:"2024-06-10",updatedAt:"2024-06-10"},
{id:"b3",title:"노동 분쟁 상담",body:"노사 분쟁 발생 시 전문 자문",url:"https://example.com/",position:3,status:"inactive",createdAt:"2024-07-01",updatedAt:"2024-07-01"},
{id:"b4",title:"근로계약 검토",body:"표준 근로계약서 자문 서비스",url:"https://example.com/test",position:4,status:"active",createdAt:"2024-07-15",updatedAt:"2024-07-15"},
{id:"b5",title:"징계 절차 자문",body:"징계위원회 운영 법률 검토",url:"https://example.com/",position:5,status:"inactive",createdAt:"2024-08-05",updatedAt:"2024-08-05"},
{id:"b6",title:"임금체불 대응",body:"임금체불 분쟁 해결 지원",url:"https://example.com/",position:6,status:"active",createdAt:"2024-08-20",updatedAt:"2024-08-20"},
{id:"b7",title:"산업안전 자문",body:"산업재해 예방 컨설팅 제공",url:"https://example.com",position:7,status:"inactive",createdAt:"2024-09-10",updatedAt:"2024-09-10"},
{id:"b8",title:"노동법 교육",body:"경영진 대상 노동법 특강",url:"https://www.naver.com",position:8,status:"active",createdAt:"2024-09-25",updatedAt:"2024-09-25"},
{id:"b9",title:"단체교섭 지원",body:"노사 단체교섭 법률 자문",url:"https://example.com/",position:9,status:"inactive",createdAt:"2024-10-05",updatedAt:"2024-10-05"},
{id:"b10",title:"퇴직금 자문",body:"퇴직금 규정 및 분쟁 해결",url:"https://example.com/",position:10,status:"inactive",createdAt:"2024-10-20",updatedAt:"2024-10-20"}
]

export default function BannersPage(){
const today=()=>new Date().toISOString().slice(0,10)
const [data,setData]=useState<Banner[]>(initialData)
const [search,setSearch]=useState<string>("")
const [statusFilter,setStatusFilter]=useState<"all"|BannerStatus>("all")
const [sheetOpen,setSheetOpen]=useState<boolean>(false)
const [sheetMode,setSheetMode]=useState<SheetMode>("add")
const [form,setForm]=useState<Banner>({id:"",title:"",body:"",url:"",position:data.length+1,status:"active",createdAt:today(),updatedAt:today(),memo:""})
const [errors,setErrors]=useState<Errors>({})
const [limitMsg,setLimitMsg]=useState<string>("")
const [page,setPage]=useState<number>(1)
const pageSize=10

const activeCount=(list:Banner[])=>list.filter(b=>b.status==="active").length
const filtered=useMemo(()=>data.filter(b=>{const q=search.trim();const m=!q||b.title.includes(q)||b.body.includes(q)||(b.url?.includes(q)||false);const f=statusFilter==="all"||b.status===statusFilter;return m&&f}),[data,search,statusFilter])
const ordered=useMemo(()=>[...filtered].sort((a,b)=>a.position-b.position),[filtered])
const pageCount=Math.max(1,Math.ceil(ordered.length/pageSize))
const paged=useMemo(()=>{const s=(page-1)*pageSize;return ordered.slice(s,s+pageSize)},[ordered,page])

useEffect(()=>{setPage(1)},[search,statusFilter])
useEffect(()=>{if(page>pageCount)setPage(pageCount)},[pageCount,page])

const openAdd=()=>{setSheetMode("add");setForm({id:"",title:"",body:"",url:"",position:(Math.max(0,...data.map(d=>d.position))+1),status:"active",createdAt:today(),updatedAt:today(),memo:""});setErrors({});setLimitMsg("");setSheetOpen(true)}
const openEdit=(b:Banner)=>{setSheetMode("edit");setForm({...b});setErrors({});setLimitMsg("");setSheetOpen(true)}
const onToggleStatus=(toActive:boolean)=>{if(toActive){const base=data.filter(d=>sheetMode==="edit"?d.id!==form.id:true);if(activeCount(base)>=10){setLimitMsg("활성 배너는 최대 10개까지 가능합니다.");return}}setLimitMsg("");setForm({...form,status:toActive?"active":"inactive"})}
const reindex=(list:Banner[])=>list.sort((a,b)=>a.position-b.position).map((v,i)=>({...v,position:i+1}))
const removeBanner=(id:string)=>{if(window.confirm("정말 삭제하시겠습니까?"))setData(p=>reindex(p.filter(v=>v.id!==id)))}

const isValidHttpUrl=(u:string):boolean=>{try{const x=new URL(u);return x.protocol==="http:"||x.protocol==="https:"}catch{return false}}
const validate=():boolean=>{const e:Errors={};if(!form.title.trim())e.title="필수 입력";if(form.title.length>16)e.title="최대 16자";if(!form.body.trim())e.body="필수 입력";if(form.body.length>14)e.body="최대 23자";if(form.url&&form.url.trim()&&!isValidHttpUrl(form.url))e.url="http/https URL만 허용";setErrors(e);return Object.keys(e).length===0}
const save=()=>{if(!validate())return;const next=sheetMode==="add"?reindex([{...form,id:String(Date.now()),position:(Math.max(0,...data.map(d=>d.position))+1),createdAt:today(),updatedAt:today()},...data]):reindex(data.map(v=>v.id===form.id?{...form,updatedAt:today()}:v));if(activeCount(next)>10){setLimitMsg("활성 배너는 최대 10개까지 가능합니다.");return}setData(next);setSheetOpen(false)}
const openUrlCheck=()=>{if(!form.url||!form.url.trim())return;if(!isValidHttpUrl(form.url)){setErrors(p=>({...p,url:"http/https URL만 허용"}));return}window.open(form.url,"_blank","noopener,noreferrer")}

const columns:ColumnDef<Banner>[]=[
{accessorKey:"position",header:"No."},
{accessorKey:"title",header:"제목"},
{accessorKey:"body",header:"본문"},
{accessorKey:"url",header:"링크",cell:({row})=>row.original.url?(<a href={row.original.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{row.original.url}</a>):(<span className="text-slate-400">—</span>)},
{accessorKey:"createdAt",header:"등록일"},
{accessorKey:"status",header:"상태",cell:({row})=>(<span className={`px-2 py-1 rounded-md text-xs ${row.original.status==="active"?"bg-emerald-100 text-emerald-700":"bg-gray-100 text-gray-500"}`}>{row.original.status==="active"?"활성":"비활성"}</span>)},
{id:"actions",header:"관리",cell:({row})=>(<div className="flex items-center gap-1 text-[13px]"><span onClick={()=>openEdit(row.original)} className="text-gray-400 underline cursor-pointer hover:text-gray-700">편집</span><span className="text-gray-300">/</span><span onClick={()=>removeBanner(row.original.id)} className="text-red-400 underline cursor-pointer hover:text-red-600">삭제</span></div>)}
]

const errCls=(k:keyof Errors)=>errors[k]?"border-red-500 focus-visible:ring-red-500":""

return(<main className="p-5 md:p-6 space-y-4">
<div><h1 className="text-lg font-semibold">배너관리</h1></div>
<div className="flex items-center justify-between pt-1"><span className="text-xs text-slate-500">총 {ordered.length}건 · 활성 {activeCount(data)} / 10</span><Button onClick={openAdd} className="bg-[#0a2540] hover:bg-[#071b2e] text-white md:h-9 md:px-4">배너 등록</Button></div>
<div className="flex flex-col md:flex-row gap-3 md:gap-4">
<Input placeholder="내용, 링크 검색" value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full md:w-[300px]"/>
<Select value={statusFilter} onValueChange={(v)=>setStatusFilter(v as any)}><SelectTrigger className="w-full md:w-40"><SelectValue placeholder="상태"/></SelectTrigger><SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="active">활성</SelectItem><SelectItem value="inactive">비활성</SelectItem></SelectContent></Select>
</div>
<DataTable className="min-w-[600px] md:min-w-auto" columns={columns} data={paged}/>
<div className="flex justify-center gap-2 mt-4">
<Button variant="outline" disabled={page===1} onClick={()=>setPage(p=>p-1)}>이전</Button>
{Array.from({length:pageCount},(_,i)=>(<Button key={i} variant={page===i+1?"default":"outline"} onClick={()=>setPage(i+1)}>{i+1}</Button>))}
<Button variant="outline" disabled={page===pageCount} onClick={()=>setPage(p=>p+1)}>다음</Button>
</div>
<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
<SheetContent side="right" className="bg-white w-full sm:max-w-xl p-0 h-full">
<SheetHeader className="px-4 md:px-6 py-3 border-b"><SheetTitle className="text-base font-semibold">{sheetMode==="add"?"배너 등록":"배너 편집"}</SheetTitle></SheetHeader>
<div className="mt-0 h-[calc(100%-10rem)] overflow-y-auto px-3 md:px-6 py-3 space-y-4">
<div className="space-y-1"><Label htmlFor="f-title">제목<span className="text-red-500 ml-1">*</span></Label><Input id="f-title" className={errCls("title")} value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} maxLength={16}/><span className="text-xs text-slate-400">{form.title.length}/16</span>{errors.title&&<div className="text-red-500 text-xs">{errors.title}</div>}</div>
<div className="space-y-1"><Label htmlFor="f-body">본문<span className="text-red-500 ml-1">*</span></Label><Textarea id="f-body" className={errCls("body")} value={form.body} onChange={(e)=>setForm({...form,body:e.target.value})} maxLength={23}/><span className="text-xs text-slate-400">{form.body.length}/23</span>{errors.body&&<div className="text-red-500 text-xs">{errors.body}</div>}</div>
<div className="space-y-1"><Label htmlFor="f-url">링크</Label><div className="flex gap-2"><Input id="f-url" type="url" placeholder="https://" className={`w-full ${errCls("url")}`} value={form.url||""} onChange={(e)=>setForm({...form,url:e.target.value})}/><Button variant="outline" onClick={openUrlCheck} disabled={!form.url||!form.url.trim()}>주소 확인</Button></div>{errors.url&&<div className="text-red-500 text-xs">{errors.url}</div>}</div>
<div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label>등록일</Label><Input value={form.createdAt} disabled/></div><div className="flex items-end"><div className="flex items-center gap-2"><span className="text-xs text-slate-500">비활성</span><Switch checked={form.status==="active"} onCheckedChange={onToggleStatus}/><span className="text-xs text-slate-500">활성</span></div></div></div>
{limitMsg&&<div className="text-red-500 text-xs">{limitMsg} 현재 {activeCount(data)}개 활성</div>}
</div>
<SheetFooter className="px-4 md:px-6 py-3 border-t"><SheetClose asChild><Button variant="outline">취소</Button></SheetClose><Button onClick={save} className="bg-[#0a2540] hover:bg-[#071b2e] text-white">{sheetMode==="add"?"등록":"저장"}</Button></SheetFooter>
</SheetContent>
</Sheet>
</main>)}