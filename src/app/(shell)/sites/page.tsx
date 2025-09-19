"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { ExternalLink } from "lucide-react";

declare global { interface Window { daum?: any } }

type Site={id:string;code:string;name:string;owner:string;phone:string;address:string;users:number;startDate:string;status:"active"|"inactive";alarm?:boolean;memo?:string};

const initialData:Site[]=[
{id:"1",code:"SAMJU001",name:"삼주이엔씨 1공장",owner:"김삼주",phone:"010-1001-0001",address:"경기도 화성시",users:150,startDate:"2023-01-15",status:"active"},
{id:"2",code:"SAMJU002",name:"삼주이엔씨 2공장",owner:"김삼주",phone:"010-1001-0002",address:"충청남도 아산시",users:120,startDate:"2023-02-01",status:"active"},
{id:"3",code:"DAEHAN001",name:"대한기계 본사",owner:"이대한",phone:"010-1001-0003",address:"부산시 강서구",users:95,startDate:"2023-02-20",status:"inactive"},
{id:"4",code:"DAEHAN002",name:"대한기계 광주지점",owner:"이대한",phone:"010-1001-0004",address:"광주시 광산구",users:80,startDate:"2023-03-05",status:"active"},
{id:"5",code:"HANSUNG001",name:"한성산업 1공장",owner:"정한성",phone:"010-1001-0005",address:"대구시 달성군",users:130,startDate:"2023-03-25",status:"active"},
{id:"6",code:"HANSUNG002",name:"한성산업 2공장",owner:"정한성",phone:"010-1001-0006",address:"경상북도 구미시",users:100,startDate:"2023-04-10",status:"inactive"},
{id:"7",code:"WOORI001",name:"우리정밀화학",owner:"최우리",phone:"010-1001-0007",address:"울산시 북구",users:160,startDate:"2023-05-01",status:"active"},
{id:"8",code:"HANIL001",name:"한일전기",owner:"이한일",phone:"010-1001-0008",address:"서울시 구로구",users:90,startDate:"2023-06-12",status:"active"},
{id:"9",code:"KUKDONG001",name:"국동테크놀로지",owner:"박국동",phone:"010-1001-0009",address:"인천시 연수구",users:140,startDate:"2023-07-05",status:"inactive"},
{id:"10",code:"DAEIL001",name:"대일금속",owner:"박대일",phone:"010-1001-0010",address:"전주시 완산구",users:75,startDate:"2023-08-20",status:"active"},
{id:"11",code:"SAMJU003",name:"삼주이엔씨 3공장",owner:"김삼주",phone:"010-1001-0011",address:"경기도 평택시",users:160,startDate:"2023-09-01",status:"active"},
{id:"12",code:"SAMJU004",name:"삼주이엔씨 4공장",owner:"김삼주",phone:"010-1001-0012",address:"강원도 원주시",users:140,startDate:"2023-09-15",status:"inactive"},
{id:"13",code:"DAEHAN003",name:"대한기계 인천지점",owner:"이대한",phone:"010-1001-0013",address:"인천시 남동구",users:110,startDate:"2023-09-30",status:"active"},
{id:"14",code:"DAEHAN004",name:"대한기계 대전지점",owner:"이대한",phone:"010-1001-0014",address:"대전시 서구",users:105,startDate:"2023-10-10",status:"inactive"},
{id:"15",code:"HANSUNG003",name:"한성산업 3공장",owner:"정한성",phone:"010-1001-0015",address:"전라북도 군산시",users:170,startDate:"2023-10-20",status:"active"},
{id:"16",code:"HANSUNG004",name:"한성산업 4공장",owner:"정한성",phone:"010-1001-0016",address:"전라남도 목포시",users:95,startDate:"2023-11-01",status:"active"},
{id:"17",code:"WOORI002",name:"우리정밀화학 2공장",owner:"최우리",phone:"010-1001-0017",address:"경기도 시흥시",users:120,startDate:"2023-11-15",status:"inactive"},
{id:"18",code:"WOORI003",name:"우리정밀화학 3공장",owner:"최우리",phone:"010-1001-0018",address:"충청북도 청주시",users:150,startDate:"2023-11-25",status:"active"},
{id:"19",code:"HANIL002",name:"한일전기 2공장",owner:"이한일",phone:"010-1001-0019",address:"경상남도 창원시",users:85,startDate:"2023-12-01",status:"active"},
{id:"20",code:"HANIL003",name:"한일전기 3공장",owner:"이한일",phone:"010-1001-0020",address:"부산시 사상구",users:100,startDate:"2023-12-10",status:"inactive"},
{id:"21",code:"KUKDONG002",name:"국동테크놀로지 2공장",owner:"박국동",phone:"010-1001-0021",address:"광주시 북구",users:125,startDate:"2023-12-20",status:"active"},
{id:"22",code:"KUKDONG003",name:"국동테크놀로지 3공장",owner:"박국동",phone:"010-1001-0022",address:"대구시 수성구",users:135,startDate:"2024-01-05",status:"inactive"},
{id:"23",code:"DAEIL002",name:"대일금속 2공장",owner:"박대일",phone:"010-1001-0023",address:"충청남도 천안시",users:140,startDate:"2024-01-15",status:"active"},
{id:"24",code:"DAEIL003",name:"대일금속 3공장",owner:"박대일",phone:"010-1001-0024",address:"세종특별자치시",users:115,startDate:"2024-02-01",status:"inactive"},
{id:"25",code:"SAMJU005",name:"삼주이엔씨 5공장",owner:"김삼주",phone:"010-1001-0025",address:"서울시 금천구",users:175,startDate:"2024-02-15",status:"active"},
{id:"26",code:"DAEHAN005",name:"대한기계 포항지점",owner:"이대한",phone:"010-1001-0026",address:"경상북도 포항시",users:105,startDate:"2024-03-01",status:"active"},
{id:"27",code:"HANSUNG005",name:"한성산업 5공장",owner:"정한성",phone:"010-1001-0027",address:"충청남도 서산시",users:130,startDate:"2024-03-15",status:"inactive"},
{id:"28",code:"WOORI004",name:"우리정밀화학 4공장",owner:"최우리",phone:"010-1001-0028",address:"강원도 춘천시",users:145,startDate:"2024-04-01",status:"active"},
{id:"29",code:"HANIL004",name:"한일전기 4공장",owner:"이한일",phone:"010-1001-0029",address:"경상북도 경주시",users:155,startDate:"2024-04-10",status:"active"},
{id:"30",code:"KUKDONG004",name:"국동테크놀로지 4공장",owner:"박국동",phone:"010-1001-0030",address:"전라북도 익산시",users:165,startDate:"2024-04-20",status:"inactive"}
];

