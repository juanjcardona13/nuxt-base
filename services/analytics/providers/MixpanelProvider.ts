import mixpanel from "mixpanel-browser";
import type { AnalyticsProvider } from "~/services/analytics/interfaces/AnalyticsProvider";

export class MixpanelProvider implements AnalyticsProvider {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
    if (token) {
      mixpanel.init(token, {
        ignore_dnt: true,
        debug: true,
        track_pageview: true,
        persistence: "localStorage",
      });
    }
  }

  private isAvailable(): boolean {
    return this.token !== undefined;
  }

  capture(eventName: string, properties?: Record<string, unknown>): void {
    if (this.isAvailable()) {
      mixpanel?.track(eventName, properties);
    }
  }

  identify(distinctId: string, properties?: Record<string, unknown>): void {
    if (this.isAvailable()) {
      mixpanel?.identify(distinctId);
      if (properties) {
        mixpanel?.people.set(properties);
      }
    }
  }

  reset(): void {
    if (this.isAvailable()) {
      mixpanel?.reset();
    }
  }

  trackPageView(url?: string): void {
    if (this.isAvailable()) {
      mixpanel?.track("pageview", {
        url: url ?? location.href,
        path: location.pathname,
      });
    }
  }
}
