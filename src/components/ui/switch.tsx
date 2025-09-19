// src/components/ui/switch.tsx
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

type SwitchProps=React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
type SwitchRef=React.ElementRef<typeof SwitchPrimitives.Root>

const Switch=React.forwardRef<SwitchRef,SwitchProps>(({className,...props},ref)=>(
<SwitchPrimitives.Root
ref={ref}
className={cn(
"peer inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#001F3F] data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-700",
className
)}
{...props}
>
<SwitchPrimitives.Thumb
className="pointer-events-none size-5 rounded-full bg-white shadow transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5"
/>
</SwitchPrimitives.Root>
))
Switch.displayName=SwitchPrimitives.Root.displayName
export {Switch}