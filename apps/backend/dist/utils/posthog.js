import { PostHog } from 'posthog-node';
import { env } from '../config/env.js';
export const posthog = new PostHog(env.POSTHOG_PROJECT_TOKEN, {
    host: 'https://us.i.posthog.com',
});
export function trackPosthogEvent(userId, event, properties) {
    posthog.capture({
        distinctId: String(userId),
        event,
        ...(properties ? { properties } : {}),
    });
}
//# sourceMappingURL=posthog.js.map