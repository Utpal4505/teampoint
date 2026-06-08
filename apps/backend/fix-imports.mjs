// fix-imports.mjs  — run with: node fix-imports.mjs
import { readFileSync, writeFileSync } from 'fs'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

function walk(dir) {
  const files = []
  for (const f of readdirSync(dir)) {
    const full = join(dir, f)
    if (statSync(full).isDirectory()) files.push(...walk(full))
    else if (f.endsWith('.ts')) files.push(full)
  }
  return files
}

let count = 0
for (const file of walk('./src')) {
  const original = readFileSync(file, 'utf8')
  const fixed = original.replace(
    /(from\s+['"])(\..*?)\.ts(['"])/g,
    '$1$2.js$3'
  )
  if (fixed !== original) {
    writeFileSync(file, fixed)
    console.log('Fixed:', file)
    count++
  }
}
console.log(`\nDone. Fixed ${count} files.`)