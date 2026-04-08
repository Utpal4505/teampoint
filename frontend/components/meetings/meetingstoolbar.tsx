'use client'

import { List, LayoutGrid, ChevronDown, Filter } from 'lucide-react'
import { useState } from 'react'
import type { MeetingStatus } from '@/features/meetings/types'

export type MeetingViewMode = 'grid' | 'list'
export type MeetingStatusFilter = 'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

interface MeetingsToolbarProps {
  view: MeetingViewMode
  onViewChange: (view: MeetingViewMode) => void
  statusFilter: MeetingStatusFilter
  onStatusChange: (status: MeetingStatusFilter) => void
  statusOpen: boolean
  onStatusToggle: () => void
}

const STATUS_OPTIONS: { label: string; value: MeetingStatusFilter; color: string }[] = [
  { label: 'All Status', value: 'ALL', color: 'text-muted-foreground' },
  { label: 'Scheduled', value: 'SCHEDULED', color: 'text-emerald-600' },
  { label: 'Completed', value: 'COMPLETED', color: 'text-blue-600' },
  { label: 'Cancelled', value: 'CANCELLED', color: 'text-muted-foreground' },
]

export default function MeetingsToolbar({
  view,
  onViewChange,
  statusFilter,
  onStatusChange,
  statusOpen,
  onStatusToggle,
}: MeetingsToolbarProps) {
  return (
    <div className="border-b border-border bg-background/50 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        {/* View Toggle */}
        <div className="flex items-center gap-2 p-1 rounded-lg border border-border bg-muted/30">
          {(['grid', 'list'] as MeetingViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200
                ${
                  view === v
                    ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                }`}
              title={v === 'grid' ? 'Grid view' : 'List view'}
            >
              {v === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
              <span className="hidden sm:inline">
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={onStatusToggle}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-xs font-medium
              ${
                statusFilter === 'ALL'
                  ? 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'
              }`}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">{statusFilter}</span>
            <span className="sm:hidden text-xs">Filter</span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {statusOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
              <div className="p-2">
                {STATUS_OPTIONS.map((option, idx) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onStatusChange(option.value)
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-150
                      ${
                        statusFilter === option.value
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                      ${idx === 0 ? 'mb-1' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {option.value !== 'ALL' && (
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${option.color}`}
                        />
                      )}
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
