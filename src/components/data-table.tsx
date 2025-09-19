"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type Site={id:string;name:string;workers:number;openIssues:number;overdueIssues:number;status:"active"|"inactive"}

interface DataTableProps<TData>{columns:ColumnDef<TData,any>[];data:TData[];className?:string}

export function DataTable<TData>({columns,data,className}:DataTableProps<TData>){
const table=useReactTable<TData>({data,columns,getCoreRowModel:getCoreRowModel()})
return(
<div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
<Table className={`min-w-[600px] md:min-w-auto ${className??""}`}>
<TableHeader className="bg-slate-100">
{table.getHeaderGroups().map(h=>(
<TableRow key={h.id}>
{h.headers.map(header=>(
<TableHead key={header.id} className="font-semibold text-slate-700">
{header.isPlaceholder?null:flexRender(header.column.columnDef.header,header.getContext())}
</TableHead>
))}
</TableRow>
))}
</TableHeader>
<TableBody>
{table.getRowModel().rows?.length?table.getRowModel().rows.map((row,i)=>(
<TableRow key={row.id} className={i%2===0?"bg-white hover:bg-slate-50":"bg-slate-50 hover:bg-slate-100"}>
{row.getVisibleCells().map(cell=>(
<TableCell key={cell.id} className="text-slate-600">
{flexRender(cell.column.columnDef.cell,cell.getContext())}
</TableCell>
))}
</TableRow>
)):(
<TableRow>
<TableCell colSpan={columns.length} className="text-center text-slate-500">
등록된 항목이 없습니다
</TableCell>
</TableRow>
)}
</TableBody>
</Table>
</div>
)
}