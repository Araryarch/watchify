import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const typographyVariants = cva(
  "text-white",
  {
    variants: {
      variant: {
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
        h4: "scroll-m-20 text-xl font-semibold tracking-tight",
        p: "leading-7 [&:not(:first-child)]:mt-6",
        blockquote: "mt-6 border-l-2 border-white/20 pl-6 italic",
        list: "my-6 ml-6 list-disc [&>li]:mt-2",
        inlineCode: "relative rounded bg-neutral-800 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        lead: "text-xl text-neutral-400",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-sm text-neutral-400",
        label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      },
      color: {
        default: "text-white",
        primary: "text-[#00dc74]",
        muted: "text-neutral-400",
        destructive: "text-red-500",
        black: "text-black",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      variant: "p",
      color: "default",
      align: "left",
    },
  }
)

interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

export function Typography({
  className,
  variant,
  color,
  align,
  as,
  ...props
}: TypographyProps) {
  let Comp = as

  if (!Comp) {
    if (variant === "h1") Comp = "h1"
    else if (variant === "h2") Comp = "h2"
    else if (variant === "h3") Comp = "h3"
    else if (variant === "h4") Comp = "h4"
    else if (variant === "blockquote") Comp = "blockquote"
    else if (variant === "list") Comp = "ul"
    else if (variant === "inlineCode") Comp = "code"
    else if (variant === "label") Comp = "label"
    else Comp = "p"
  }

  return (
    <Comp
      className={cn(typographyVariants({ variant, color, align, className }))}
      {...props}
    />
  )
}
