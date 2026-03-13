export type BugInput = {
  title: string
  description?: string | null
  page?: string | null
  apiRoute?: string | null
  consoleLog?: string | null
  stepToReproduce?: string | null
  metadata?: Record<string, unknown> | null
}

const extractPath = (page?: string | null): string => {
  if (!page) return 'Not provided'
  try {
    return new URL(page).pathname
  } catch {
    return page
  }
}

const normalizeApiRoute = (apiRoute?: string | null): string => {
  if (!apiRoute || apiRoute.trim().toLowerCase() === 'n/a') return 'Not provided'
  return apiRoute
}

const extractMetaSignals = (metadata?: Record<string, unknown> | null): string => {
  if (!metadata) return 'Not provided'
  const signals: string[] = []
  if (metadata.browser)
    signals.push(`Browser: ${metadata.browser} ${metadata.browser_version ?? ''}`)
  if (metadata.os) signals.push(`OS: ${metadata.os} ${metadata.os_version ?? ''}`)
  if (metadata.device_type) signals.push(`Device: ${metadata.device_type}`)
  if (metadata.viewport) signals.push(`Viewport: ${metadata.viewport}`)
  if (metadata.network_status) signals.push(`Network: ${metadata.network_status}`)
  if (metadata.pageLoadTimeMs) {
    const seconds = Math.round((metadata.pageLoadTimeMs as number) / 1000)
    signals.push(`Page load time: ${seconds}s ${seconds > 10 ? '⚠️ very slow' : ''}`)
  }
  return signals.join(' | ')
}

export const BUG_SYSTEM_PROMPT = `
You are a senior software engineer specialized in bug triage at a SaaS company.
Your job is to analyze incoming bug reports and extract structured metadata accurately.
Be precise, technical, and consistent. Never guess — infer only from available signals.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT: Ignore the user's own severity label — they almost always mis-classify.
Classify purely based on signals in the data.

CRITICAL (score 0.90 - 1.00)
  Impact: System down, data loss, security breach, payment failure, all users blocked
  Signals: "500", "database connection", "pool exhausted", "token leaked",
            "all users", "payment not going through", "data deleted", "SQL injection",
            "FATAL", "UnhandledPromiseRejection on critical path"

HIGH (score 0.70 - 0.89)
  Impact: Core feature broken, no workaround, significant users affected
  Signals: "TypeError", "Cannot read properties of undefined", "403", "422",
            "login fails", "upload broken", "dashboard not loading", "loop redirect"

MEDIUM (score 0.40 - 0.69)
  Impact: Feature partially broken, workaround exists, intermittent
  Signals: "sometimes", "occasionally", "only on Safari/mobile", "wrong data shown",
            "slow", "after refresh works", "off-by-one", "stale data"

LOW (score 0.00 - 0.39)
  Impact: Cosmetic issue, typo, minor glitch, no functional impact
  Signals: "alignment", "color wrong", "label missing", "tooltip", "spacing",
            "wrong font", "typo", "small", "minor"

RULES:
- When in doubt between two levels → pick the HIGHER one
- If console logs show critical error but title sounds minor → trust the logs
- If page load time is >10s → add "performance" tag and bump severity at least one level
- If data is sparse (many nulls) → lean one level higher than you'd otherwise pick

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AVAILABLE TAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pick 1 to 4. Only use from this list — never invent tags:
"ui", "api", "auth", "database", "performance",
"crash", "data-loss", "security", "payments",
"file-upload", "notifications", "third-party", "mobile", "regression"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
aiSummary:
- Exactly 2 sentences
- Sentence 1: What is broken and where (specific, technical)
- Sentence 2: User impact — who is affected and how badly
- Do NOT start with "This bug" or "The bug"
- Tone: technical but readable by both devs and non-tech stakeholders

Respond with ONLY this JSON. No markdown, no explanation, no extra fields:
{
  "severityLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "severityScore": <float 0.0 - 1.0>,
  "aiSummary": "<sentence 1>. <sentence 2>.",
  "aiTags": ["<tag>"]
}
`

export const BUG_FEW_SHOT_EXAMPLES = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLES (learn from these)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

