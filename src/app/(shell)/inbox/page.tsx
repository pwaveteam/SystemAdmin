"use client"
import type {ReactElement} from "react"
import {useMemo,useState,useEffect,useCallback} from "react"
import {ColumnDef} from "@tanstack/react-table"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTable} from "@/components/data-table"

type NoticeTitle="유해/위험물질 점검"|"위험기계/기구/설비 점검"|"위험성평가"|"안전보건목표"|"안전보건경영방침"
type Notification={id:string;site:string;phone:string;title:NoticeTitle;category?:string;date:string;memo?:string;detail?:string}

const initialData:Notification[]=[
{id:"1",site:"삼주이엔씨 1공장",phone:"010-1001-0001",title:"유해/위험물질 점검",category:"아세톤",date:"2025-08-31"},
{id:"2",site:"대한기계 본사",phone:"010-2002-0002",title:"위험기계/기구/설비 점검",category:"프레스",date:"2025-08-31"},
{id:"3",site:"한성산업 2공장",phone:"010-3003-0003",title:"위험기계/기구/설비 점검",category:"보일러",date:"2025-08-31"},
{id:"4",site:"영신텍 3라인",phone:"010-4004-0004",title:"위험성평가",category:"화학약품 취급공정 위험성평가",date:"2025-08-31"},
{id:"5",site:"한국에너지 서창",phone:"010-5005-0005",title:"위험성평가",category:"고소작업 위험성평가",date:"2025-08-31"},
{id:"6",site:"대우중공업 1야드",phone:"010-6006-0006",title:"위험성평가",category:"용접작업 위험성평가",date:"2025-08-31"},
{id:"7",site:"삼성전자 A동",phone:"010-7007-0007",title:"안전보건목표",detail:"안전보건목표가 아직 수립되지 않았습니다.",date:"2025-08-28"},
{id:"8",site:"현대제철 인천",phone:"010-8008-0008",title:"안전보건경영방침",detail:"안전보건경영방침이 아직 수립되지 않았습니다.",date:"2025-08-28"},
{id:"9",site:"코리아케미칼",phone:"010-9009-0009",title:"유해/위험물질 점검",category:"위험물 저장탱크",date:"2025-08-31"},
{id:"10",site:"진명전기 2현장",phone:"010-1010-0010",title:"위험성평가",category:"전기설비 위험성평가",date:"2025-08-31"}
]

export default function InboxPage():ReactElement{
const [data,setData]=useState<Notification[]>(initialData)
const [todayOnly,setTodayOnly]=useState<boolean>(false)
const [memoDrafts,setMemoDrafts]=useState<Record<string,string>>({})
const [page,setPage]=useState<number>(1)
const pageSize=10
const today=new Date().toISOString().slice(0,10)

const detailText=useCallback((n:Notification):string=>{
if(n.title==="유해/위험물질 점검"||n.title==="위험기계/기구/설비 점검") return `[${n.category}] 점검일이 3일 전입니다.`
if(n.title==="위험성평가") return `[${n.category}] 완료예정일이 3일 전입니다.`
return n.detail??""
},[])

const filtered=useMemo<Notification[]>(()=>data.filter(n=>!todayOnly||n.date===today),[data,todayOnly,today])
const pageCount=Math.max(1,Math.ceil(filtered.length/pageSize))
const paged=useMemo<Notification[]>(()=>{const s=(page-1)*pageSize;return filtered.slice(s,s+pageSize)},[filtered,page])
useEffect(()=>{setPage(1)},[todayOnly])
useEffect(()=>{if(page>pageCount)setPage(pageCount)},[pageCount,page])

const onMemoChange=useCallback((id:string,val:string):void=>setMemoDrafts(p=>({...p,[id]:val})),[])
const onMemoSave=useCallback((id:string):void=>setData(p=>p.map(n=>n.id===id?{...n,memo:memoDrafts[id]??""}:n)),[memoDrafts])

const columns:ColumnDef<Notification>[]=[
{id:"no",header:"No.",cell:({row})=>( (page-1)*pageSize+row.index+1 )},
{accessorKey:"date",header:"알림일"},
{id:"content",header:"알림 내용",cell:({row})=>(
<div>
<div className="font-medium">{row.original.title.replace(" 점검","")}</div>
<div className="text-[13px] text-slate-600 mt-[2px]">{detailText(row.original)}</div>
</div>
)},
{id:"sitePhone",header:"사업장/연락처",cell:({row})=>(
<div className="flex items-center gap-2">
<span className="text-blue-600">{row.original.site}</span>
<span className="text-slate-400 text-sm">{row.original.phone}</span>
</div>
)},
{id:"memo",header:"메모",cell:({row})=>(
<div className="flex items-start gap-2">
<Textarea value={memoDrafts[row.original.id]??row.original.memo??""} onChange={e=>onMemoChange(row.original.id,e.target.value)} placeholder="메모 입력..." className="min-h-[40px] resize-y text-xs"/>
<Button variant="outline" size="sm" onClick={()=>onMemoSave(row.original.id)}>저장</Button>
</div>
)}
]

return(
<main className="p-5 md:p-6 space-y-4">
<div className="flex items-center justify-between"><h1 className="text-lg font-semibold">알림함</h1></div>
<div className="pt-1">
<span className="text-xs text-slate-500">총 {filtered.length}건</span>
<div className="mt-6">
<label className="flex items-center gap-1 text-xs text-slate-400">
<Checkbox checked={todayOnly} onCheckedChange={c=>setTodayOnly(!!c)}/>오늘 알림만 보기
</label>
</div>
</div>
<div className="overflow-x-auto">
<DataTable className="min-w-[600px] md:min-w-auto" columns={columns} data={paged}/>
</div>
<div className="flex justify-center gap-2 mt-4">
<Button variant="outline" disabled={page===1} onClick={()=>setPage(p=>p-1)}>이전</Button>
{Array.from({length:pageCount},(_,i)=>(
<Button key={i} variant={page===i+1?"default":"outline"} onClick={()=>setPage(i+1)}>{i+1}</Button>
))}
<Button variant="outline" disabled={page===pageCount} onClick={()=>setPage(p=>p+1)}>다음</Button>
</div>
</main>
)
}