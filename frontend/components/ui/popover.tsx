'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface PopoverContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined)

const Popover = ({ open: controlledOpen, onOpenChange, children }: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
    children?: React.ReactNode
  }
>(({ onClick, asChild, children, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error('PopoverTrigger must be used within Popover')

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        context.setOpen(!context.open)
        children.props.onClick?.(e)
      },
    })
  }

  return (
    <button
      ref={ref}
      onClick={e => {
        context.setOpen(!context.open)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
PopoverTrigger.displayName = 'PopoverTrigger'

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: 'start' | 'center' | 'end'
  }
>(({ className, align = 'start', ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error('PopoverContent must be used within Popover')

  const alignClass = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }[align]

  if (!context.open) return null

  return (
    <div
      ref={ref}
      className={cn(
        'absolute top-full mt-2 z-50 rounded-lg border border-border bg-card shadow-xl ring-1 ring-foreground/5 animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in',
        alignClass,
        className,
      )}
      {...props}
    />
  )
})
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
