"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
      <Sonner
          theme={theme as ToasterProps["theme"]}
          className="toaster group"
          position="top-center"
          icons={{
              success: <CircleCheckIcon className="size-5" />,
              info: <InfoIcon className="size-5" />,
              warning: <TriangleAlertIcon className="size-5" />,
              error: <OctagonXIcon className="size-5" />,
              loading: <Loader2Icon className="size-5 animate-spin" />,
          }}
          style={
              {
                  "--normal-bg": "var(--popover)",
                  "--normal-text": "var(--popover-foreground)",
                  "--normal-border": "var(--border)",
                  "--border-radius": "var(--radius)",
              } as React.CSSProperties
          }
          toastOptions={{
              ...toastOptions,
              classNames: {
                  toast: "!text-base !py-4 !px-5 !min-w-[320px]",
                  success: "!bg-green-600 !text-white !border-green-700",
                  error: "!bg-red-600 !text-white !border-red-700",
                  info: "!bg-blue-600 !text-white !border-blue-700",
                  ...toastOptions?.classNames,
              },
          }}
          {...props}
      />
  )
}

export { Toaster }
