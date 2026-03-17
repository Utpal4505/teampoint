/**
 * Timeline Engine - Orchestrates 90 days of realistic startup activity
 * Everything is generated based on these timeline milestones
 */

export const timeline = {
  workspaceCreated: -90,
  membersJoined: -85,
  projectsCreated: -80,
  tasksStarted: -70,
  meetingsStarted: -60,
  docsStarted: -50,
  discussionsStarted: -40,
  actionItemsStarted: -30,
  tasksCompleted: -20,
  recentActivity: -7,
}

/**
 * Convert days offset to actual date
 * Negative numbers go backwards from today
 */
export function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  // Clear time to midnight
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get a date range for a timeline phase
 */
export function getTimlinePhaseRange(
  startDays: number,
  endDays: number,
): { start: Date; end: Date } {
  return {
    start: daysAgo(startDays),
    end: daysAgo(endDays),
  }
}
