'use client'

import { useState, useCallback } from 'react'

export function useUnsaved<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [original, setOriginal] = useState<T>(initialValues)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const dirty = JSON.stringify(values) !== JSON.stringify(original)

  function set<K extends keyof T>(key: K, value: T[K]) {
    setSaved(false)
    setValues(prev => ({ ...prev, [key]: value }))
  }

  function discard() {
    setValues(original)
    setSaved(false)
  }

  const save = useCallback(
    async (fn: (v: T) => Promise<void>) => {
      setSaving(true)
      try {
        await fn(values)
        setOriginal(values)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } finally {
        setSaving(false)
      }
    },
    [values],
  )

  return { values, set, dirty, saving, saved, discard, save }
}
