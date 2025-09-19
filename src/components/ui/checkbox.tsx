"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props=React.ComponentProps<typeof CheckboxPrimitive.Root>

function Checkbox({className,...props}:Props){
return(
<CheckboxPrimitive.Root
data-slot="checkbox"
className={cn(
"peer size-5 shrink-0 rounded-[6px] border outline-none shadow-xs transition",
"bg-white border-gray-300 text-transparent",
"focus-visible:ring-[3px] focus-visible:ring-[#0F1E3A]/40 focus-visible:border-[#0F1E3A]/60",
"disabled:cursor-not-allowed disabled:opacity-50",
"data-[state=checked]:bg-[#0F1E3A] data-[state=checked]:border-[#0F1E3A] data-[state=checked]:text-white",
className
)}
{...props}
>
<CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center text-white">
<CheckIcon className="size-4 stroke-[3]" />
</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
)
}

export { Checkbox }