type SortOrder="asc"|"desc";
type SortKey=Extract<keyof Site,"startDate">;
type SheetMode="add"|"edit"|"dashboard";
type Errors=Partial<Record<"code"|"name"|"owner"|"phone"|"address"|"startDate",string>>;

function useDaumPostcode(){
const [ready,setReady]=useState<boolean>(!!window.daum?.Postcode);
useEffect(()=>{if(ready)return;const s=document.createElement("script");s.src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";s.async=true;s.onload=()=>setReady(true);document.body.appendChild(s)},[ready]);
const open=useCallback((onSelect:(addr:string)=>void)=>{if(!window.daum?.Postcode)return;new window.daum.Postcode({oncomplete:(data:any)=>{const addr=(data.roadAddress||data.jibunAddress||"").trim();onSelect(addr)}}).open()},[]);
return{ready,open};
}

type ToggleRowProps={id:string;checked:boolean;onChange:(c:boolean)=>void;left:string;right:string};
function ToggleRow({id,checked,onChange,left,right}:ToggleRowProps){return(<div className="flex items-center gap-2"><span className="text-xs text-slate-500">{left}</span><Switch id={id} checked={checked} onCheckedChange={onChange}/><span className="text-xs text-slate-500">{right}</span></div>)}

export default function SitesPage(){
const router=useRouter();
const [data,setData]=useState<Site[]>(initialData);
const [search,setSearch]=useState<string>("");
const [statusFilter,setStatusFilter]=useState<"all"|"active"|"inactive">("all");
const [sortOrder,setSortOrder]=useState<SortOrder>("desc");
const [page,setPage]=useState<number>(1);
const pageSize=50;
const [sheetOpen,setSheetOpen]=useState<boolean>(false);
const [sheetMode,setSheetMode]=useState<SheetMode>("add");
const [form,setForm]=useState<Site>({id:"",code:"",name:"",owner:"",phone:"",address:"",users:0,startDate:new Date().toISOString().slice(0,10),status:"active",alarm:true,memo:""});
const [errors,setErrors]=useState<Errors>({});
const [currentSite,setCurrentSite]=useState<Site|null>(null);
const {ready:postcodeReady,open:openPostcode}=useDaumPostcode();
const sortKey:SortKey="startDate";

const filtered=useMemo(()=>data.filter(s=>{const q=search.trim();const matchSearch=!q||[s.name,s.owner,s.code].some(v=>v.includes(q));const matchFilter=statusFilter==="all"||s.status===statusFilter;return matchSearch&&matchFilter}),[data,search,statusFilter]);
const sorted=useMemo(()=>{const arr=[...filtered];const dir=sortOrder==="asc"?1:-1;arr.sort((a,b)=>(new Date(a[sortKey]).getTime()-new Date(b[sortKey]).getTime())*dir);return arr},[filtered,sortOrder]);
const pageCount=Math.ceil(sorted.length/pageSize);
const paged=useMemo(()=>{const start=(page-1)*pageSize;return sorted.slice(start,start+pageSize)},[sorted,page]);

const openAdd=()=>{setSheetMode("add");setForm({id:"",code:"",name:"",owner:"",phone:"",address:"",users:0,startDate:new Date().toISOString().slice(0,10),status:"active",alarm:true,memo:""});setErrors({});setSheetOpen(true)};
const openEdit=(site:Site)=>{setSheetMode("edit");setForm({...site,alarm:site.alarm??true,memo:site.memo??""});setErrors({});setSheetOpen(true)};
const openDashboard=(site:Site)=>{setSheetMode("dashboard");setCurrentSite(site);setSheetOpen(true)};
const goDashboardPage=(site:Site)=>{router.push(`/dashboard?site=${encodeURIComponent(site.id)}`)};

const validate=():boolean=>{const e:Errors={};if(!form.code.trim())e.code="필수 입력";if(!form.name.trim())e.name="필수 입력";if(!form.owner.trim())e.owner="필수 입력";if(!form.phone.trim())e.phone="필수 입력";if(!form.address.trim())e.address="필수 입력";if(!form.startDate.trim())e.startDate="필수 입력";setErrors(e);return Object.keys(e).length===0};
const saveForm=()=>{if(!validate())return;if(sheetMode==="add"){const nid=String(Date.now());setData(p=>[{...form,id:nid},...p])}else if(sheetMode==="edit"){setData(p=>p.map(v=>v.id===form.id?{...form}:v))}setSheetOpen(false)};

const columns:ColumnDef<Site>[]=([
{id:"no",header:"No.",cell:({row})=>(<span className="text-slate-500">{row.index+1}</span>),enableSorting:false},
{accessorKey:"code",header:"업장코드"},
{accessorKey:"name",header:"업장명"},
{accessorKey:"owner",header:"대표자명"},
{accessorKey:"phone",header:"연락처"},
{accessorKey:"address",header:"사업장주소지"},
{accessorKey:"users",header:"앱 이용자 수"},
{accessorKey:"startDate",header:"등록일"},
{id:"link",header:"링크",cell:({row})=>(<span onClick={()=>goDashboardPage(row.original)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border bg-white text-gray-600 cursor-pointer hover:bg-gray-50"><ExternalLink className="w-3 h-3"/><span>바로가기</span></span>)},
{accessorKey:"status",header:"상태",cell:({row})=>(<span className={`px-2 py-1 rounded-md text-xs ${row.original.status==="active"?"bg-blue-100 text-blue-600":"bg-gray-100 text-gray-500"}`}>{row.original.status==="active"?"활성":"비활성"}</span>)},
{id:"actions",header:"관리",cell:({row})=>(<div className="flex items-center gap-1 text-[13px]"><span onClick={()=>openDashboard(row.original)} className="text-gray-400 underline cursor-pointer hover:text-gray-700">업장 대시보드</span><span className="text-gray-300">/</span><span onClick={()=>openEdit(row.original)} className="text-gray-400 underline cursor-pointer hover:text-gray-700">편집</span></div>)}
]);

const errCls=(k:keyof Errors)=>errors[k]?"border-red-500 focus-visible:ring-red-500":"";
const clearErr=(k:keyof Errors)=>{if(errors[k])setErrors(p=>{const n={...p};delete n[k];return n})};

const recent7ForSite=(s:Site|null)=>{if(!s)return 0;const d=new Date(s.startDate).getTime();const now=Date.now();const days=(now-d)/86400000;return days<=7?s.users:0};

return(<main className="p-5 md:p-6 space-y-4">
<div><h1 className="text-lg font-semibold">업장관리</h1></div>
<div className="flex items-center justify-between pt-1"><span className="text-xs text-slate-500">총 {sorted.length}건</span><Button onClick={openAdd} className="bg-[#0a2540] hover:bg-[#071b2e] text-white md:h-9 md:px-4">업장 등록</Button></div>
<div className="flex flex-col md:flex-row gap-3 md:gap-4">
<Input placeholder="업장코드, 업장명, 대표자명, 검색" className="w-full md:w-[300px]" value={search} onChange={(e)=>setSearch(e.target.value)}/>
<Select value={statusFilter} onValueChange={(v)=>setStatusFilter(v as "all"|"active"|"inactive")}><SelectTrigger className="w-full md:w-40"><SelectValue placeholder="상태 선택"/></SelectTrigger><SelectContent><SelectItem value="all">전체</SelectItem><SelectItem value="active">활성</SelectItem><SelectItem value="inactive">비활성</SelectItem></SelectContent></Select>
<Select value={sortOrder} onValueChange={(v)=>setSortOrder(v as SortOrder)}><SelectTrigger className="w-full md:w-32"><SelectValue placeholder="정렬"/></SelectTrigger><SelectContent><SelectItem value="desc">최신순</SelectItem><SelectItem value="asc">오래된순</SelectItem></SelectContent></Select>
</div>
<DataTable className="min-w-[600px] md:min-w-auto" columns={columns} data={paged}/>
<div className="flex justify-center gap-2 mt-4">
<Button variant="outline" disabled={page===1} onClick={()=>setPage(p=>p-1)}>이전</Button>
{Array.from({length:pageCount},(_,i)=>(<Button key={i} variant={page===i+1?"default":"outline"} onClick={()=>setPage(i+1)}>{i+1}</Button>))}
<Button variant="outline" disabled={page===pageCount} onClick={()=>setPage(p=>p+1)}>다음</Button>
</div>
<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
<SheetContent side="right" className="bg-white w-full sm:max-w-xl p-0 h-full">
{sheetMode!=="dashboard"&&(<>
<SheetHeader className="px-4 md:px-6 py-3 border-b"><SheetTitle className="text-base font-semibold">{sheetMode==="add"?"업장등록":"업장편집"}</SheetTitle></SheetHeader>
<div className="mt-0 h![calc(100%-8rem)] overflow-y-auto px-3 md:px-6 py-3">
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
<div className="space-y-1"><Label htmlFor="f-code">업장코드<span className="text-red-500 ml-1">*</span></Label><Input id="f-code" className={errCls("code")} value={form.code} onChange={(e)=>{setForm({...form,code:e.target.value});clearErr("code")}}/></div>
<div className="space-y-1"><Label htmlFor="f-name">업장명<span className="text-red-500 ml-1">*</span></Label><Input id="f-name" className={errCls("name")} value={form.name} onChange={(e)=>{setForm({...form,name:e.target.value});clearErr("name")}}/></div>
<div className="space-y-1"><Label htmlFor="f-owner">대표자명<span className="text-red-500 ml-1">*</span></Label><Input id="f-owner" className={errCls("owner")} value={form.owner} onChange={(e)=>{setForm({...form,owner:e.target.value});clearErr("owner")}}/></div>
<div className="space-y-1"><Label htmlFor="f-phone">연락처<span className="text-red-500 ml-1">*</span></Label><Input id="f-phone" className={errCls("phone")} value={form.phone} onChange={(e)=>{setForm({...form,phone:e.target.value});clearErr("phone")}}/></div>
<div className="space-y-1 md:col-span-2"><Label htmlFor="f-address">사업장주소지<span className="text-red-500 ml-1">*</span></Label><div className="flex gap-2"><Input id="f-address" className={errCls("address")} value={form.address} readOnly/><Button variant="outline" onClick={()=>openPostcode(addr=>{setForm({...form,address:addr});clearErr("address")})} disabled={!postcodeReady}>주소 검색</Button></div></div>
<div className="space-y-1"><Label htmlFor="f-start">등록일<span className="text-red-500 ml-1">*</span></Label><Input id="f-start" type="date" className={errCls("startDate")} value={form.startDate} onChange={(e)=>{setForm({...form,startDate:e.target.value});clearErr("startDate")}}/></div>
<div className="space-y-1 md:col-span-2"><Label htmlFor="f-memo">메모</Label><Textarea id="f-memo" value={form.memo||""} onChange={(e)=>setForm({...form,memo:e.target.value})} className="min-h-28 resize-y"/></div>
</div>
<div className="mt-4 space-y-3">
<div className="flex items-center gap-2"><span className="text-xs text-slate-500">알림끄기</span><Switch id="f-alarm" checked={form.alarm??true} onCheckedChange={(c)=>setForm({...form,alarm:c})}/><span className="text-xs text-slate-500">알림켜기</span></div>
<div className="flex items-center gap-2"><span className="text-xs text-slate-500">업장 비활성화</span><Switch id="f-status" checked={form.status==="active"} onCheckedChange={(c)=>setForm({...form,status:c?"active":"inactive"})}/><span className="text-xs text-slate-500">활성</span></div>
</div>
</div>
<SheetFooter className="px-4 md:px-6 py-3 border-t"><SheetClose asChild><Button variant="outline">취소</Button></SheetClose><Button onClick={saveForm} className="bg-[#0a2540] hover:bg-[#071b2e] text-white">{sheetMode==="add"?"등록":"저장"}</Button></SheetFooter>
</>)}
{sheetMode==="dashboard"&&(<>
<SheetHeader className="px-4 md:px-6 py-3 border-b"><SheetTitle className="text-base font-semibold">{currentSite?.name} 대시보드</SheetTitle></SheetHeader>
<div className="mt-0 h-[calc(100%-6rem)] overflow-y-auto px-3 md:px-6 py-3">
<div className="grid grid-cols-2 gap-3 md:gap-4 mb-3">
<div className="rounded-lg border p-3 flex items-center justify-between"><div><div className="text-slate-500 text-xs">총 앱 이용자수</div><div className="text-xl font-semibold">{(currentSite?.users??0).toLocaleString()}</div></div></div>
<div className="rounded-lg border p-3 flex items-center justify-between"><div><div className="text-slate-500 text-xs">최근 7일 가입</div><div className="text-xl font-semibold">{recent7ForSite(currentSite).toLocaleString()}</div></div></div>
</div>
<div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
<div className="rounded-lg border p-3"><div className="text-slate-500">업장코드</div><div className="font-medium">{currentSite?.code}</div></div>
<div className="rounded-lg border p-3"><div className="text-slate-500">대표자명</div><div className="font-medium">{currentSite?.owner}</div></div>
<div className="rounded-lg border p-3"><div className="text-slate-500">연락처</div><div className="font-medium">{currentSite?.phone}</div></div>
<div className="rounded-lg border p-3"><div className="text-slate-500">등록일</div><div className="font-medium">{currentSite?.startDate}</div></div>
<div className="rounded-lg border p-3 col-span-2"><div className="text-slate-500">사업장주소지</div><div className="font-medium">{currentSite?.address}</div></div>
<div className="rounded-lg border p-3 col-span-2"><div className="text-slate-500">상태</div><div className={`inline-block mt-1 px-2 py-1 rounded-md text-xs font-medium ${currentSite?.status==="active"?"bg-emerald-100 text-emerald-700":"bg-gray-100 text-gray-500"}`}>{currentSite?.status==="active"?"활성":"비활성"}</div></div>
</div>
</div>
</>)}
</SheetContent>
</Sheet>
</main>);
}