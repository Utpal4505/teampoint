import { UAParser } from 'ua-parser-js'

export interface Metadata {
  browser: string
  browser_version: string
  os: string
  os_version: string
  device_type: string
  cpu_architecture: string
  user_agent: string
  url: string
  viewport: string
  network_status: string
  timestamp: string
  pageLoadTimeMs: number
}

const isBrowser = typeof window !== 'undefined'

export function collectMetadata(): Metadata {
  const parser = new UAParser(isBrowser ? navigator.userAgent : undefined)
  const device = parser.getResult()
  return {
    browser: device.browser.name ?? 'Unknown',
    browser_version: device.browser.version ?? 'Unknown',
    os: device.os.name ?? 'Unknown',
    os_version: device.os.version ?? 'Unknown',
    device_type: device.device.type ?? 'desktop',
    cpu_architecture: device.cpu.architecture ?? 'Unknown',
    user_agent: device.ua ?? 'Unknown',
    url: isBrowser ? window.location.href : '',
    viewport: isBrowser ? `${window.innerWidth}x${window.innerHeight}` : '',
    network_status: isBrowser ? (navigator.onLine ? 'online' : 'offline') : 'unknown',
    timestamp: new Date().toISOString(),
    pageLoadTimeMs: Math.round(performance.now()),
  }
}
