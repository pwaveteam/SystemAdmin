"use client"
import {useState,useMemo,useEffect,ChangeEvent} from "react"
import type {ReactElement} from "react"
import {ColumnDef} from "@tanstack/react-table"
import {DataTable} from "@/components/data-table"
import {Button} from "@/components/ui/button"
import {ChevronRight} from "lucide-react"

type FormDoc={
id:string
buttonLabel:string
buttonLocation:string
fileUrl?:string
fileName?:string
position:number
createdAt:string
updatedAt:string
}

const initialData:FormDoc[]=[
{id:"f1",buttonLabel:"안전검사신청서 양식",buttonLocation:"자산관리/위험기계·기구·설비",fileUrl:"/files/safety-inspection.docx",fileName:"safety-inspection.docx",position:1,createdAt:"2025-09-01",updatedAt:"2025-09-01"},
{id:"f2",buttonLabel:"안전작업허가서 양식",buttonLocation:"안전작업허가서/안전작업허가서 목록",fileUrl:"/files/work-permit.docx",fileName:"work-permit.docx",position:2,createdAt:"2025-09-01",updatedAt:"2025-09-01"},
{id:"f3",buttonLabel:"평가지 양식",buttonLocation:"도급협의체관리/안전보건수준 평가",fileUrl:"/files/evaluation.docx",fileName:"evaluation.docx",position:3,createdAt:"2025-09-01",updatedAt:"2025-09-01"},
{id:"f4",buttonLabel:"회의록 양식",buttonLocation:"도급협의체관리/도급안전보건 협의체",fileUrl:"/files/meeting.docx",fileName:"meeting.docx",position:4,createdAt:"2025-09-01",updatedAt:"2025-09-01"},
{id:"f5",buttonLabel:"점검지 양식",buttonLocation:"도급협의체관리/안전보건 점검",fileUrl:"/files/checklist.docx",fileName:"checklist.docx",position:5,createdAt:"2025-09-01",updatedAt:"2025-09-01"},
{id:"f6",buttonLabel:"비상대응체계 가이드",buttonLocation:"대응매뉴얼/대응매뉴얼 목록",fileUrl:"/files/emergency-guide.pdf",fileName:"emergency-guide.pdf",position:6,createdAt:"2025-09-01",updatedAt:"2025-09-01"},
{id:"f7",buttonLabel:"경영방침 양식",buttonLocation:"사업장관리/경영방침",fileUrl:"/files/policy.docx",fileName:"policy.docx",position:7,createdAt:"2025-09-01",updatedAt:"2025-09-01"},
{id:"f8",buttonLabel:"안전보건정보 조사표 내려받기",buttonLocation:"위험성평가/사전 체크리스트",fileUrl:"/files/precheck-info.xlsx",fileName:"precheck-info.xlsx",position:8,createdAt:"2025-09-01",updatedAt:"2025-09-01"},
{id:"f9",buttonLabel:"위험성평가 실시규정 예시 내려받기",buttonLocation:"위험성평가/사전 체크리스트",fileUrl:"/files/riskrule-example.pdf",fileName:"riskrule-example.pdf",position:9,createdAt:"2025-09-01",updatedAt:"2025-09-01"}
]

export default function FormsPage():ReactElement{
const today=():string=>new Date().toISOString().slice(0,10)
const [data,setData]=useState<FormDoc[]>(initialData)
const [page,setPage]=useState<number>(1)
const pageSize=10

const ordered=useMemo<FormDoc[]>(()=>[...data].sort((a,b)=>a.position-b.position),[data])
const pageCount=Math.max(1,Math.ceil(ordered.length/pageSize))
const paged=useMemo<FormDoc[]>(()=>{const s=(page-1)*pageSize;return ordered.slice(s,s+pageSize)},[ordered,page])

useEffect(()=>{if(page>pageCount)setPage(pageCount)},[pageCount,page])

const handleUpload=(id:string)=>(e:ChangeEvent<HTMLInputElement>):void=>{
const file=e.target.files&&e.target.files[0]
if(!file)return
const url=URL.createObjectURL(file)
setData(prev=>prev.map(v=>v.id===id?{...v,fileUrl:url,fileName:file.name,updatedAt:today()}:v))
}

const formatSegment=(s:string):string=>{
if(/위험기계[·/]?기구[·/]?설비/.test(s)) return "위험기계/기구/설비"
return s
}

const BreadcrumbText=({path}:{path:string}):ReactElement=>{
const parts=path.split("/")
return(
<div className="flex items-center gap-1 text-[13px] text-slate-600">
{parts.map((p,idx)=>(
<span key={`${p}-${idx}`} className="inline-flex items-center">
{formatSegment(p)}
{idx<parts.length-1&&<ChevronRight aria-hidden className="mx-1 h-3.5 w-3.5 text-slate-400"/>}
</span>
))}
</div>
)
}

const UploadInline=({rowId,filename}:{rowId:string;filename?:string}):ReactElement=>{
const inputId=`uploader-${rowId}`
return(
<div className="flex flex-col gap-1">
<div className="flex items-center gap-3">
<input id={inputId} type="file" className="hidden" onChange={handleUpload(rowId)} accept=".doc,.docx,.xls,.xlsx,.pdf,.hwp,.hwpx"/>
<label htmlFor={inputId} className="text-sm underline underline-offset-4 cursor-pointer hover:opacity-80">파일 업로드</label>
<span className="text-sm text-slate-400 truncate max-w-[260px]">{filename||"—"}</span>
</div>
</div>
)
}

const columns:ColumnDef<FormDoc>[]=[
{accessorKey:"position",header:"No."},
{accessorKey:"buttonLabel",header:"버튼명"},
{accessorKey:"buttonLocation",header:"버튼 위치",cell:({row})=>(<BreadcrumbText path={row.original.buttonLocation}/>)},
{id:"upload",header:"파일 업로드",cell:({row})=>(<UploadInline rowId={row.original.id} filename={row.original.fileName}/>)},
{accessorKey:"createdAt",header:"등록일"}
]

return(
<main className="p-5 md:p-6 space-y-4">
<div><h1 className="text-lg font-semibold">서식관리</h1></div>
<div className="flex items-center justify-between pt-1">
<span className="text-xs text-slate-500">총 {ordered.length}건</span>
<span className="text-[13px] text-slate-400">지원되는 파일 형식: doc, docx, xls, xlsx, hwp, hwpx, pdf</span>
</div>
<DataTable className="min-w-[600px] md:min-w-auto" columns={columns} data={paged}/>
<div className="flex justify-center gap-2 mt-4">
<Button variant="outline" disabled={page===1} onClick={()=>setPage(p=>p-1)}>이전</Button>
{Array.from({length:pageCount},(_,i)=>(<Button key={i} variant={page===i+1?"default":"outline"} onClick={()=>setPage(i+1)}>{i+1}</Button>))}
<Button variant="outline" disabled={page===pageCount} onClick={()=>setPage(p=>p+1)}>다음</Button>
</div>
</main>
)
}
