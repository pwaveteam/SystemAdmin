// src/app/dashboard/page.tsx
"use client"
import {useMemo,useState} from "react"
import {Card,CardHeader,CardTitle,CardContent} from "@/components/ui/card"
import {ResponsiveContainer,ComposedChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend} from "recharts"
import type {TooltipProps} from "recharts"
import {Building2,Users,PlusCircle,UserPlus,Factory,Clock8} from "lucide-react"

type Site={id:string;name:string;status:"active"|"inactive";startDate:string;users:number}
type SiteStat={month:string;newSites:number;cumSites:number}
type WorkerStat={month:string;newWorkers:number;cumWorkers:number}
type WorkerJoin={id:string;name:string;site:string;joinedAt:string}

const NAVY="#0a2540"
const sites:Site[]=[
{id:"1",name:"삼주이엔씨 1공장",status:"active",startDate:"2025-01-10",users:150},
{id:"2",name:"대한기계 본사",status:"inactive",startDate:"2025-01-20",users:95},
{id:"3",name:"한성산업 2공장",status:"active",startDate:"2025-02-18",users:120},
{id:"4",name:"우리정밀화학",status:"active",startDate:"2025-03-05",users:160},
{id:"5",name:"한일전기",status:"active",startDate:"2025-04-12",users:90},
{id:"6",name:"삼주이엔씨 2공장",status:"active",startDate:"2025-05-04",users:130},
{id:"7",name:"대일금속",status:"inactive",startDate:"2025-05-28",users:75},
{id:"8",name:"국동테크놀로지",status:"active",startDate:"2025-06-15",users:140},
{id:"9",name:"한일전기 2공장",status:"active",startDate:"2025-07-08",users:100},
{id:"10",name:"우리정밀화학 2공장",status:"inactive",startDate:"2025-07-21",users:85},
{id:"11",name:"삼주이엔씨 3공장",status:"active",startDate:"2025-08-05",users:110},
{id:"12",name:"대신기공",status:"active",startDate:"2025-08-14",users:95},
{id:"13",name:"세영테크",status:"inactive",startDate:"2025-08-22",users:70},
{id:"14",name:"한빛산업",status:"active",startDate:"2025-08-25",users:125},
{id:"15",name:"미래정밀",status:"active",startDate:"2025-08-27",users:135}
]

const siteStats:SiteStat[]=[
{month:"03",newSites:1,cumSites:4},
{month:"04",newSites:1,cumSites:5},
{month:"05",newSites:2,cumSites:7},
{month:"06",newSites:1,cumSites:8},
{month:"07",newSites:2,cumSites:10},
{month:"08",newSites:5,cumSites:15}
]

const workerStats:WorkerStat[]=[
{month:"03",newWorkers:180,cumWorkers:450},
{month:"04",newWorkers:140,cumWorkers:590},
{month:"05",newWorkers:170,cumWorkers:760},
{month:"06",newWorkers:120,cumWorkers:880},
{month:"07",newWorkers:160,cumWorkers:1040},
{month:"08",newWorkers:200,cumWorkers:1240}
]

const recentJoins:WorkerJoin[]=[
{id:"w1",name:"김민수",site:"삼주이엔씨 2공장",joinedAt:"2025-08-15"},
{id:"w2",name:"이서연",site:"국동테크놀로지",joinedAt:"2025-08-13"},
{id:"w3",name:"박지훈",site:"한일전기 2공장",joinedAt:"2025-08-12"},
{id:"w4",name:"최유진",site:"우리정밀화학",joinedAt:"2025-08-11"},
{id:"w5",name:"정현우",site:"한성산업 2공장",joinedAt:"2025-08-10"},
{id:"w6",name:"김하늘",site:"삼주이엔씨 1공장",joinedAt:"2025-08-09"},
{id:"w7",name:"오세훈",site:"대한기계 본사",joinedAt:"2025-08-08"},
{id:"w8",name:"장유나",site:"국동테크놀로지",joinedAt:"2025-08-07"},
{id:"w9",name:"윤지호",site:"한일전기",joinedAt:"2025-08-06"},
{id:"w10",name:"배도윤",site:"우리정밀화학 2공장",joinedAt:"2025-08-05"},
{id:"w11",name:"최서준",site:"삼주이엔씨 3공장",joinedAt:"2025-08-04"},
{id:"w12",name:"김예린",site:"대신기공",joinedAt:"2025-08-03"},
{id:"w13",name:"이도현",site:"세영테크",joinedAt:"2025-08-02"},
{id:"w14",name:"강민지",site:"한빛산업",joinedAt:"2025-08-01"},
{id:"w15",name:"조윤호",site:"미래정밀",joinedAt:"2025-07-31"}
]

