import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeConfig = {
  sm: { outer: "h-8 w-8 border-2", inner: "h-4 w-4", icon: "h-3 w-3" },
  md: { outer: "h-16 w-16 border-4", inner: "h-8 w-8", icon: "h-5 w-5" },
  lg: { outer: "h-24 w-24 border-4", inner: "h-12 w-12", icon: "h-8 w-8" },
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const s = sizeConfig[size]

  return (
    <div className={cn("flex justify-center items-center p-8", className)}>
      <div className="relative">
        <div className={cn("rounded-full border-medical-100 border-t-medical-500 animate-spin", s.outer)}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("rounded-full bg-white flex items-center justify-center", s.inner)}>
            <Loader2 className={cn("text-medical-500 animate-spin", s.icon)} />
          </div>
        </div>
      </div>
    </div>
  )
}