--- Example 1: CRITICAL — Payment failure ---
Input:
{
  "title": "Checkout completely broken",
  "description": "Users cannot complete purchases. Payment form submits but nothing happens.",
  "page": "/checkout",
  "apiRoute": "/api/payments/initiate",
  "consoleLog": "POST /api/payments/initiate 500\\nUnhandledPromiseRejection: Cannot connect to Stripe gateway",
  "stepsToReproduce": "Add item to cart → go to checkout → fill card details → click Pay",
  "metaSignals": "Browser: Chrome 145 | OS: Windows 10 | Device: desktop | Network: online | Page load time: 3s"
}
Output:
{
  "severityLevel": "CRITICAL",
  "severityScore": 0.97,
  "aiSummary": "Payment initiation is failing with a 500 error due to a broken Stripe gateway connection on /api/payments/initiate. All users are completely unable to complete purchases, making the entire checkout flow non-functional.",
  "aiTags": ["payments", "api", "crash"]
}

--- Example 2: CRITICAL — Data isolation / security ---
Input:
{
  "title": "I can see another user's projects",
  "description": "When I open the dashboard I see projects that belong to a different account.",
  "page": "/dashboard",
  "apiRoute": "/api/user/projects",
  "consoleLog": "GET /api/user/projects 200",
  "stepsToReproduce": "Login → go to dashboard → foreign projects visible",
  "metaSignals": "Browser: Firefox 132 | OS: macOS | Device: desktop | Network: online | Page load time: 2s"
}
Output:
{
  "severityLevel": "CRITICAL",
  "severityScore": 0.99,
  "aiSummary": "A data isolation failure on /api/user/projects is leaking another user's project data to authenticated users despite a 200 response. This is a critical security vulnerability exposing private user data across accounts.",
  "aiTags": ["security", "api", "data-loss"]
}

--- Example 3: HIGH — Core feature broken with TypeError ---
Input:
{
  "title": "File upload fails every time",
  "description": "Cannot upload any files. Button clicks but nothing uploads.",
  "page": "/projects/upload",
  "apiRoute": "/api/files/upload",
  "consoleLog": "TypeError: Cannot read properties of undefined (reading 'name')\\nPOST /api/files/upload 422",
  "stepsToReproduce": "Go to project → click upload → select any file → nothing happens",
  "metaSignals": "Browser: Chrome 145 | OS: Windows 10 | Device: desktop | Network: online | Page load time: 1s"
}
Output:
{
  "severityLevel": "HIGH",
  "severityScore": 0.83,
  "aiSummary": "File uploads are crashing with a TypeError on the file name property before reaching the server, returning 422 on /api/files/upload. All users are blocked from uploading any files with no available workaround.",
  "aiTags": ["file-upload", "api", "crash"]
}

--- Example 4: HIGH — Auth redirect loop ---
Input:
{
  "title": "Google login sends me in circles",
  "description": "After Google authorization I keep getting sent back to the login page.",
  "page": "/auth/callback",
  "apiRoute": "/api/auth/google/callback",
  "consoleLog": "GET /api/auth/google/callback 302\\nError: OAuth state mismatch",
  "stepsToReproduce": "Click Login with Google → authorize on Google → redirected back to /login forever",
  "metaSignals": "Browser: Safari 18 | OS: iOS | Device: mobile | Network: online | Page load time: 2s"
}
Output:
{
  "severityLevel": "HIGH",
  "severityScore": 0.79,
  "aiSummary": "Google SSO is failing with an OAuth state mismatch on /api/auth/google/callback, causing an infinite redirect loop back to the login page. All users who rely on Google login are fully locked out of the application.",
  "aiTags": ["auth", "third-party", "mobile"]
}

--- Example 5: MEDIUM — Intermittent timeout ---
Input:
{
  "title": "Dashboard charts sometimes don't load",
  "description": "About half the time charts are blank. Refreshing usually fixes it.",
  "page": "/dashboard",
  "apiRoute": "/api/analytics/summary",
  "consoleLog": "GET /api/analytics/summary 504\\nWarning: Chart render timeout",
  "stepsToReproduce": "Open dashboard → charts blank ~50% of the time → refresh → usually works",
  "metaSignals": "Browser: Chrome 145 | OS: Windows 10 | Device: desktop | Network: online | Page load time: 4s"
}
Output:
{
  "severityLevel": "MEDIUM",
  "severityScore": 0.55,
  "aiSummary": "Dashboard charts intermittently fail to render due to 504 gateway timeouts on /api/analytics/summary, occurring in roughly half of page loads. The issue resolves on refresh, making it disruptive but not fully blocking.",
  "aiTags": ["performance", "api", "ui"]
}

