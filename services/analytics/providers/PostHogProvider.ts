import posthog from "posthog-js";
import type { PostHog } from "posthog-js";
import type { AnalyticsProvider } from "~/services/analytics/interfaces/AnalyticsProvider";

export class PostHogProvider implements AnalyticsProvider {
  private readonly token: string;
  private readonly posthogClient: PostHog | undefined;

  constructor(token: string, posthogHost: string) {
    this.token = token;
    if (token) {
      this.posthogClient = posthog.init(token, {
        api_host: posthogHost,
        person_profiles: "identified_only",
        capture_pageview: false,
        loaded: (posthog: PostHog) => {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
      });
    }
  }

  private isAvailable(): boolean {
    return this.token !== undefined;
  }

  capture(eventName: string, properties?: Record<string, unknown>): void {
    if (this.isAvailable()) {
      this.posthogClient?.capture(eventName, properties);
    }
  }

  identify(distinctId: string, properties?: Record<string, unknown>): void {
    if (this.isAvailable()) {
      this.posthogClient?.identify(distinctId, properties);
    }
  }

  reset(): void {
    if (this.isAvailable()) {
      this.posthogClient?.reset();
    }
  }

  trackPageView(url?: string): void {
    if (this.isAvailable()) {
      this.posthogClient?.capture("$pageview", {
        url: url ?? window.location.href,
        path: window.location.pathname,
      });
    }
  }
}
