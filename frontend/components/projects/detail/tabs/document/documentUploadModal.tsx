'use client'

import { useState, useRef } from 'react'
import { X, Upload, FileText, CloudUpload } from 'lucide-react'

interface DocumentUploadModalProps {
  onClose: () => void
}

export default function DocumentUploadModal({ onClose }: DocumentUploadModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const canSubmit = title.trim().length > 0 && file !== null

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2
        w-full max-w-[440px] rounded-2xl border border-border bg-background
        shadow-2xl shadow-black/30 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Upload size={13} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Upload Document</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5">
          {/* Drop zone — primary focus */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            className={`relative flex flex-col items-center justify-center gap-3
              rounded-2xl border-2 border-dashed px-6 py-8 cursor-pointer
              transition-all duration-200
              ${
                dragOver
                  ? 'border-primary/60 bg-primary/8 scale-[1.01]'
                  : file
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border/50 bg-muted/10 hover:border-border/80 hover:bg-muted/20'
              }`}
          >
            {file ? (
              <>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <FileText size={22} className="text-primary" />
                </div>
                <div className="flex flex-col items-center gap-0.5 w-full px-2">
                  {/* Truncate long filename — show stem + extension */}
                  <p
                    className="text-sm font-semibold text-foreground w-full text-center truncate max-w-[280px]"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground/50">
                    {(file.size / 1024).toFixed(1)} KB
                    <span className="mx-1.5 opacity-40">·</span>
                    {file.name.split('.').pop()?.toUpperCase() ?? 'FILE'}
                  </p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="text-[11px] text-muted-foreground/50 hover:text-red-400
                    transition-colors underline underline-offset-2"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl
                  transition-colors ${dragOver ? 'bg-primary/20' : 'bg-muted/40'}`}
                >
                  <CloudUpload
                    size={22}
                    className={dragOver ? 'text-primary' : 'text-muted-foreground/40'}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground/70">
                    {dragOver ? 'Drop it here' : 'Click to browse or drag & drop'}
                  </p>
                  <p className="text-[11px] text-muted-foreground/40 mt-1">
                    PDF, DOCX, XLSX, PNG, JPG — up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={e => {
              if (e.target.files?.[0]) setFile(e.target.files[0])
            }}
          />

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
              Title <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sprint Plan"
              className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm
                text-foreground placeholder:text-muted-foreground/30 outline-none
                focus:border-primary/40 focus:bg-background transition-all duration-150"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
              Description
              <span className="ml-1.5 text-[10px] normal-case font-normal text-muted-foreground/40">
                optional
              </span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this document about?"
              rows={2}
              className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm
                text-foreground placeholder:text-muted-foreground/30 outline-none resize-none
                focus:border-primary/40 focus:bg-background transition-all duration-150"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border/60
          bg-muted/10"
        >
          <button
            onClick={onClose}
            className="rounded-xl border border-border/60 bg-background px-4 py-2 text-xs
              font-medium text-muted-foreground hover:bg-accent hover:text-foreground
              transition-all duration-150"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold
              text-primary-foreground hover:bg-primary/90 transition-all duration-150
              disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Upload size={11} /> Upload
          </button>
        </div>
      </div>
    </>
  )
}