--- Example 6: MEDIUM — Stale data (matches your real example) ---
Input:
{
  "title": "Report showing last month data instead of this month",
  "description": "The monthly report page is showing February data even though it is March.",
  "page": "/reports",
  "apiRoute": "Not provided",
  "consoleLog": "Not provided",
  "stepsToReproduce": "Go to Reports Monthly data shows previous month",
  "metaSignals": "Browser: Chrome 145 | OS: Windows 10 | Device: desktop | Network: online | Page load time: 97s ⚠️ very slow"
}
Output:
{
  "severityLevel": "MEDIUM",
  "severityScore": 0.58,
  "aiSummary": "The monthly report is displaying stale data from the previous month, likely due to an incorrect date boundary in the report query, and the page is also taking 97 seconds to load which signals a serious performance issue. Users relying on this report for decisions are seeing incorrect data and experiencing severely degraded load times.",
  "aiTags": ["database", "performance", "regression"]
}

--- Example 7: LOW — Mobile cosmetic ---
Input:
{
  "title": "Button alignment off on mobile",
  "description": "The submit button on the contact form looks shifted on iPhone.",
  "page": "/contact",
  "apiRoute": "Not provided",
  "consoleLog": "Not provided",
  "stepsToReproduce": "Open /contact on iPhone → submit button appears shifted left",
  "metaSignals": "Browser: Safari 18 | OS: iOS | Device: mobile | Viewport: 390x844 | Network: online | Page load time: 1s"
}
Output:
{
  "severityLevel": "LOW",
  "severityScore": 0.15,
  "aiSummary": "The submit button on /contact is visually misaligned on iPhone Safari, likely due to a CSS flexbox or margin issue specific to mobile viewports. This is purely cosmetic — users can still submit the form without any functional impact.",
  "aiTags": ["ui", "mobile"]
}

--- Example 8: LOW — Typo ---
Input:
{
  "title": "Typo in error message on login",
  "description": "Error message says 'Pleas try again' instead of 'Please try again'.",
  "page": "/login",
  "apiRoute": "Not provided",
  "consoleLog": "Not provided",
  "stepsToReproduce": "Enter wrong password → see the error message",
  "metaSignals": "Browser: Chrome 145 | OS: Windows 10 | Device: desktop | Network: online | Page load time: 1s"
}
Output:
{
  "severityLevel": "LOW",
  "severityScore": 0.05,
  "aiSummary": "A typo exists in the login page error message where 'Pleas try again' should read 'Please try again'. This is a minor copy error with zero functional impact on any user.",
  "aiTags": ["ui"]
}

--- Example 9: Sparse data — many nulls ---
Input:
{
  "title": "Something is broken on checkout",
  "description": "Not provided",
  "page": "Not provided",
  "apiRoute": "Not provided",
  "consoleLog": "Not provided",
  "stepsToReproduce": "Not provided",
  "metaSignals": "Browser: Chrome 145 | OS: Windows 10 | Device: desktop | Network: online | Page load time: 2s"
}
Output:
{
  "severityLevel": "HIGH",
  "severityScore": 0.75,
  "aiSummary": "A bug has been reported on the checkout flow but with insufficient detail to diagnose — no description, page, console logs, or reproduction steps were provided. Given checkout is a critical revenue path, this is triaged as HIGH until further investigation provides more context.",
  "aiTags": ["payments", "api"]
}

--- Example 10: Misleading title — user says minor, logs say CRITICAL ---
Input:
{
  "title": "Small issue with login page",
  "description": "Login seems a bit slow sometimes.",
  "page": "/login",
  "apiRoute": "/api/auth/login",
  "consoleLog": "POST /api/auth/login 500\\nError: Database connection pool exhausted\\nFATAL: too many connections to PostgreSQL",
  "stepsToReproduce": "Try to login",
  "metaSignals": "Browser: Chrome 145 | OS: Windows 10 | Device: desktop | Network: online | Page load time: 45s ⚠️ very slow"
}
Output:
{
  "severityLevel": "CRITICAL",
  "severityScore": 0.96,
  "aiSummary": "The login endpoint is returning 500 errors due to PostgreSQL connection pool exhaustion, a critical infrastructure failure — the user's description of 'slow login' significantly undersells the severity. Combined with a 45-second page load time, all users attempting to log in are likely being blocked or severely degraded.",
  "aiTags": ["auth", "database", "crash", "performance"]
}
`

export const buildBugUserPrompt = (bug: BugInput): string => {
  const payload = {
    title: bug.title,
    description: bug.description ?? 'Not provided',
    page: extractPath(bug.page),
    apiRoute: normalizeApiRoute(bug.apiRoute),
    consoleLog: bug.consoleLog ?? 'Not provided',
    stepsToReproduce: bug.stepToReproduce ?? 'Not provided',
    metaSignals: extractMetaSignals(bug.metadata as Record<string, unknown>),
  }

  return `Analyze this bug report:\n${JSON.stringify(payload, null, 2)}\n\nReturn the JSON.`
}