const MonthTick=(v:string)=>`${v}월`

type TipPayload<T>={ payload:T }
type TipProps<T>={ active?:boolean; payload?:TipPayload<T>[]; label?:string|number }

function TipSites({active,payload,label}:TipProps<SiteStat>){
if(!active||!payload||!payload[0])return null
const d=payload[0].payload as SiteStat
return(
<div className="rounded-md border bg-white px-3 py-2 text-xs shadow-sm">
<div className="font-medium">{MonthTick(String(label))}</div>
<div className="mt-1 space-y-0.5">
<div>신규 업장: <span className="font-semibold text-[#3b82f6]">{d.newSites}</span></div>
</div>
</div>
)
}

function TipWorkers({active,payload,label}:TipProps<WorkerStat>){
if(!active||!payload||!payload[0])return null
const d=payload[0].payload as WorkerStat
return(
<div className="rounded-md border bg-white px-3 py-2 text-xs shadow-sm">
<div className="font-medium">{MonthTick(String(label))}</div>
<div className="mt-1 space-y-0.5">
<div>신규 가입자: <span className="font-semibold text-emerald-600">{d.newWorkers.toLocaleString()}</span></div>
</div>
</div>
)
}

export default function DashboardPage(){
const totalSites=sites.length
const activeSites=sites.filter(s=>s.status==="active").length
const workers=sites.filter(s=>s.status==="active").reduce((a,b)=>a+b.users,0)
const newSites30=sites.filter(s=>new Date(s.startDate)>=new Date("2025-07-01")).length
const recentSites=useMemo(()=>[...sites].sort((a,b)=>new Date(b.startDate).getTime()-new Date(a.startDate).getTime()).slice(0,15),[])
const recentJoinsList=useMemo(()=>[...recentJoins].slice(0,15),[])
const [range]=useState("최근 6개월")
const slicedSiteStats=siteStats.slice(-6)
const slicedWorkerStats=workerStats.slice(-6)

return(
<main className="p-5 md:p-6 space-y-5">
<div><h1 className="text-lg font-semibold">대시보드</h1></div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<Card className="shadow-sm"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-xs text-slate-500">총 업장</div><div className="text-2xl font-bold mt-1">{totalSites}</div><div className="text-xs text-slate-500 mt-1">활성 <span className="font-semibold text-blue-600">{activeSites}</span>/<span className="text-slate-400">{totalSites}</span></div></div><div className="p-2 rounded-full" style={{backgroundColor:"rgba(10,37,64,0.08)"}}><Building2 className="h-5 w-5" color={NAVY}/></div></CardContent></Card>
<Card className="shadow-sm"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-xs text-slate-500">신규 등록 업장 (30일)</div><div className="text-2xl font-bold mt-1">{newSites30}</div><div className="text-xs text-slate-500 mt-1">최근 한 달 등록</div></div><div className="p-2 rounded-full" style={{backgroundColor:"rgba(10,37,64,0.08)"}}><PlusCircle className="h-5 w-5" color={NAVY}/></div></CardContent></Card>
<Card className="shadow-sm"><CardContent className="p-4 flex items-center justify-between"><div><div className="text-xs text-slate-500">가입된 근로자 수</div><div className="text-2xl font-bold mt-1">{workers.toLocaleString()}</div><div className="text-xs text-slate-500 mt-1">전체 업장 기준</div></div><div className="p-2 rounded-full" style={{backgroundColor:"rgba(10,37,64,0.08)"}}><Users className="h-5 w-5" color={NAVY}/></div></CardContent></Card>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<Card className="md:col-span-2">
<CardHeader className="pb-2 flex items-center justify-between"><CardTitle className="text-base">업장 통합 지표</CardTitle><span className="text-xs text-slate-500">{range}</span></CardHeader>
<CardContent className="h-[320px] md:h-[380px]">
<ResponsiveContainer width="100%" height="100%">
<ComposedChart data={slicedSiteStats} margin={{top:8,right:16,left:8,bottom:0}}>
<CartesianGrid strokeDasharray="4 4"/>
<XAxis dataKey="month" tickFormatter={MonthTick} interval={0}/>
<YAxis domain={[0,100]} ticks={[0,25,50,75,100]} tickFormatter={(v:number)=>v===0?"":String(v)} interval={0} allowDecimals={false} tickMargin={8}/>
<Tooltip content={<TipSites/>}/>
<Legend/>
<Line type="monotone" dataKey="newSites" name="신규 업장" stroke="#3b82f6" strokeWidth={2.5} dot={{r:3}} activeDot={{r:5}}/>
</ComposedChart>
</ResponsiveContainer>
</CardContent>
</Card>
<Card className="flex flex-col">
<CardHeader className="pb-2 flex items-center justify-between">
<CardTitle className="text-base">신규등록 업장</CardTitle>
<span className="text-xs text-slate-500">최근 30일 기준</span>
</CardHeader>
<CardContent className="p-0 h-[320px] md:h-[380px] overflow-y-auto">
<ul className="divide-y">
{recentSites.map(s=>(
<li key={s.id} className="px-4 py-3 flex items-center justify-between gap-3">
<div className="flex items-center gap-3"><span className="p-2 rounded-full bg-blue-50"><Factory className="w-4 h-4 text-blue-600"/></span><div><div className="text-sm font-medium">{s.name}</div><div className="text-xs text-slate-500">이용자 {s.users}명</div></div></div>
<div className="flex items-center gap-1 text-xs text-slate-500"><Clock8 className="w-3 h-3"/>{s.startDate}</div>
</li>
))}
</ul>
</CardContent>
</Card>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<Card className="md:col-span-2">
<CardHeader className="pb-2 flex items-center justify-between"><CardTitle className="text-base">앱(근로자) 이용자 추세</CardTitle><span className="text-xs text-slate-500">{range}</span></CardHeader>
<CardContent className="h-[320px] md:h-[380px]">
<ResponsiveContainer width="100%" height="100%">
<ComposedChart data={slicedWorkerStats} margin={{top:8,right:16,left:8,bottom:0}}>
<CartesianGrid strokeDasharray="4 4"/>
<XAxis dataKey="month" tickFormatter={MonthTick} interval={0}/>
<YAxis domain={[0,500]} ticks={[0,100,200,300,400,500]} tickFormatter={(v:number)=>v===0?"":String(v)} interval={0} allowDecimals={false} tickMargin={8}/>
<Tooltip content={<TipWorkers/>}/>
<Legend/>
<Line type="monotone" dataKey="newWorkers" name="신규 가입자" stroke="#10b981" strokeWidth={2.5} dot={{r:3}} activeDot={{r:5}}/>
</ComposedChart>
</ResponsiveContainer>
</CardContent>
</Card>
<Card className="flex flex-col">
<CardHeader className="pb-2 flex items-center justify-between">
<CardTitle className="text-base">신규가입 근로자 수</CardTitle>
<span className="text-xs text-slate-500">최근 30일 기준</span>
</CardHeader>
<CardContent className="p-0 h-[320px] md:h-[380px] overflow-y-auto">
<ul className="divide-y">
{recentJoinsList.map(j=>(
<li key={j.id} className="px-4 py-3 flex items-center justify-between gap-3">
<div className="flex items-center gap-3"><span className="p-2 rounded-full bg-emerald-50"><UserPlus className="w-4 h-4 text-emerald-600" /></span><div><div className="text-sm font-medium">{j.name}</div><div className="text-xs text-slate-500">{j.site}</div></div></div>
<div className="flex items-center gap-1 text-xs text-slate-500"><Clock8 className="w-3 h-3"/>{j.joinedAt}</div>
</li>
))}
</ul>
</CardContent>
</Card>
</div>
</main>
)
}