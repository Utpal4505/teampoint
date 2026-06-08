
const MAX_ERRORS = 5

export interface CapturedError {
  message: string
  source?: string   // file URL
  line?: number
  col?: number
  timestamp: string
}

// Module-level ring buffer — persists across renders
const _buffer: CapturedError[] = []

function push(entry: CapturedError) {
  _buffer.push(entry)
  if (_buffer.length > MAX_ERRORS) _buffer.shift()  // drop oldest
}

let _initialized = false


export function initConsoleCapture() {
  if (typeof window === 'undefined' || _initialized) return
  _initialized = true

  const prevOnError = window.onerror
  window.onerror = (message, source, lineno, colno, _error) => {
    push({
      message: String(message),
      source,
      line: lineno ?? undefined,
      col: colno ?? undefined,
      timestamp: new Date().toISOString(),
    })
    return prevOnError ? prevOnError(message, source, lineno, colno, _error) : false
  }

  const prevOnUnhandled = window.onunhandledrejection
  window.onunhandledrejection = (event) => {
    push({
      message: event.reason?.message ?? String(event.reason) ?? 'Unhandled rejection',
      timestamp: new Date().toISOString(),
    })
    if (prevOnUnhandled) prevOnUnhandled.call(window, event)
  }

  const originalConsoleError = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    push({
      message: args
        .map(a => (a instanceof Error ? a.message : typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' '),
      timestamp: new Date().toISOString(),
    })
    originalConsoleError(...args)
  }
}

export function getConsoleErrors(): CapturedError[] {
  return [..._buffer]
}

export function clearConsoleErrors() {
  _buffer.length = 0
}